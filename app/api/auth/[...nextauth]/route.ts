import { authOptions } from '@/lib/auth'
import { SubscriptionInSession } from '@/lib/types'
import NextAuth, { type NextAuthOptions } from 'next-auth'

declare module 'next-auth' {
  interface Session {
    address: string
    name: string
    userId: string
    ensName: string | null
    role: string
    domain: {
      domain: string
      isSubdomain: boolean
    }
    subscriptions: SubscriptionInSession[]
  }
}

export { handler as GET, handler as POST }

async function handler(req: Request, res: Response) {
  const host = req.headers.get('host')

  process.env.NEXTAUTH_URL =
    process.env.NEXTAUTH_URL ||
    (/localhost/.test(host || '') ? `http://${host}` : `https://${host}`)

  return await NextAuth(req as any, res as any, authOptions)
}
