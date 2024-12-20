import { and, eq } from 'drizzle-orm'
import { db } from '..'
import { userTable } from '../schema'

export const createUserDb = async ({ ...values }: typeof userTable.$inferInsert) => await db.insert(userTable).values(values)

export const getCredentialUserByEmailId = async (email: string) =>
  await db.query.userTable.findFirst({ where: and(eq(userTable.email, email), eq(userTable.provider, 'credentials')) })

export const verifyUserEmailDb = async (userId: string) =>
  await db
    .update(userTable)
    .set({ emailVerified: new Date().toISOString(), updatedAt: new Date().toISOString() })
    .where(eq(userTable.id, userId))

export const deleteUserDb = async (userId: string) => await db.delete(userTable).where(eq(userTable.id, userId))
