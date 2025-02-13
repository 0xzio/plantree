import { cacheHelper } from '@/lib/cache-header'
import { IPFS_ADD_URL, PostStatus } from '@/lib/constants'
import { getEmailTpl } from '@/lib/getEmailTpl'
import { prisma } from '@/lib/prisma'
import { redisKeys } from '@/lib/redisKeys'
import { renderSlateToHtml } from '@/lib/slate-to-html'
import { SitePost } from '@/lib/types'
import { getUrl } from '@/lib/utils'
import {
  DeliveryStatus,
  GateType,
  NewsletterStatus,
  PostType,
  Prisma,
  SubscriberStatus,
} from '@prisma/client'
import { revalidatePath, revalidateTag } from 'next/cache'
import { Node as SlateNode } from 'slate'
import { z } from 'zod'
import { checkSitePermission } from '../lib/checkSitePermission'
import { syncPostToHub } from '../lib/syncPostToHub'
import { protectedProcedure, publicProcedure, router } from '../trpc'

export const postRouter = router({
  listSitePosts: protectedProcedure
    .input(
      z.object({
        siteId: z.string(),
      }),
    )
    .query(async ({ ctx, input }) => {
      const { siteId } = input

      const cachedMySites = await cacheHelper.getCachedSitePosts(siteId)
      if (cachedMySites) return cachedMySites

      let posts = await findSitePosts(siteId)

      const sitePosts = posts.map((post) => ({
        ...post,
        image: getUrl(post.image || ''),
      }))

      await cacheHelper.updateCachedSitePosts(siteId, posts)

      return sitePosts as SitePost[]
    }),

  publishedPosts: publicProcedure
    .input(
      z.object({
        siteId: z.string(),
      }),
    )
    .query(async ({ ctx, input }) => {
      const { siteId } = input
      let posts = await publishedSitePosts(siteId)

      return posts.map((post) => ({
        ...post,
        image: getUrl(post.image || ''),
      }))
    }),

  byId: protectedProcedure.input(z.string()).query(async ({ ctx, input }) => {
    const post = await prisma.post.findUniqueOrThrow({
      include: {
        postTags: { include: { tag: true } },
        authors: {
          include: {
            user: {
              select: {
                name: true,
                image: true,
                displayName: true,
                ensName: true,
              },
            },
          },
        },
      },
      where: { id: input },
    })

    // syncToGoogleDrive(ctx.token.uid, post as any)
    // console.log('post-------xxxxxxxxxx:', post?.postTags)
    return post
  }),

  bySlug: protectedProcedure.input(z.string()).query(async ({ ctx, input }) => {
    const post = await prisma.post.findFirstOrThrow({
      where: { slug: input, siteId: ctx.activeSiteId },
      include: {
        authors: {
          include: {
            user: {
              select: {
                name: true,
                image: true,
                displayName: true,
                ensName: true,
              },
            },
          },
        },
      },
    })
    return post
  }),

  create: protectedProcedure
    .input(
      z.object({
        siteId: z.string(),
        type: z.nativeEnum(PostType),
        title: z.string(),
        content: z.string(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const post = await prisma.post.create({
        data: {
          userId: ctx.token.uid,
          ...input,
          authors: {
            create: [
              {
                siteId: ctx.activeSiteId,
                userId: ctx.token.uid,
              },
            ],
          },
        },
      })

      await cacheHelper.updateCachedSitePosts(post.siteId, null)
      return post
    }),

  update: protectedProcedure
    .input(
      z.object({
        id: z.string(),
        title: z.string().optional(),
        content: z.string().optional(),
        description: z.string().optional(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const { id, content, ...data } = input

      const post = await prisma.post.update({
        where: { id },
        data: {
          ...data,
          content: content || '',
        },
      })

      await cacheHelper.updateCachedSitePosts(post.siteId, null)
      return post
    }),

  updateCover: protectedProcedure
    .input(
      z.object({
        id: z.string(),
        image: z.string(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const { id, image } = input

      const post = await prisma.post.update({
        where: { id },
        data: { image },
      })

      return post
    }),

  publish: protectedProcedure
    .input(
      z.object({
        siteId: z.string(),
        postId: z.string().optional(),
        pageId: z.string().optional(),
        creationId: z.number().optional(),
        type: z.nativeEnum(PostType),
        gateType: z.nativeEnum(GateType),
        collectible: z.boolean(),
        delivered: z.boolean(),
        image: z.string().optional(),
        content: z.string(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const userId = ctx.token.uid
      const { pageId, gateType, collectible, creationId } = input

      let post = await prisma.post.findFirst({
        where: { OR: [{ pageId }, { id: input.postId }] },
      })

      function getPostInfo() {
        if (input.postId) {
          return { title: post?.title, content: input.content }
        }

        const [title, ...nodes] = JSON.parse(input.content)

        return {
          title: SlateNode.string(title),
          content: JSON.stringify(nodes),
        }
      }

      const info = getPostInfo()
      let shouldCreateNewsletter = false

      if (!post) {
        post = await prisma.post.create({
          data: {
            siteId: input.siteId,
            userId,
            slug: input.pageId,
            title: info.title,
            type: input.type,
            pageId: input.pageId,
            postStatus: PostStatus.PUBLISHED,
            image: input.image,
            gateType: input.gateType,
            collectible: input.collectible,
            content: info.content,
            delivered: input.delivered,
          },
        })
        shouldCreateNewsletter = input.delivered
      } else {
        const wasDelivered = post.delivered
        post = await prisma.post.update({
          where: { id: post.id },
          data: {
            title: info.title,
            type: input.type,
            image: input.image,
            postStatus: PostStatus.PUBLISHED,
            gateType: input.gateType,
            collectible: input.collectible,
            content: info.content,
            delivered: wasDelivered ? wasDelivered : input.delivered,
          },
        })
        shouldCreateNewsletter = input.delivered && !wasDelivered
      }

      if (shouldCreateNewsletter) {
        await createNewsletterWithDelivery({
          siteId: input.siteId,
          postId: post.id,
          title: info.title || '',
          // content: renderSlateToHtml(JSON.parse(info.content)),
          content: getEmailTpl(
            info.title || '',
            renderSlateToHtml(JSON.parse(info.content)),
            post.image ? getUrl(post.image) : '',
          ),
          creatorId: ctx.token.uid,
        })
      }

      const newPost = await prisma.post.findUnique({
        include: {
          postTags: { include: { tag: true } },
          comments: true,
        },
        where: { id: post.id },
      })

      await prisma.post.update({
        where: { id: post.id },
        data: {
          postStatus: PostStatus.PUBLISHED,
          collectible,
          creationId,
          // cid: res.cid,
          cid: '',
          publishedAt: new Date(),
          gateType,
        },
      })

      const publishedCount = await prisma.post.count({
        where: { siteId: input.siteId, postStatus: PostStatus.PUBLISHED },
      })

      await prisma.site.update({
        where: { id: input.siteId },
        data: { postCount: publishedCount },
      })

      await cacheHelper.updateCachedSitePosts(post.siteId, null)

      revalidateTag(`${post.siteId}-posts`)
      revalidateTag(`${post.siteId}-post-${post.slug}`)
      revalidatePath(`/posts/${post.slug}`)

      return newPost
    }),

  updatePublishedPost: protectedProcedure
    .input(
      z.object({
        postId: z.string(),
        featured: z.boolean().optional(),
        isPopular: z.boolean().optional(),
        publishedAt: z.date().optional(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const { postId, ...data } = input

      const post = await prisma.post.update({
        where: { id: postId },
        data,
      })

      await cacheHelper.updateCachedSitePosts(post.siteId, null)

      revalidateTag(`${post.siteId}-posts`)
      revalidateTag(`posts-${post.slug}`)
      revalidatePath(`/posts/${post.slug}`)

      return post
    }),

  archive: protectedProcedure
    .input(z.string())
    .mutation(async ({ ctx, input }) => {
      const post = await prisma.post.update({
        where: { id: input },
        data: { postStatus: PostStatus.ARCHIVED },
      })

      await cacheHelper.updateCachedSitePosts(post.siteId, null)

      revalidateTag(`posts-${post.slug}`)
      revalidatePath(`/posts/${post.slug}`)

      return post
    }),

  delete: protectedProcedure
    .input(z.string())
    .mutation(async ({ ctx, input }) => {
      const post = await prisma.post.delete({
        where: { id: input },
      })

      await cacheHelper.updateCachedSitePosts(post.siteId, null)

      return post
    }),

  addAuthor: protectedProcedure
    .input(
      z.object({
        postId: z.string(),
        userId: z.string(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const author = await prisma.author.create({
        data: {
          siteId: ctx.activeSiteId,
          ...input,
        },
        include: {
          user: {
            select: {
              name: true,
              image: true,
              displayName: true,
              ensName: true,
            },
          },
        },
      })
      return author
    }),

  deleteAuthor: protectedProcedure
    .input(
      z.object({
        authorId: z.string(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      await prisma.author.delete({
        where: { id: input.authorId },
      })
      return true
    }),
})

function findSitePosts(siteId: string) {
  return prisma.post.findMany({
    where: { siteId },
    include: {
      postTags: { include: { tag: true } },
      user: {
        select: {
          displayName: true,
          image: true,
          accounts: {
            select: {
              providerAccountId: true,
              providerType: true,
            },
          },
        },
      },
    },
    orderBy: { publishedAt: 'desc' },
  })
}

function publishedSitePosts(siteId: string) {
  return prisma.post.findMany({
    where: { siteId, postStatus: PostStatus.PUBLISHED },
    include: {
      postTags: { include: { tag: true } },
      user: {
        select: {
          displayName: true,
          image: true,
          accounts: {
            select: {
              providerAccountId: true,
              providerType: true,
            },
          },
        },
      },
    },
    orderBy: { publishedAt: 'desc' },
  })
}

/**
 * Creates a newsletter and its associated delivery records for a post
 *
 * @param params - Parameters for creating the newsletter
 * @param params.siteId - The ID of the site
 * @param params.postId - The ID of the post to create newsletter for
 * @param params.title - The title of the newsletter
 * @param params.content - The content of the newsletter
 * @param params.creatorId - The ID of the user creating the newsletter
 *
 * @returns The created or existing newsletter
 *
 * @remarks
 * - If a newsletter already exists for the given post, returns the existing one
 * - Creates delivery records for all active subscribers of the site
 * - Uses a transaction to ensure data consistency
 */
async function createNewsletterWithDelivery(params: {
  siteId: string
  postId: string
  title: string
  content: string
  creatorId: string
}) {
  const { siteId, postId, title, content, creatorId } = params

  // Check if newsletter already exists for this post
  const existingNewsletter = await prisma.newsletter.findFirst({
    where: { postId },
  })

  if (existingNewsletter) {
    return existingNewsletter
  }

  return prisma.$transaction(async (tx) => {
    // Create Newsletter record
    const newsletter = await tx.newsletter.create({
      data: {
        siteId,
        postId,
        title,
        subject: 'POST',
        content,
        status: NewsletterStatus.SENDING,
        creatorId,
      },
    })

    // Get active subscribers
    const subscribers = await tx.subscriber.findMany({
      where: {
        siteId,
        status: SubscriberStatus.ACTIVE,
      },
    })

    if (subscribers.length > 0) {
      // Create Delivery records
      await tx.delivery.createMany({
        data: subscribers.map((subscriber) => ({
          siteId,
          newsletterId: newsletter.id,
          subscriberId: subscriber.id,
          status: DeliveryStatus.PENDING,
        })),
      })
    }

    return newsletter
  })
}
