import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { getVerificationTokenAndUserDb } from '@/lib/db/utils/verification-token'
import { deleteCookie, getCookie } from '@/lib/helpers'
import { Mailbox, RotateCcw } from 'lucide-react'
import SignUpForm, { ResendVerificationTokenForm } from './form'

export default async function SignUpPage() {
  const tokenId = await getCookie('verification')
  if (tokenId) {
    const result = await getVerificationTokenAndUserDb(tokenId)
    const isExpired = Date.now() > new Date(result[0]?.verificationToken.expiredAt).getTime()
    if (result[0]?.verificationToken && !isExpired) {
      return (
        <div className="flex w-full flex-col items-center space-y-6 px-2 text-center sm:max-w-sm">
          <Mailbox size={80} />
          <div className="space-y-1">
            <h1 className="text-4xl font-semibold">Verify Your Email</h1>
            <p className="text-muted-foreground text-sm">
              Please verify your email to complete the setup and secure your account.
            </p>
          </div>

          <p className="font-medium">{result[0].user.email}</p>
          <div className="w-full space-y-3">
            <ResendVerificationTokenForm />
            <form
              action={async () => {
                'use server'
                await deleteCookie('verification')
              }}
              className="w-full"
            >
              <Button type="submit" variant="outline" className="w-full">
                Change Email <RotateCcw />
              </Button>
            </form>
          </div>
        </div>
      )
    }
  }

  return (
    <Card>
      <CardHeader title="Create An Account" description="fill up the form" />
      <CardContent>
        <SignUpForm />
      </CardContent>
    </Card>
  )
}
