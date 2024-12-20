import { z } from 'zod'

const password = z
  .string()
  .min(8, 'At least 8 characters long')
  .max(255, '255 characters max')
  .regex(/[A-Z]/, 'Must contain one uppercase letter')
  .regex(/[a-z]/, 'Must contain one lowercase letter')
  .regex(/[0-9]/, 'Must contain one number')
  .regex(/^[^\s]+$/, 'Must not contain spaces')

export const signUpSchema = z
  .object({ email: z.string().min(1, 'Required').email(), password, confirmPassword: z.string().min(1, 'Required') })
  .refine(({ password, confirmPassword }) => password === confirmPassword, {
    message: "Password don't match",
    path: ['confirmPassword'],
  })

export type SignUpSchema = z.infer<typeof signUpSchema>

export const loginSchema = z.object({ email: z.string().min(1, 'Required').email(), password: z.string().min(1, 'Required') })
export type LoginSchema = z.infer<typeof loginSchema>
