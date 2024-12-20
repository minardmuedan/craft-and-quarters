import { eq } from 'drizzle-orm'
import { db } from '..'
import { userTable, verificationTokenTable } from '../schema'

export const createVerificationTokenDb = async ({ ...values }: typeof verificationTokenTable.$inferInsert) =>
  await db.insert(verificationTokenTable).values(values)

export const getVerificationTokenDb = async (tokenId: string) =>
  await db.query.verificationTokenTable.findFirst({ where: eq(verificationTokenTable.id, tokenId) })

export const getVerificationTokenByTokenDb = async (token: string) =>
  await db.query.verificationTokenTable.findFirst({ where: eq(verificationTokenTable.token, token) })

export const getVerificationTokenAndUserDb = async (tokenId: string) =>
  await db
    .select({ user: userTable, verificationToken: verificationTokenTable })
    .from(verificationTokenTable)
    .innerJoin(userTable, eq(verificationTokenTable.userId, userTable.id))
    .where(eq(verificationTokenTable.id, tokenId))

export const renewVerificationTokenDb = async (tokenId: string) =>
  await db
    .update(verificationTokenTable)
    .set({ expiredAt: new Date(Date.now() + 30 * 60 * 1000).toISOString() })
    .where(eq(verificationTokenTable.id, tokenId))

export const deleteverificationTokenDb = async (tokenId: string) =>
  await db.delete(verificationTokenTable).where(eq(verificationTokenTable.id, tokenId))
