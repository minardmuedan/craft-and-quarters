import 'server-only'
import { schedule } from 'node-cron'

const cache = new Map<string, { count: number; expiredIn: number }>()

export function rateLimiter(key: string, maxCount: number, maxAge: number) {
  const existingRequest = cache.get(key)

  if (!existingRequest) {
    const expiredIn = Date.now() + maxAge * 1000
    const count = maxCount - 1 // for this request
    cache.set(key, { count, expiredIn })
  } else {
    if (existingRequest.count <= 1) {
      const remainingTime = Number(((existingRequest.expiredIn - Date.now()) / 1000).toFixed())
      throw new RateLimit(remainingTime)
    }

    const newCount = existingRequest.count - 1
    cache.set(key, { ...existingRequest, count: newCount })
  }
}

export class RateLimit {
  constructor(public remainingTime: number) {}
}

schedule('0 */12 * * *', () => {
  console.log('CRON JOB!', cache)
  const expiredRequest = Array.from(cache.entries()).filter(([, { expiredIn }]) => expiredIn - Date.now() < 0)
  expiredRequest.map(([key]) => cache.delete(key))
  console.log(cache)
})
