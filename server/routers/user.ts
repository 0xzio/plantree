import { NETWORK, NetworkNames } from '@/lib/constants'
import { prisma } from '@/lib/prisma'
import { ProviderType } from '@prisma/client'
import { TRPCError } from '@trpc/server'
import { createPublicClient, http } from 'viem'
import { base, baseSepolia } from 'viem/chains'
import { z } from 'zod'
import { getEthPrice } from '../lib/getEthPrice'
import { getMe } from '../lib/getMe'
import { protectedProcedure, publicProcedure, router } from '../trpc'

export const userRouter = router({
  list: publicProcedure.query(async ({ ctx, input }) => {
    return prisma.user.findMany({ take: 20 })
  }),

  me: protectedProcedure.query(async ({ ctx }) => {
    return prisma.user.findUnique({ where: { id: ctx.token.uid } })
  }),

  getAddressByUserId: publicProcedure
    .input(z.string())
    .query(async ({ input }) => {
      const { accounts = [] } = await prisma.user.findUniqueOrThrow({
        where: { id: input },
        include: {
          accounts: {
            select: {
              providerAccountId: true,
              providerType: true,
            },
          },
        },
      })
      const account = accounts.find(
        (a) => a.providerType === ProviderType.WALLET,
      )
      return account?.providerAccountId || ''
    }),

  updateProfile: protectedProcedure
    .input(
      z.object({
        image: z.string(),
        name: z.string(),
        bio: z.string().optional(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      return prisma.user.update({
        where: { id: ctx.token.uid },
        data: {
          ...input,
        },
      })
    }),

  ethPrice: publicProcedure.query(({ ctx }) => {
    return getEthPrice()
  }),

  getUserInfoByUserId: publicProcedure
    .input(
      z.object({
        userId: z.string(),
      }),
    )
    .query(async ({ ctx, input }) => {
      const user = await prisma.user.findUnique({
        where: { id: input.userId },
        select: {
          id: true,
          displayName: true,
          image: true,
        },
      })
      return user
    }),

  accountsByUser: publicProcedure.query(({ ctx }) => {
    return prisma.account.findMany({
      where: { userId: ctx.token.uid },
    })
  }),

  loginByPersonalToken: publicProcedure
    .input(z.string())
    .mutation(async ({ ctx, input }) => {
      const token = await prisma.accessToken.findUnique({
        where: { token: input },
      })
      if (!token) {
        throw new TRPCError({
          code: 'BAD_REQUEST',
          message: 'Invalid personal token',
        })
      }

      return getMe(ctx.token.uid, true)
    }),

  linkWallet: publicProcedure
    .input(
      z.object({
        signature: z.string(),
        message: z.string(),
        address: z.string(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const publicClient = createPublicClient({
        chain: NETWORK === NetworkNames.BASE_SEPOLIA ? baseSepolia : base,
        transport: http(),
      })

      const valid = await publicClient.verifyMessage({
        address: input.address as any,
        message: input.message,
        signature: input.signature as any,
      })

      if (!valid) {
        throw new TRPCError({
          code: 'BAD_REQUEST',
          message: 'Invalid signature',
        })
      }

      const account = await prisma.account.findFirst({
        where: { providerAccountId: input.address },
      })

      if (account) {
        throw new TRPCError({
          code: 'BAD_REQUEST',
          message: 'This address already linked',
        })
      }

      await prisma.account.create({
        data: {
          userId: ctx.token.uid,
          providerType: ProviderType.WALLET,
          providerAccountId: input.address,
        },
      })
    }),

  disconnectAccount: publicProcedure
    .input(
      z.object({
        accountId: z.string(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const accounts = await prisma.account.findMany({
        where: { userId: ctx.token.uid },
      })

      if (accounts.length === 1) {
        throw new TRPCError({
          code: 'BAD_REQUEST',
          message: 'Cannot disconnect the last account',
        })
      }

      const account = accounts.find((a) => a.id === input.accountId)

      if (account && account.providerType === ProviderType.GOOGLE) {
        await prisma.user.update({
          where: { id: ctx.token.uid },
          data: {
            email: null,
          },
        })
      }

      await prisma.account.delete({
        where: { id: input.accountId },
      })
      return true
    }),
})
