'use client'

import { use, useEffect, useState } from 'react'
import { verifyUserEmailAction } from './action'
import { toast } from 'sonner'
import { useRouter } from 'next/navigation'
import LoaderIcon from '@/components/ui/loader-icon'

export default function SignUpVerificationTokenPage({ params }: { params: Promise<{ token: string }> }) {
  const { token } = use(params)
  const router = useRouter()
  const [verifying, setVerifying] = useState(true)

  useEffect(() => {
    const verifyEmail = async () => {
      setVerifying(true)
      const actionResult = await verifyUserEmailAction(token)
      setVerifying(false)
      if (actionResult?.type === 'error') {
        toast.error(actionResult.message)
        return router.replace('/signup')
      }

      toast.success('Account Created Successfully')
      router.replace('/')
    }
    verifyEmail()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <div className="flex items-center justify-center gap-2">
      {verifying ? (
        <>
          <p>verifying</p>
          <LoaderIcon />
        </>
      ) : (
        <p>redirecting...</p>
      )}
    </div>
  )
}
