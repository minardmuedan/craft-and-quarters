import { Card, CardContent, CardHeader } from '@/components/ui/card'
import LoginForm from './form'

export default function LoginPage() {
  return (
    <Card>
      <CardHeader title="Welcome Back" description="fill up the form" />
      <CardContent>
        <LoginForm />
      </CardContent>
    </Card>
  )
}
