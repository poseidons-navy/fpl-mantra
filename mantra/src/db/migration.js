import { drizzle } from 'drizzle-orm/neon-http';
import { migrate } from 'drizzle-orm/neon-http/migrator';
import {neon} from '@neondatabase/serverless';
import dotenv from 'dotenv';
dotenv.config();
console.log(process.env.NEON_DATABASE_URL);
const sql = neon(process.env.NEON_DATABASE_URL);
const db = drizzle(sql);

async function main() {
    try {
        await migrate(db, {
            migrationsFolder: "src/db/migrations"
        });
        console.log("Migrate complete")
    } catch(err) {
        console.log("Could Not Migrate");
        console.log(err);
    }
}

main();