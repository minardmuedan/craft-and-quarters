import 'server-only'

import { encodeHexLowerCase } from '@oslojs/encoding'
import { sha256 } from '@oslojs/crypto/sha2'
import { generateId, getCookie, getIp, setCookie } from './helpers'
import { createSessionDb, deleteSessionDb, getSessionAndUserDb, renewSessionDb } from './db/utils/session'

export async function createSession(userId: string) {
  const id = generateId(32)
  const sessionId = encodeHexLowerCase(sha256(new TextEncoder().encode(id)))
  const ipAddress = await getIp().catch(() => undefined)
  await createSessionDb({ id: sessionId, userId, ipAddress })

  await setCookie('session', id, {
    httpOnly: true,
    sameSite: 'strict',
    secure: process.env.NODE_ENV === 'production',
    maxAge: 60 * 60 * 24 * 30,
  })
}

export async function validateSession() {
  const cookieSessionid = await getCookie('session')
  if (!cookieSessionid) return { user: null, session: null }

  const result = await getSessionAndUserDb(encodeHexLowerCase(sha256(new TextEncoder().encode(cookieSessionid))))
  if (!result[0]?.user) return { user: null, session: null }

  const { user, session } = result[0]
  const isExpired = Date.now() + 30 * 24 * 60 * 60 * 1000 - new Date(session.updatedAt).getTime() <= 0
  if (isExpired) {
    await deleteSessionDb(session.id)
    return { user: null, session: null }
  }

  const isSessionPast15Days = Date.now() + 15 * 24 * 60 * 60 * 1000 - new Date(session.updatedAt).getTime() <= 0
  if (isSessionPast15Days) await renewSessionDb(session.id)

  return { user, session }
}
