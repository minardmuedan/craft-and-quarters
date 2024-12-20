'use server'

import { createAction } from '@/lib/create-action'
import { verifyUserEmailDb } from '@/lib/db/utils/user'
import { deleteverificationTokenDb, getVerificationTokenByTokenDb } from '@/lib/db/utils/verification-token'
import { deleteCookie } from '@/lib/helpers'
import { createSession } from '@/lib/session'

export const verifyUserEmailAction = createAction(async (token: string) => {
  await deleteCookie('verification')

  const verificationToken = await getVerificationTokenByTokenDb(token)
  if (!verificationToken) throw 'Verification token not found'

  if (Date.now() > new Date(verificationToken.expiredAt).getTime()) throw 'Expired Verification Token, Please signup'
  await verifyUserEmailDb(verificationToken.userId)
  await deleteverificationTokenDb(verificationToken.id).catch(() => {})

  await createSession(verificationToken.userId)
})
