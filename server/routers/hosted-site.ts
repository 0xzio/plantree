import { join } from 'path'
import { addDomainToVercel } from '@/lib/domains'
import { decryptString, encryptString } from '@/lib/encryption'
import { prisma } from '@/lib/prisma'
import { uniqueId } from '@/lib/unique-id'
import { TRPCError } from '@trpc/server'
import Cloudflare from 'cloudflare'
import ky from 'ky'
import { z } from 'zod'
import { pagesProject } from '../lib/page-project'
import { protectedProcedure, publicProcedure, router } from '../trpc'

export const hostedSiteRouter = router({
  myHostedSites: protectedProcedure.query(async ({ ctx }) => {
    const userId = ctx.token.uid
    const sites = await prisma.hostedSite.findMany({
      where: { userId },
    })

    return sites
  }),

  siteProjectInfo: protectedProcedure
    .input(
      z.object({
        siteId: z.string(),
      }),
    )
    .query(async ({ ctx, input }) => {
      const userId = ctx.token.uid
      const [site, user] = await Promise.all([
        prisma.hostedSite.findUnique({
          where: { id: input.siteId },
        }),
        prisma.user.findUnique({
          where: { id: userId },
        }),
      ])

      const cfApiToken = decryptString(
        user?.cfApiToken!,
        process.env.CF_TOKEN_ENCRYPT_KEY!,
      )

      try {
        const accountId = await getAccountId(cfApiToken)

        const client = new Cloudflare({
          apiEmail: '',
          apiToken: cfApiToken,
        })

        const project = await client.pages.projects.get(site?.name!, {
          account_id: accountId,
        })

        return project as typeof pagesProject
      } catch (error) {
        return false
      }
    }),

  deployNewSite: protectedProcedure
    .input(
      z.object({
        apiToken: z.string().optional(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      // console.log(
      //   '=e>>>>>>>>>>>>>>',
      //   encryptString(
      //     '8mLWbPMuemR5dGSXHSe7HO6A2qhOD0uxLkpnFNvb',
      //     process.env.CF_TOKEN_ENCRYPT_KEY!,
      //   ),
      // )
      // return

      let apiToken = input.apiToken || ''
      if (!apiToken) {
        const user = await prisma.user.findUnique({
          where: { id: ctx.token.uid },
        })

        apiToken = decryptString(
          user?.cfApiToken || '',
          process.env.CF_TOKEN_ENCRYPT_KEY!,
        )
      }
      const accountId = await getAccountId(apiToken)

      if (!accountId) {
        throw new TRPCError({
          code: 'BAD_REQUEST',
          message: 'Invalid API token',
        })
      }

      await prisma.user.update({
        where: { id: ctx.token.uid },
        data: {
          cfApiToken: encryptString(
            apiToken,
            process.env.CF_TOKEN_ENCRYPT_KEY!,
          ),
        },
      })

      const id = uniqueId()
      const site = await prisma.hostedSite.create({
        data: {
          id,
          name: `penx-${id}`,
          userId: ctx.token.uid,
        },
      })

      ky.post(`${process.env.DEPLOY_CI_HOST}/deploy-site`, {
        json: {
          siteId: site.id,
          apiToken: apiToken,
          accountId,
        },
      })

      return true
    }),

  update: protectedProcedure
    .input(
      z.object({
        siteId: z.string(),
        domain: z.string(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const { siteId, ...rest } = input
      await prisma.hostedSite.update({
        where: { id: siteId },
        data: {
          ...rest,
        },
      })
      return true
    }),
})

async function getAccountId(apiToken: string): Promise<string> {
  const response: any = await ky
    .get('https://api.cloudflare.com/client/v4/accounts', {
      headers: {
        Authorization: `Bearer ${apiToken}`,
        'Content-Type': 'application/json',
      },
    })
    .json()

  if (!response?.success) return ''

  const accounts = response.result

  if (accounts && accounts.length > 0) {
    const accountId = accounts[0].id
    return accountId || ''
  } else {
    return ''
  }
}
