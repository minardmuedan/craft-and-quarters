'use client'

import { Button } from '@/components/ui/button'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import FormError from '@/components/ui/form-error'
import { Input } from '@/components/ui/input'
import LoaderIcon from '@/components/ui/loader-icon'
import { useCountDown } from '@/hooks/coutndown'
import { useIsHydrated } from '@/hooks/isHydrated'
import { loginSchema, LoginSchema } from '@/lib/schema'
import { zodResolver } from '@hookform/resolvers/zod'
import { LogIn } from 'lucide-react'
import { useForm } from 'react-hook-form'
import { loginAction } from './action'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'

export default function LoginForm() {
  const router = useRouter()
  const isHydrated = useIsHydrated()
  const { time, setTime } = useCountDown()

  const form = useForm<LoginSchema>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: '', password: '' },
  })

  const fields = [
    { label: 'Email Address', name: 'email', type: 'email' },
    { label: 'Password', name: 'password' },
  ] as const

  const onSubmit = async (values: LoginSchema) => {
    const actionResult = await loginAction(values)
    if (actionResult?.type === 'error') return form.setError('root', { message: actionResult.message })
    if (actionResult?.type === 'limit') return setTime(actionResult.remainingTime)

    toast.success('Welcome back')
    router.replace('/')
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
          {time > 0 ? (
            `Too many request, wait ${time} second/s`
          ) : form.formState.isSubmitting ? (
            <LoaderIcon />
          ) : (
            <>
              Login <LogIn />
            </>
          )}
        </Button>
      </form>
    </Form>
  )
}
