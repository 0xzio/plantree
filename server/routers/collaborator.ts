import { cacheHelper } from '@/lib/cache-header'
import {
  PRO_PLAN_COLLABORATOR_LIMIT,
  TEAM_PLAN_COLLABORATOR_LIMIT,
} from '@/lib/constants'
import { prisma } from '@/lib/prisma'
import { CollaboratorRole, PlanType, ProviderType } from '@prisma/client'
import { TRPCError } from '@trpc/server'
import { z } from 'zod'
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

      const count = await prisma.collaborator.count({
        where: { siteId: input.siteId },
      })

      if (
        ctx.token.planType === PlanType.PRO &&
        count >= PRO_PLAN_COLLABORATOR_LIMIT
      ) {
        throw new TRPCError({
          code: 'BAD_REQUEST',
          message: 'You have reached the pro plan collaborator limit.',
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

      await cacheHelper.updateCachedMySites(user.id, null)

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

      const collaborator = await prisma.collaborator.delete({
        where: { id: input.collaboratorId },
      })

      await cacheHelper.updateCachedMySites(collaborator.userId, null)
      return true
    }),
})