/**
 * This file contains the root router of your tRPC-backend
 */
import { inferRouterInputs, inferRouterOutputs } from '@trpc/server'
import { accessTokenRouter } from './routers/access-token'
import { affiliateRouter } from './routers/affiliate'
import { assetRouter } from './routers/asset'
import { billingRouter } from './routers/billing'
import { campaignRouter } from './routers/campaign'
import { cliRouter } from './routers/cli'
import { collaboratorRouter } from './routers/collaborator'
import { commentRouter } from './routers/comment'
import { couponRouter } from './routers/coupon'
import { databaseRouter } from './routers/database'
import { deliveryRouter } from './routers/delivery'
import { extensionRouter } from './routers/extension'
import { githubRouter } from './routers/github'
import { googleRouter } from './routers/google'
import { hostedSiteRouter } from './routers/hosted-site'
import { messageRouter } from './routers/message'
import { newsletterRouter } from './routers/newsletter'
import { orderRouter } from './routers/order'
import { pageRouter } from './routers/page'
import { payoutRouter } from './routers/payout'
import { payoutAccountRouter } from './routers/payout-account'
import { planRouter } from './routers/plan'
import { pledgeRouter } from './routers/pledge'
import { postRouter } from './routers/post'
import { postImportRouter } from './routers/post-import'
import { productRouter } from './routers/product'
import { referralRouter } from './routers/referral'
import { rewardsRouter } from './routers/rewards'
import { seriesRouter } from './routers/series'
import { siteRouter } from './routers/site'
import { spaceRouter } from './routers/space'
import { stripeRouter } from './routers/stripe'
import { subscriberRouter } from './routers/subscriber'
import { tagRouter } from './routers/tag'
import { themeRouter } from './routers/theme'
import { tierRouter } from './routers/tier'
import { userRouter } from './routers/user'
import { createCallerFactory, publicProcedure, router } from './trpc'

export const appRouter = router({
  healthCheck: publicProcedure.query(() => 'yay!'),
  cli: cliRouter,
  site: siteRouter,
  hostedSite: hostedSiteRouter,
  user: userRouter,
  post: postRouter,
  tag: tagRouter,
  google: googleRouter,
  accessToken: accessTokenRouter,
  comment: commentRouter,
  message: messageRouter,
  space: spaceRouter,
  collaborator: collaboratorRouter,
  rewards: rewardsRouter,
  theme: themeRouter,
  asset: assetRouter,
  database: databaseRouter,
  page: pageRouter,
  coupon: couponRouter,
  extension: extensionRouter,
  plan: planRouter,
  subscriber: subscriberRouter,
  delivery: deliveryRouter,
  newsletter: newsletterRouter,
  billing: billingRouter,
  github: githubRouter,
  stripe: stripeRouter,
  tier: tierRouter,
  postImport: postImportRouter,
  product: productRouter,
  order: orderRouter,
  campaign: campaignRouter,
  pledge: pledgeRouter,
  series: seriesRouter,
  referral: referralRouter,
  affiliate: affiliateRouter,
  payoutAccount: payoutAccountRouter,
  payout: payoutRouter,
})

export const createCaller = createCallerFactory(appRouter)

export type AppRouter = typeof appRouter

/**
 * Inference helpers for input types
 * @example type HelloInput = RouterInputs['example']['hello']
 **/
export type RouterInputs = inferRouterInputs<AppRouter>

/**
 * Inference helpers for output types
 * @example type HelloOutput = RouterOutputs['example']['hello']
 **/
export type RouterOutputs = inferRouterOutputs<AppRouter>
