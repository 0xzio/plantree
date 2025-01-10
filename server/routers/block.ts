import { prisma } from '@/lib/prisma'
import { z } from 'zod'
import { protectedProcedure, publicProcedure, router } from '../trpc'

export const blockRouter = router({
  byId: protectedProcedure.input(z.string()).query(async ({ ctx, input }) => {
    return prisma.block.findUniqueOrThrow({ where: { id: input } })
  }),
})
