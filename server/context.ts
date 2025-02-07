import { prisma } from '@/lib/prisma'
import { FetchCreateContextFnOptions } from '@trpc/server/adapters/fetch'
import type * as trpcNext from '@trpc/server/adapters/next'
import jwt from 'jsonwebtoken'
import { getToken } from 'next-auth/jwt'

interface CreateContextOptions {
  // session: Session | null
}

type Token = {
  name: string
  uid: string
  role: string
  address: string
  email: string
  sub: string
  iat: number
  exp: number
  jti: string
  accessToken: string
  subscriptionEndedAt: string | null
}

let secret = ''

async function getAuthSecret() {
  let nextAuthSecret = process.env.NEXTAUTH_SECRET
  if (nextAuthSecret) return nextAuthSecret
  if (secret) return secret

  const site = await prisma.site.findFirst({
    select: {
      authSecret: true,
    },
  })
  secret = site?.authSecret || ''
  return site?.authSecret || ''
}

/**
 * Inner function for `createContext` where we create the context.
 * This is useful for testing when we don't want to mock Next.js' request/response
 */
export async function createContextInner(_opts: CreateContextOptions) {
  return {}
}

export type Context = Awaited<ReturnType<typeof createContextInner>> & {
  token: Token
  activeSiteId: string
}

/**
 * Creates context for an incoming request
 * @link https://trpc.io/docs/v11/context
 */
export async function createContext(opts: FetchCreateContextFnOptions) {
  // for API-response caching see https://trpc.io/docs/v11/caching
  const { req } = opts

  const nextAuthSecret = await getAuthSecret()

  let token = (await getToken({
    req: req as any,
    secret: nextAuthSecret,
  })) as any

  let authorization = req.headers.get('authorization')

  if (!token?.uid && authorization) {
    try {
      const decoded = jwt.verify(authorization, nextAuthSecret) as any
      token = { ...decoded, uid: decoded.sub }
    } catch (error) {}
  }

  return {
    token,
    activeSiteId: req.headers.get('X-ACTIVE-SITE-ID'),
  }
}
