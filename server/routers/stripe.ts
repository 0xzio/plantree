import { prisma } from '@/lib/prisma'
import { stripe } from '@/lib/stripe'
import { Balance } from '@/lib/types'
import { StripeType } from '@prisma/client'
import { TRPCError } from '@trpc/server'
import queryString from 'query-string'
import Stripe from 'stripe'
import { z } from 'zod'
import { getOAuthStripe } from '../lib/getOAuthStripe'
import { protectedProcedure, router } from '../trpc'

export const stripeRouter = router({
  authInfo: protectedProcedure.query(async ({ ctx, input }) => {
    const site = await prisma.site.findUniqueOrThrow({
      where: { id: ctx.activeSiteId },
    })

    let stripeOAuthToken = site.stripeOAuthToken as Stripe.OAuthToken

    if (!stripeOAuthToken?.access_token) {
      return {
        token: null,
        account: null,
      }
    }

    try {
      const oauthStripe = new Stripe(stripeOAuthToken.access_token!, {
        apiVersion: '2025-02-24.acacia',
        typescript: true,
      })

      const account = await oauthStripe.accounts.retrieve(
        stripeOAuthToken.stripe_user_id!,
      )

      return {
        token: stripeOAuthToken,
        account,
      }
    } catch (error) {
      const newToken = await stripe.oauth.token({
        grant_type: 'refresh_token',
        refresh_token: stripeOAuthToken.refresh_token!,
      })

      await prisma.site.update({
        where: { id: ctx.activeSiteId },
        data: {
          stripeOAuthToken: newToken,
        },
      })

      const oauthStripe = new Stripe(newToken.access_token!, {
        apiVersion: '2025-02-24.acacia',
        typescript: true,
      })

      const account = await oauthStripe.accounts.retrieve(
        stripeOAuthToken.stripe_user_id!,
      )

      return {
        token: newToken,
        account,
      }
    }
  }),

  checkout: protectedProcedure
    .input(
      z.object({
        tierId: z.string(),
        priceId: z.string(),
        siteId: z.string(),
        host: z.string(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const siteId = input.siteId
      const return_url = `${process.env.NEXT_PUBLIC_ROOT_HOST}/api/${siteId}/subscribe-site-callback`
      console.log('ctx=====:', ctx)

      console.log('=====>>>success_url:', return_url)
      const userId = ctx.token.uid

      const query = {
        siteId,
        userId,
        tierId: input.tierId,
        host: input.host,
      }

      console.log('=======query:', query)

      const stringifiedQuery = queryString.stringify(query)

      const oauthStripe = await getOAuthStripe(siteId)
      const session = await oauthStripe.checkout.sessions.create({
        mode: 'subscription',
        payment_method_types: ['card'],
        // customer_email: email,
        client_reference_id: siteId,
        subscription_data: {
          metadata: {
            siteId,
            priceId: input.priceId,
            tierId: input.tierId,
          },
        },
        success_url: `${return_url}?success=true&session_id={CHECKOUT_SESSION_ID}&${stringifiedQuery}`,
        cancel_url: `${return_url}?success=false`,
        line_items: [{ price: input.priceId, quantity: 1 }],
      })

      if (!session.url) return { success: false as const }

      return { success: true, url: session.url }
    }),

  cancelSubscription: protectedProcedure
    .input(
      z.object({
        siteId: z.string(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const { siteId } = input
      const site = await prisma.site.findUniqueOrThrow({
        where: { id: siteId },
      })

      let stripeOAuthToken = site.stripeOAuthToken as Stripe.OAuthToken

      const apiKey =
        site.stripeType === StripeType.PLATFORM
          ? process.env.STRIPE_API_KEY!
          : stripeOAuthToken.access_token!

      const oauthStripe = new Stripe(apiKey, {
        apiVersion: '2025-02-24.acacia',
        typescript: true,
      })

      const { sassSubscriptionId, id } =
        await prisma.subscription.findFirstOrThrow({
          where: {
            siteId: input.siteId,
            userId: ctx.token.uid,
          },
        })

      const subscription = await oauthStripe.subscriptions.cancel(
        sassSubscriptionId!,
      )

      const sassCurrentPeriodEnd = new Date(
        subscription.current_period_end * 1000,
      )

      await prisma.subscription.update({
        where: { id },
        data: {
          sassSubscriptionStatus: subscription.status,
          sassCurrentPeriodEnd: sassCurrentPeriodEnd,
        },
      })

      return true
    }),

  withdraw: protectedProcedure
    .input(
      z.object({
        amount: z.number(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const userId = ctx.token.uid
      const siteId = ctx.activeSiteId
      return prisma.$transaction(
        async (tx) => {
          const site = await tx.site.findUniqueOrThrow({
            where: { id: siteId },
          })

          if (site.userId !== userId) {
            throw new TRPCError({
              code: 'BAD_REQUEST',
              message: 'No permission to withdraw funds from this site',
            })
          }

          const amount = input.amount
          const balance = site.balance as Balance

          if (amount > balance.withdrawable) {
            throw new TRPCError({
              code: 'BAD_REQUEST',
              message: 'Insufficient funds to withdraw this amount',
            })
          }

          balance.withdrawable -= amount
          balance.withdrawing += amount

          const newSite = await tx.site.update({
            where: { id: siteId },
            data: { balance },
          })

          await tx.payout.create({
            data: {
              userId,
              siteId,
              amount,
            },
          })
          return newSite
        },
        {
          maxWait: 5000, // default: 2000
          timeout: 10000, // default: 5000
        },
      )
    }),
})
