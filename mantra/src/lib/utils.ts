import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"
import crypto from "crypto"
 
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}



function generateEncryptionKey(password: string): Buffer {
  if (!password) {
    throw new Error("Password is required for key generation.");
  }

  // Use a suitable hashing algorithm (e.g., SHA-256) to create a 32-byte key
  const key = crypto.createHash('sha256').update(password, 'utf8').digest();
  return key;
}


export function encryptPrivateKey(password: string, secretKey: Uint8Array): string {
  if (!password) {
    throw new Error("Password is required for encryption.");
  }

  const key = generateEncryptionKey(password);
  const iv = crypto.randomBytes(16); // Generate a random IV

  const cipher = crypto.createCipheriv('aes-256-cbc', key, iv);
  const secretKeyBuffer = Buffer.from(secretKey);

  let encryptedPrivateKey = Buffer.concat([
    cipher.update(secretKeyBuffer),
    cipher.final(),
  ]);

  return iv.toString('hex') + ":" +encryptedPrivateKey.toString('hex');
}


export function decryptPrivateKey(password: string, _encryptedPrivateKey: string): Uint8Array {
  if (!password) {
    throw new Error("Password is required for decryption.");
  }

  const key = generateEncryptionKey(password);
  const [_iv, encryptedPrivateKey] = _encryptedPrivateKey.split(':')
  const iv = Buffer.from(_iv, 'hex'); // Generate a random IV

  const decipher = crypto.createDecipheriv('aes-256-cbc', key, iv);

  const encryptedBuffer = Buffer.from(encryptedPrivateKey, 'hex');
  let decryptedBuffer = Buffer.concat([
    decipher.update(encryptedBuffer),
    decipher.final(),
  ]);

  return new Uint8Array(decryptedBuffer);
}