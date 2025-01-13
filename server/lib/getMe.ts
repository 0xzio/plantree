import { prisma } from '@/lib/prisma'
import { User } from '@prisma/client'
import { TRPCError } from '@trpc/server'
import jwt from 'jsonwebtoken'

type Me = User & {
  token?: string
}

export async function getMe(userId: string, needToken = false) {
  let user = await prisma.user.findUnique({
    where: { id: userId },
  })

  if (!user) new TRPCError({ code: 'NOT_FOUND' })

  return {
    ...user,
    ...generateToken(userId, needToken),
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
