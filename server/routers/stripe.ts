import {
  STRIPE_BELIEVER_PRICE_ID,
  STRIPE_PRO_MONTHLY_PRICE_ID,
  STRIPE_PRO_YEARLY_PRICE_ID,
  STRIPE_TEAM_MONTHLY_PRICE_ID,
  STRIPE_TEAM_YEARLY_PRICE_ID,
} from '@/lib/constants'
import { prisma } from '@/lib/prisma'
import { getServerSession, getSessionOptions } from '@/lib/session'
import { stripe } from '@/lib/stripe'
import { SessionData } from '@/lib/types'
import { BillingCycle, PlanType } from '@prisma/client'
import { getIronSession, IronSession } from 'iron-session'
import { cookies } from 'next/headers'
import queryString from 'query-string'
import Stripe from 'stripe'
import { z } from 'zod'
import { protectedProcedure, router } from '../trpc'

export const stripeRouter = router({
  createAccount: protectedProcedure.mutation(async ({ ctx, input }) => {
    const account = await stripe.accounts.create({})
    console.log('====account:', account, account.id)
    return account
  }),

  authInfo: protectedProcedure.query(async ({ ctx, input }) => {
    const site = await prisma.site.findUniqueOrThrow({
      where: { id: ctx.activeSiteId },
    })

    let stripeOAuthToken = site.stripeOAuthToken as Stripe.OAuthToken

    if (!stripeOAuthToken) {
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

      console.log('=======newToken:', newToken)

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
})
