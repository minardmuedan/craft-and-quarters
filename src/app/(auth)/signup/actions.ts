'use server'

import { createUserDb, deleteUserDb, getCredentialUserByEmailId } from '@/lib/db/utils/user'
import { createVerificationTokenDb, getVerificationTokenDb, renewVerificationTokenDb } from '@/lib/db/utils/verification-token'
import { deleteCookie, generateId, getCookie, getIp, setCookie } from '@/lib/helpers'
import { rateLimiter } from '@/lib/rate-limiter'
import { signUpSchema } from '@/lib/schema'
import { sendEmail } from '@/lib/send-email'
import { createAction } from '@/lib/create-action'
import argon2 from 'argon2'

export const signUpAction = createAction(async (props: unknown) => {
  const validatedFields = signUpSchema.safeParse(props)
  if (!validatedFields.success) throw validatedFields.error.errors[0].message

  rateLimiter(`signup-${await getIp()}`, 6, 180)

  const { email, password } = validatedFields.data

  const existingUser = await getCredentialUserByEmailId(email)
  if (existingUser) {
    if (existingUser.emailVerified) throw 'Email alredy in use'
    await deleteUserDb(existingUser.id)
  }

  const userId = generateId()
  const hashedPassword = await argon2.hash(password)
  await createUserDb({ id: userId, email, password: hashedPassword, provider: 'credentials' })

  const tokenId = generateId()
  const token = generateId(32)
  await createVerificationTokenDb({ id: tokenId, token, userId, expiredAt: new Date(Date.now() + 30 * 60 * 1000).toISOString() })

  await sendEmail(email, token)
  await setCookie('verification', tokenId, { path: '/', httpOnly: true, sameSite: 'lax', maxAge: 30 * 60 })
})

export const resendVerificationTokenAction = createAction(async () => {
  rateLimiter(`resend-verification-${await getIp()}`, 1, 30)

  const tokenId = await getCookie('verification')

  if (tokenId) {
    const verificationToken = await getVerificationTokenDb(tokenId)
    if (verificationToken) {
      await renewVerificationTokenDb(tokenId)
      return
    }
  }

  await deleteCookie('verification')
  throw 'Verification token not found'
})
