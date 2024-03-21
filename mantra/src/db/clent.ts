import { drizzle } from "drizzle-orm/neon-http";
import { neon } from "@neondatabase/serverless";
import dotenv from 'dotenv';
import * as schema from './schema';
dotenv.config();

const queryClient = neon(process.env.NEON_DATABASE_URL!);
const db = drizzle(queryClient, {
    schema
});

export default db;