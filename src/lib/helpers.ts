import { generateRandomString, RandomReader } from '@oslojs/crypto/random'
import { ResponseCookie } from 'next/dist/compiled/@edge-runtime/cookies'
import { cookies, headers } from 'next/headers'

const alphabet = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890'

export function generateId(length = 20) {
  const random: RandomReader = {
    read(bytes) {
      crypto.getRandomValues(bytes)
    },
  }
  return generateRandomString(random, alphabet, length)
}

export async function getIp() {
  const headerStore = await headers()
  const ip = headerStore.get('x-forwarded-for')?.split(',')[0].trim() || headerStore.get('x-real-ip')
  if (!ip) throw 'Unknown IP Address'
  return ip
}

export const getCookie = async (key: string) => (await cookies()).get(key)?.value

export const setCookie = async (key: string, value: string, options: Partial<ResponseCookie> | undefined) =>
  (await cookies()).set(key, value, options)

export const deleteCookie = async (key: string) => (await cookies()).delete(key)
