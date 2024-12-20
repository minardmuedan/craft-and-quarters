import { sql } from 'drizzle-orm'
import { sqliteTable, text } from 'drizzle-orm/sqlite-core'

export const userTable = sqliteTable('user', {
  id: text('id').primaryKey(),
  oauthId: text('oauth-id'),
  provider: text('provider').$type<'credentials' | 'google' | 'github'>().notNull(),
  email: text('email').notNull(),
  emailVerified: text('email-verified'),
  password: text('password'),
  updatedAt: text('updated-at')
    .default(sql`(current_timestamp)`)
    .notNull(),
  createdAt: text('created-at')
    .default(sql`(current_timestamp)`)
    .notNull(),
})

export const sessionTable = sqliteTable('session', {
  id: text('id').primaryKey(),
  userId: text('user-id')
    .references(() => userTable.id)
    .notNull(),
  ipAddress: text('ip-address'),
  updatedAt: text('updated-at')
    .default(sql`(current_timestamp)`)
    .notNull(),
  createdAt: text('created-at')
    .default(sql`(current_timestamp)`)
    .notNull(),
})

export const verificationTokenTable = sqliteTable('verification-token', {
  id: text('id').primaryKey(),
  token: text('token').notNull().unique(),
  userId: text('user-id')
    .references(() => userTable.id, { onDelete: 'cascade' })
    .notNull(),
  expiredAt: text('expired-at').notNull(),
  createdAt: text('created-at')
    .default(sql`(current_timestamp)`)
    .notNull(),
})

export const forgotPasswordTokenTable = sqliteTable('forgot-password-token', {
  id: text('id').primaryKey(),
  userId: text('user-id')
    .references(() => userTable.id)
    .notNull(),
  expiredAt: text('expired-at').notNull(),
  createdAt: text('created-at')
    .default(sql`(current_timestamp)`)
    .notNull(),
})
