/**
 * This file contains the root router of your tRPC-backend
 */
import { inferRouterInputs, inferRouterOutputs } from '@trpc/server'
import { accessTokenRouter } from './routers/access-token'
import { assetRouter } from './routers/asset'
import { blockRouter } from './routers/block'
import { cliRouter } from './routers/cli'
import { collaboratorRouter } from './routers/collaborator'
import { commentRouter } from './routers/comment'
import { couponRouter } from './routers/coupon'
import { databaseRouter } from './routers/database'
import { extensionRouter } from './routers/extension'
import { googleRouter } from './routers/google'
import { hostedSiteRouter } from './routers/hosted-site'
import { messageRouter } from './routers/message'
import { nodeRouter } from './routers/node'
import { pageRouter } from './routers/page'
import { postRouter } from './routers/post'
import { rewardsRouter } from './routers/rewards'
import { siteRouter } from './routers/site'
import { spaceRouter } from './routers/space'
import { tagRouter } from './routers/tag'
import { themeRouter } from './routers/theme'
import { userRouter } from './routers/user'
import { createCallerFactory, publicProcedure, router } from './trpc'

export const appRouter = router({
  healthCheck: publicProcedure.query(() => 'yay!'),
  cli: cliRouter,
  site: siteRouter,
  hostedSite: hostedSiteRouter,
  user: userRouter,
  post: postRouter,
  node: nodeRouter,
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
  block: blockRouter,
  coupon: couponRouter,
  extension: extensionRouter,
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
