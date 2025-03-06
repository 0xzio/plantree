import { prisma } from '@/lib/prisma'
import { stripe } from '@/lib/stripe'
import { StripeType } from '@prisma/client'
import Stripe from 'stripe'

export async function getOAuthStripe(siteId: string) {
  const site = await prisma.site.findUniqueOrThrow({
    where: { id: siteId },
  })

  if (site.stripeType === StripeType.PLATFORM) {
    return stripe
  }

  let stripeOAuthToken = site.stripeOAuthToken as Stripe.OAuthToken

  try {
    const oauthStripe = new Stripe(stripeOAuthToken.access_token!, {
      apiVersion: '2025-02-24.acacia',
      typescript: true,
    })

    await oauthStripe.accounts.retrieve(stripeOAuthToken.stripe_user_id!)
    return oauthStripe
  } catch (error) {
    const newToken = await stripe.oauth.token({
      grant_type: 'refresh_token',
      refresh_token: stripeOAuthToken.refresh_token!,
    })

    await prisma.site.update({
      where: { id: siteId },
      data: {
        stripeOAuthToken: newToken,
      },
    })

    const oauthStripe = new Stripe(newToken.access_token!, {
      apiVersion: '2025-02-24.acacia',
      typescript: true,
    })
    return oauthStripe
  }
}
