import type { Config } from "drizzle-kit"
import * as dotenv from 'dotenv'

dotenv.config({ path: '.env' });

// This file is a configuration file for drizzle-kit. 
// It tells drizzle-kit how to connect to the database and where to find the schema file.

export default {
    driver: "pg",
    schema: "./src/lib/db/*",
    out: './drizzle',
    dbCredentials: {
      connectionString: process.env.DATABASE_URL!,
    },
  } satisfies Config;