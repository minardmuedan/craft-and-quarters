import { validateSession } from '@/lib/session'

export default async function Home() {
  const session = await validateSession()

  return <pre>{JSON.stringify(session, null, 2)}</pre>
}
