import { cacheHelper } from '@/lib/cache-header'
import {
  BUILTIN_PAGE_SLUGS,
  FREE_PLAN_POST_LIMIT,
  IPFS_ADD_URL,
} from '@/lib/constants'
import { getSiteDomain } from '@/lib/getSiteDomain'
import { CatalogueNodeJSON, CatalogueNodeType } from '@/lib/model'
import { prisma } from '@/lib/prisma'
import { redisKeys } from '@/lib/redisKeys'
import { renderSlateToHtml } from '@/lib/slate-to-html'
import { SitePost } from '@/lib/types'
import { uniqueId } from '@/lib/unique-id'
import { getUrl } from '@/lib/utils'
import { getPostEmailTpl } from '@/server/lib/getPostEmailTpl'
import {
  CollaboratorRole,
  DeliveryStatus,
  GateType,
  NewsletterStatus,
  Post,
  PostStatus,
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

  listAllPosts: protectedProcedure.query(async ({ ctx, input }) => {
    return await prisma.post.findMany({
      where: {
        title: {
          notIn: ['Welcome to Plantree!', ''],
        },
        siteId: {
          notIn: ['cc79cefe-0cf8-4cd7-9970-66740024b618'],
        },
        isPage: false,
        status: PostStatus.PUBLISHED,
      },
      include: {
        site: {
          include: { domains: true },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
      take: 1000,
    })
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
        description: z.string().optional(),
        content: z.string(),
        status: z.nativeEnum(PostStatus).optional(),
        userId: z.string().optional(),
        seriesId: z.string().optional(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      return prisma.$transaction(
        async (tx) => {
          const count = await tx.post.count({
            where: { siteId: input.siteId, isPage: false },
          })

          if (count >= FREE_PLAN_POST_LIMIT && ctx.isFree) {
            throw new TRPCError({
              code: 'BAD_REQUEST',
              message: 'You have reached the free plan post limit.',
            })
          }

          const post = await tx.post.create({
            data: {
              userId: input.userId || ctx.token.uid,
              i18n: {},
              ...input,
              authors: {
                create: [
                  {
                    siteId: ctx.activeSiteId,
                    userId: input.userId || ctx.token.uid,
                  },
                ],
              },
            },
          })

          if (input.seriesId) {
            const series = await tx.series.findUniqueOrThrow({
              where: { id: input.seriesId },
            })

            const catalogue = (series.catalogue ||
              []) as any as CatalogueNodeJSON[]

            catalogue.push({
              id: uniqueId(),
              type: CatalogueNodeType.POST,
              uri: post.id,
            })

            await tx.series.update({
              where: {
                id: input.seriesId,
              },
              data: { catalogue },
            })
          }

          if (!input.seriesId) {
            await cacheHelper.updateCachedSitePosts(post.siteId, null)
          }
          return post
        },
        {
          maxWait: 10000, // default: 2000
          timeout: 20000, // default: 5000
        },
      )
    }),

  update: protectedProcedure
    .input(
      z.object({
        id: z.string(),
        title: z.string().optional(),
        content: z.string().optional(),
        podcast: z.any(),
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
      await cacheHelper.updateCachedSitePages(post.siteId, null)
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
        postId: z.string(),
        slug: z.string(),
        creationId: z.number().optional(),
        type: z.string(),
        gateType: z.nativeEnum(GateType),
        collectible: z.boolean(),
        delivered: z.boolean(),
        publishedAt: z.date().optional(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const userId = ctx.token.uid
      const { gateType, collectible, creationId } = input

      if (input.delivered && ctx.isFree) {
        throw new TRPCError({
          code: 'FORBIDDEN',
          message: 'Newsletters features is not supported on Free plan',
        })
      }

      let post = await prisma.post.findUniqueOrThrow({
        where: { id: input.postId },
      })

      if (BUILTIN_PAGE_SLUGS.includes(post.slug) && post.slug !== input.slug) {
        throw new TRPCError({
          code: 'BAD_GATEWAY',
          message: 'You can not update builtin page slug.',
        })
      }

      let shouldCreateNewsletter = false

      const wasDelivered = post.delivered

      shouldCreateNewsletter = input.delivered && !wasDelivered

      if (shouldCreateNewsletter) {
        const site = await prisma.site.findUniqueOrThrow({
          where: { id: input.siteId },
          include: { domains: true },
        })
        const domain = getSiteDomain(site) || site.domains[0]

        await createNewsletterWithDelivery({
          siteId: input.siteId,
          postId: post.id,
          title: post.title || '',
          // content: renderSlateToHtml(JSON.parse(info.content)),
          content: getPostEmailTpl(
            post.title || '',
            renderSlateToHtml(JSON.parse(post.content)),
            `https://${domain.domain}.plantree.xyz/posts/${post.slug}`,
            post.image ? getUrl(post.image) : '',
          ),
          creatorId: ctx.token.uid,
        })
      }

      post = await prisma.post.update({
        where: { id: post.id },
        data: {
          slug: input.slug,
          type: input.type,
          status: PostStatus.PUBLISHED,
          gateType: input.gateType,
          creationId,
          // cid: res.cid,
          collectible: input.collectible,
          delivered: wasDelivered ? wasDelivered : input.delivered,
          publishedAt: input.publishedAt || post.publishedAt || new Date(),
        },
      })

      const newPost = await prisma.post.findUnique({
        include: {
          postTags: { include: { tag: true } },
          comments: true,
        },
        where: { id: post.id },
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
      await cacheHelper.updateCachedSitePages(post.siteId, null)

      if (post.seriesId) {
        const { slug: seriesSlug } = await prisma.series.findUniqueOrThrow({
          where: { id: post.seriesId },
          select: { slug: true },
        })
        revalidateTag(`${post.siteId}-series-${seriesSlug}`)
      }

      revalidateTag(`${post.siteId}-posts`)
      revalidateTag(`${post.siteId}-post-${post.slug}`)
      revalidateTag(`${post.siteId}-page-${post.slug}`)
      revalidatePath(`/pages/${post.slug}`)
      revalidatePath(`/posts/${post.slug}`)

      return newPost
    }),

  unpublish: protectedProcedure
    .input(
      z.object({
        postId: z.string(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const post = await prisma.post.update({
        where: { id: input.postId },
        data: {
          status: PostStatus.DRAFT,
          publishedAt: null,
        },
      })

      await cacheHelper.updateCachedPost(post.id, null)
      await cacheHelper.updateCachedSitePosts(post.siteId, null)
      await cacheHelper.updateCachedSitePages(post.siteId, null)

      revalidateTag(`${post.siteId}-posts`)
      revalidateTag(`${post.siteId}-post-${post.slug}`)
      revalidateTag(`${post.siteId}-page-${post.slug}`)
      revalidatePath(`/pages/${post.slug}`)
      revalidatePath(`/posts/${post.slug}`)
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
      await cacheHelper.updateCachedSitePages(post.siteId, null)

      revalidateTag(`${post.siteId}-posts`)
      revalidateTag(`${post.siteId}-posts-${post.slug}`)
      revalidateTag(`${post.siteId}-pages-${post.slug}`)
      revalidatePath(`/posts/${post.slug}`)
      revalidatePath(`/pages/${post.slug}`)

      return post
    }),

  importPosts: protectedProcedure
    .input(
      z.object({
        siteId: z.string(),
        posts: z.array(z.any()),
        postStatus: z.nativeEnum(PostStatus).optional(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const siteId = input.siteId

      return prisma.$transaction(
        async (tx) => {
          const newPosts = await tx.post.createManyAndReturn({
            data: input.posts.map((p: Post) => ({
              siteId,
              userId: ctx.token.uid,
              title: p.title,
              content: p.content,
              status: Reflect.has(input, 'postStatus')
                ? input.postStatus
                : p.status,
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
          await cacheHelper.updateCachedSitePages(siteId, null)

          revalidateTag(`${siteId}-posts`)
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
    .mutation(async ({ ctx, input: id }) => {
      return prisma.$transaction(async (tx) => {
        const post = await tx.post.findUniqueOrThrow({
          where: { id },
        })

        if (BUILTIN_PAGE_SLUGS.includes(post.slug)) {
          throw new TRPCError({
            code: 'BAD_GATEWAY',
            message: 'You can not delete builtin page.',
          })
        }

        await tx.author.deleteMany({ where: { postId: id } })
        await tx.postTag.deleteMany({ where: { postId: id } })
        await tx.newsletter.deleteMany({ where: { postId: id } })
        await tx.comment.deleteMany({ where: { postId: id } })
        await tx.post.delete({
          where: { id: id },
        })
        await cacheHelper.updateCachedPost(post.id, null)
        await cacheHelper.updateCachedSitePosts(post.siteId, null)
        await cacheHelper.updateCachedSitePages(post.siteId, null)
        return post
      })
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
    where: {
      siteId,
      isPage: false,
      // seriesId: null,
      // publishedAt: {
      //   not: null,
      // },
    },
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
