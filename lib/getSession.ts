import { User } from '@prisma/client'
import NextAuth, { getServerSession, type NextAuthOptions } from 'next-auth'
import { SubscriptionInSession } from './types'
import { auth } from './auth'

export async function getSession() {
  return auth() as Promise<{
    user: {
      id: string
      name: string
      username: string
      email: string
      image: string
    }
    userId: string
    address: string
    chainId: string
    ensName: string
    subscriptions: SubscriptionInSession[]
  } | null>
}
