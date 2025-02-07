import { NETWORK, NetworkNames } from '@/lib/constants'
import { prisma } from '@/lib/prisma'
import { CollaboratorRole, ProviderType } from '@prisma/client'
import { TRPCError } from '@trpc/server'
import { createPublicClient, http } from 'viem'
import { base, baseSepolia } from 'viem/chains'
import { z } from 'zod'
import { getEthPrice } from '../lib/getEthPrice'
import { protectedProcedure, publicProcedure, router } from '../trpc'

export const collaboratorRouter = router({
  listSiteCollaborators: publicProcedure
    .input(
      z.object({
        siteId: z.string(),
      }),
    )
    .query(async ({ ctx, input }) => {
      return prisma.collaborator.findMany({
        where: { siteId: input.siteId },
        include: { user: { include: { accounts: true } } },
      })
    }),

  addCollaborator: protectedProcedure
    .input(
      z.object({
        siteId: z.string(),
        q: z.string(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const { siteId } = input
      const admin = await prisma.collaborator.findFirstOrThrow({
        where: { userId: ctx.token.uid, siteId },
      })

      const ops: CollaboratorRole[] = [
        CollaboratorRole.OWNER,
        CollaboratorRole.ADMIN,
      ]

      if (!ops.includes(admin.role)) {
        throw new TRPCError({
          code: 'BAD_GATEWAY',
          message: 'No permission to add collaborator',
        })
      }

      const user = await prisma.user.findFirst({
        where: {
          accounts: {
            some: {
              OR: [
                { email: input.q },
                { providerAccountId: input.q.toLowerCase() },
              ],
            },
          },
        },
      })

      if (!user) {
        throw new TRPCError({
          code: 'BAD_GATEWAY',
          message: 'User not found, please check the address or email',
        })
      }

      const collaborator = await prisma.collaborator.findFirst({
        where: { userId: user.id, siteId },
      })

      if (collaborator) {
        throw new TRPCError({
          code: 'BAD_GATEWAY',
          message: 'User is a contributor already!',
        })
      }

      return prisma.collaborator.create({
        data: {
          siteId,
          role: CollaboratorRole.WRITE,
          userId: user.id,
        },
      })
    }),

  updateCollaborator: protectedProcedure
    .input(
      z.object({
        siteId: z.string(),
        collaboratorId: z.string(),
        role: z.nativeEnum(CollaboratorRole),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const { siteId } = input
      const admin = await prisma.collaborator.findFirstOrThrow({
        where: { userId: ctx.token.uid, siteId },
      })

      const ops: CollaboratorRole[] = [
        CollaboratorRole.OWNER,
        CollaboratorRole.ADMIN,
      ]

      if (!ops.includes(admin.role)) {
        throw new TRPCError({
          code: 'BAD_GATEWAY',
          message: 'No permission to add collaborator',
        })
      }

      return prisma.collaborator.update({
        where: { id: input.collaboratorId },
        data: { role: input.role },
      })
    }),

  deleteCollaborator: protectedProcedure
    .input(
      z.object({
        siteId: z.string(),
        collaboratorId: z.string(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const { siteId } = input
      const admin = await prisma.collaborator.findFirstOrThrow({
        where: { userId: ctx.token.uid, siteId },
      })

      const ops: CollaboratorRole[] = [
        CollaboratorRole.OWNER,
        CollaboratorRole.ADMIN,
      ]

      if (!ops.includes(admin.role)) {
        throw new TRPCError({
          code: 'BAD_GATEWAY',
          message: 'No permission to add collaborator',
        })
      }

      if (admin.id === input.collaboratorId) {
        throw new TRPCError({
          code: 'BAD_GATEWAY',
          message: 'Cannot delete yourself',
        })
      }

      return prisma.collaborator.delete({
        where: { id: input.collaboratorId },
      })
    }),
})
