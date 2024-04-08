"use client"
import { WalletMultiButton } from "@solana/wallet-adapter-react-ui";
import { useWallet } from "@solana/wallet-adapter-react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import {Button} from "@/components/ui/button";
import {getManagerId} from "@/db/getions";
import Link from "next/link";

export default function LoginDialog() {
  const {publicKey} = useWallet();
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
  const [notHaveAccount, setNotHaveAccount] = useState<boolean>(false);
  const router = useRouter();
  return (
    <div className="m-auto w-1/2 h-1/2">
      <h2>Login</h2>
      <p className="mt-4">Please connect your wallet to login</p>
      {isLoggedIn === false && publicKey? <Button onClick={async() => {
        try {
          if (!publicKey) {
            setIsLoggedIn(false);
            console.log("Wallet Not Connected");
            return
          }
          const account = await getManagerId(publicKey.toBase58());
          if (!account || account.length === 0) {
            console.log("Do Not Have An Account");
            setNotHaveAccount(true)
            setIsLoggedIn(false);
            return
          }
          router.push('/dashboard');
        } catch(err) {
          console.log("Error", err);
        }
        
      }}> Log In

      </Button> : <WalletMultiButton />}

      {notHaveAccount ? <p>
        You dont have an account please create one <Link className=" text-fuchsia-600 hover:text-fuchsia-700 " href="/dashboard/create-account">Create Account</Link>
      </p>: <p></p>}
    </div>
  );
}
