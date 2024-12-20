import 'server-only'

import { isRedirectError } from 'next/dist/client/components/redirect-error'
import { RateLimit } from './rate-limiter'

type ErrType = { type: 'error'; message: string } | { type: 'limit'; remainingTime: number }

export function createAction<T, I extends unknown[]>(fn: (...input: I) => Promise<T>) {
  return async (...input: I): Promise<ErrType | T> =>
    fn(...input).catch(err => {
      if (isRedirectError(err)) throw err
      if (err instanceof RateLimit) return { type: 'limit', remainingTime: err.remainingTime }
      if (err instanceof Error) return { type: 'error', message: err.message }
      if (typeof err === 'string') return { type: 'error', message: err }
      return { type: 'error', ...new Error('Something went wrong') }
    })
}
