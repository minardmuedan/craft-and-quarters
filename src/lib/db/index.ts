import { drizzle } from 'drizzle-orm/libsql'
import * as schema from './schema'

const database_url = process.env.DATABASE_URL
if (!database_url) throw 'undefined database url'

export const db = drizzle(database_url, { schema })
