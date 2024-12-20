import { eq } from 'drizzle-orm'
import { db } from '..'
import { sessionTable, userTable } from '../schema'

export const createSessionDb = async ({ ...values }: typeof sessionTable.$inferInsert) =>
  await db.insert(sessionTable).values(values)

export const getSessionAndUserDb = async (sessionId: string) =>
  await db
    .select({
      user: { email: userTable.email, provider: userTable.provider },
      session: sessionTable,
    })
    .from(sessionTable)
    .innerJoin(userTable, eq(sessionTable.userId, userTable.id))
    .where(eq(sessionTable.id, sessionId))

export const renewSessionDb = async (sessionId: string) =>
  await db.update(sessionTable).set({ updatedAt: new Date().toISOString() }).where(eq(sessionTable.id, sessionId))

export const deleteSessionDb = async (sessionId: string) => await db.delete(sessionTable).where(eq(sessionTable.id, sessionId))
