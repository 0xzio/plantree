import { prisma } from '@/lib/prisma'
import { z } from 'zod'
import { protectedProcedure, router } from '../trpc'
import { SubscriberStatus } from '@prisma/client'

export const subscriberRouter = router({
  list: protectedProcedure
    .input(
      z.object({
        siteId: z.string(),
        status: z.nativeEnum(SubscriberStatus).optional(),
        cursor: z.string().optional(),
        limit: z.number().min(1).max(100).default(50),
      }),
    )
    .query(async ({ ctx, input }) => {
      const { siteId, status, cursor, limit } = input
      
      return prisma.subscriber.findMany({
        where: { 
          siteId,
          ...(status && { status })
        },
        take: limit,
        ...(cursor && { skip: 1, cursor: { id: cursor } }),
        orderBy: { createdAt: 'desc' },
      })
    }),

  count: protectedProcedure
    .input(
      z.object({
        siteId: z.string(),
        status: z.nativeEnum(SubscriberStatus).optional(),
      }),
    )
    .query(async ({ ctx, input }) => {
      return prisma.subscriber.count({
        where: {
          siteId: input.siteId,
          ...(input.status && { status: input.status })
        },
      })
    }),

  create: protectedProcedure
    .input(
      z.object({
        siteId: z.string(),
        email: z.string().email(),
        source: z.string().optional(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      return prisma.subscriber.create({
        data: {
          ...input,
          userId: ctx.token.uid,
          status: 'ACTIVE',
        },
      })
    }),

  updateStatus: protectedProcedure
    .input(
      z.object({
        id: z.string(),
        status: z.nativeEnum(SubscriberStatus),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      return prisma.subscriber.update({
        where: { id: input.id },
        data: { status: input.status },
      })
    }),

  delete: protectedProcedure
    .input(
      z.object({
        id: z.string(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      return prisma.subscriber.delete({
        where: { id: input.id },
      })
    }),

  addSubscriber: protectedProcedure
    .input(
      z.object({
        siteId: z.string(),
        email: z.string().email(),
        source: z.string().default('admin_add'),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      return prisma.subscriber.create({
        data: {
          ...input,
          userId: ctx.token.uid,
          status: 'ACTIVE',
        },
      })
    }),

  importSubscribers: protectedProcedure
    .input(
      z.object({
        siteId: z.string(),
        subscribers: z.array(z.object({
          email: z.string().email(),
        })),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      return prisma.subscriber.createMany({
        data: input.subscribers.map(sub => ({
          email: sub.email,
          siteId: input.siteId,
          userId: ctx.token.uid,
          status: 'ACTIVE',
          source: 'bulk_import',
        })),
      })
    }),
})
