import { defineConfig } from 'drizzle-kit'
import dotenv from 'dotenv'

dotenv.config({ path: '.env.local' })

const database_url = process.env.DATABASE_URL
if (!database_url) throw 'undefined database url'

export default defineConfig({
  dialect: 'sqlite',
  schema: './src/lib/db/schema.ts',
  out: './src/lib/db/schema.ts/migrations',
  dbCredentials: { url: database_url },
})
