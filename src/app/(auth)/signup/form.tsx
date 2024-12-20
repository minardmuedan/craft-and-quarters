'use client'

import { Button } from '@/components/ui/button'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import FormError from '@/components/ui/form-error'
import { Input } from '@/components/ui/input'
import LoaderIcon from '@/components/ui/loader-icon'
import { useCountDown } from '@/hooks/coutndown'
import { useIsHydrated } from '@/hooks/isHydrated'
import { signUpSchema, SignUpSchema } from '@/lib/schema'
import { zodResolver } from '@hookform/resolvers/zod'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { resendVerificationTokenAction, signUpAction } from './actions'
import { Send } from 'lucide-react'

export default function SignUpForm() {
  const isHydrated = useIsHydrated()
  const { time, setTime } = useCountDown()

  const form = useForm<SignUpSchema>({
    resolver: zodResolver(signUpSchema),
    defaultValues: { email: '', password: '', confirmPassword: '' },
  })

  const fields = [
    { label: 'Email Address', name: 'email', type: 'email' },
    { label: 'Password', name: 'password' },
    { label: 'Confirm Password', name: 'confirmPassword' },
  ] as const

  const onSubmit = async (values: SignUpSchema) => {
    const actionResult = await signUpAction(values)

    if (actionResult?.type === 'error') form.setError('root', { message: actionResult.message })
    if (actionResult?.type === 'limit') setTime(actionResult.remainingTime)
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        {fields.map(({ name, label }, i) => (
          <FormField
            key={i}
            control={form.control}
            name={name}
            render={({ field }) => (
              <FormItem>
                <FormLabel>{label}</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        ))}
        <FormError message={form.formState.errors.root?.message} />
        <Button className="w-full" disabled={!isHydrated || time > 0 || form.formState.isSubmitting}>
          {time > 0 ? `Too many request, wait ${time} second/s` : form.formState.isSubmitting ? <LoaderIcon /> : 'Continue'}
        </Button>
      </form>
    </Form>
  )
}

export function ResendVerificationTokenForm() {
  const [isSubmitting, setIsSubmitting] = useState(false)

  const [error, setError] = useState<string>()
  const { time, setTime } = useCountDown()

  const handleResend = async () => {
    setError(undefined)
    setIsSubmitting(true)

    const actionResult = await resendVerificationTokenAction()
    setIsSubmitting(false)

    if (actionResult?.type === 'error') return setError(actionResult.message)
    if (actionResult?.type === 'limit') return setTime(actionResult.remainingTime)
    setTime(30)
  }

  return (
    <>
      <FormError message={error} />

      <Button disabled={time > 0 || isSubmitting} onClick={handleResend} className="w-full">
        {time > 0 ? (
          `Resend in ${time} second/s`
        ) : isSubmitting ? (
          <LoaderIcon />
        ) : (
          <>
            Resend <Send />
          </>
        )}
      </Button>
    </>
  )
}
