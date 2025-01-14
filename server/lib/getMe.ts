import { prisma } from '@/lib/prisma'
import { Site, User } from '@prisma/client'
import { TRPCError } from '@trpc/server'
import jwt from 'jsonwebtoken'

type Me = User & {
  token?: string
  site: Site
}

export async function getMe(userId: string, needToken = false) {
  let user = await prisma.user.findUnique({
    where: { id: userId },
  })

  if (!user) new TRPCError({ code: 'NOT_FOUND' })

  const site = await prisma.site.findFirst({
    where: { userId: user?.id },
  })

  return {
    ...user,
    ...generateToken(userId, needToken),
    site,
  } as Me

  // await redis.set(redisKey, JSON.stringify(user))
}

function generateToken(userId: string, needToken = false) {
  if (!needToken) return {}

  return {
    token: jwt.sign({ sub: userId }, process.env.NEXTAUTH_SECRET!, {
      expiresIn: '365d',
    }),
  }
}
