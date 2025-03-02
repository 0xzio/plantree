import { PostsNav } from '@/app/[lang]/~/(dashboard)/posts/components/PostsNav'
import { cacheHelper } from '@/lib/cache-header'
import { IPFS_ADD_URL, PostStatus } from '@/lib/constants'
import { getSiteDomain } from '@/lib/getSiteDomain'
import { prisma } from '@/lib/prisma'
import { redisKeys } from '@/lib/redisKeys'
import { renderSlateToHtml } from '@/lib/slate-to-html'
import { SitePost } from '@/lib/types'
import { getUrl } from '@/lib/utils'
import { getPostEmailTpl } from '@/server/lib/getPostEmailTpl'
import {
  CollaboratorRole,
  DeliveryStatus,
  GateType,
  NewsletterStatus,
  Post,
  PostType,
  Prisma,
  SubscriberStatus,
} from '@prisma/client'
import { TRPCError } from '@trpc/server'
import { slug } from 'github-slugger'
import { revalidatePath, revalidateTag } from 'next/cache'
import { Node as SlateNode } from 'slate'
import { z } from 'zod'
import { checkSitePermission } from '../lib/checkSitePermission'
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
    const cachedPost = await cacheHelper.getCachedPost(input)
    if (cachedPost) return cachedPost
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

    await cacheHelper.updateCachedPost(post.id, post)
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
      // const count = await prisma.post

      const post = await prisma.post.create({
        data: {
          userId: ctx.token.uid,
          i18n: {},
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
        i18n: z.record(z.any()).optional(),
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

      await cacheHelper.updateCachedPost(post.id, null)
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

      await cacheHelper.updateCachedPost(post.id, null)

      return post
    }),

  publish: protectedProcedure
    .input(
      z.object({
        siteId: z.string(),
        postId: z.string().optional(),
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
      const { gateType, collectible, creationId } = input

      let post = await prisma.post.findFirst({
        where: { id: input.postId },
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
            title: info.title,
            type: input.type,
            status: PostStatus.PUBLISHED,
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
            slug: post.isPage ? slug(post.title) : post.id,
            title: info.title,
            type: input.type,
            image: input.image,
            status: PostStatus.PUBLISHED,
            gateType: input.gateType,
            collectible: input.collectible,
            content: info.content,
            delivered: wasDelivered ? wasDelivered : input.delivered,
          },
        })
        shouldCreateNewsletter = input.delivered && !wasDelivered
      }

      if (shouldCreateNewsletter) {
        const site = await prisma.site.findUniqueOrThrow({
          where: { id: input.siteId },
          include: { domains: true },
        })
        const domain = getSiteDomain(site) || site.domains[0]

        await createNewsletterWithDelivery({
          siteId: input.siteId,
          postId: post.id,
          title: info.title || '',
          // content: renderSlateToHtml(JSON.parse(info.content)),
          content: getPostEmailTpl(
            info.title || '',
            renderSlateToHtml(JSON.parse(info.content)),
            `https://${domain.domain}.penx.io/posts/${post.slug}`,
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
          status: PostStatus.PUBLISHED,
          slug: post.isPage ? slug(post.title) : post.id,
          collectible,
          creationId,
          // cid: res.cid,
          cid: '',
          publishedAt: new Date(),
          gateType,
        },
      })

      const publishedCount = await prisma.post.count({
        where: { siteId: input.siteId, status: PostStatus.PUBLISHED },
      })

      const site = await prisma.site.update({
        where: { id: input.siteId },
        data: { postCount: publishedCount },
      })

      await cacheHelper.updateCachedPost(post.id, null)
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

      await cacheHelper.updateCachedPost(post.id, null)
      await cacheHelper.updateCachedSitePosts(post.siteId, null)

      revalidateTag(`${post.siteId}-posts`)
      revalidateTag(`posts-${post.slug}`)
      revalidatePath(`/posts/${post.slug}`)

      return post
    }),

  importPosts: protectedProcedure
    .input(
      z.object({
        siteId: z.string(),
        postData: z.string(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const siteId = input.siteId
      const posts = JSON.parse(input.postData) as Post[]

      return prisma.$transaction(
        async (tx) => {
          const newPosts = await tx.post.createManyAndReturn({
            data: posts.map((p) => ({
              siteId,
              userId: ctx.token.uid,
              title: p.title,
              content: p.content,
              status: p.status,
              image: p.image,
              type: p.type,
            })),
          })

          const ids = newPosts.map((i) => i.id)

          await tx.author.createMany({
            data: ids.map((postId) => ({
              siteId,
              userId: ctx.token.uid,
              postId,
            })),
          })

          const postCount = await tx.post.count({
            where: {
              siteId,
              status: PostStatus.PUBLISHED,
            },
          })

          await tx.site.update({
            where: { id: siteId },
            data: { postCount },
          })

          await cacheHelper.updateCachedSitePosts(siteId, null)
          return true
        },
        {
          maxWait: 10000, // default: 2000
          timeout: 20000, // default: 5000
        },
      )
    }),

  archive: protectedProcedure
    .input(z.string())
    .mutation(async ({ ctx, input }) => {
      const post = await prisma.post.update({
        where: { id: input },
        data: { status: PostStatus.ARCHIVED },
      })

      await cacheHelper.updateCachedPost(post.id, null)
      await cacheHelper.updateCachedSitePosts(post.siteId, null)

      revalidateTag(`${post.siteId}-posts`)
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

      await cacheHelper.updateCachedPost(post.id, null)
      await cacheHelper.updateCachedSitePosts(post.siteId, null)

      return post
    }),

  deleteSitePosts: protectedProcedure
    .input(
      z.object({
        siteId: z.string(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const collaborator = await prisma.collaborator.findFirst({
        where: { userId: ctx.token.uid, siteId: input.siteId },
      })

      if (collaborator?.role !== CollaboratorRole.OWNER) {
        throw new TRPCError({
          code: 'UNAUTHORIZED',
          message: 'Only owner can delete all posts in a site',
        })
      }

      return prisma.$transaction(async (tx) => {
        const { siteId } = input
        await tx.comment.deleteMany({ where: { siteId } })
        await tx.postTag.deleteMany({ where: { siteId } })
        await tx.author.deleteMany({ where: { siteId } })
        await tx.post.deleteMany({
          where: { siteId },
        })

        await tx.site.update({
          where: { id: siteId },
          data: { postCount: 0 },
        })

        await cacheHelper.updateCachedSitePosts(input.siteId, null)
        return true
      })
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

      await cacheHelper.updateCachedPost(input.postId, null)
      return author
    }),

  deleteAuthor: protectedProcedure
    .input(
      z.object({
        postId: z.string(),
        authorId: z.string(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      await prisma.author.delete({
        where: { id: input.authorId },
      })

      await cacheHelper.updateCachedPost(input.postId, null)
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
    where: { siteId, status: PostStatus.PUBLISHED },
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
          unSubscribeUrl: `${process.env.NEXT_PUBLIC_URL}/api/newsletter/unsubscribe/${subscriber.unsubscribeCode}`,
        })),
      })
    }

    return newsletter
  })
}
