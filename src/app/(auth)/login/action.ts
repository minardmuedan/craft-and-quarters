'use server'

import { createAction } from '@/lib/create-action'
import { getCredentialUserByEmailId } from '@/lib/db/utils/user'
import { getIp } from '@/lib/helpers'
import { rateLimiter } from '@/lib/rate-limiter'
import { loginSchema } from '@/lib/schema'
import { createSession } from '@/lib/session'
import argon2 from 'argon2'

export const loginAction = createAction(async (props: unknown) => {
  const validatedFields = loginSchema.safeParse(props)
  if (!validatedFields.success) throw validatedFields.error.errors[0].message
  rateLimiter(`login-${await getIp()}`, 10, 60)

  const { email, password } = validatedFields.data
  const user = await getCredentialUserByEmailId(email)
  if (!user || !user.password) throw 'User not found'

  const comparePassword = await argon2.verify(user.password, password)
  if (!comparePassword) throw 'Incorrect email or password'

  await createSession(user.id)
})
