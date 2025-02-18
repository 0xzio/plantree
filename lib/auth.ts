import { spaceAbi } from '@/lib/abi'
import { NETWORK, NetworkNames, PROJECT_ID, ROOT_DOMAIN } from '@/lib/constants'
import { getBasePublicClient } from '@/lib/getBasePublicClient'
import { getSiteDomain, UserWithDomains } from '@/lib/getSiteDomain'
import { prisma } from '@/lib/prisma'
import { AccountWithUser, SubscriptionInSession } from '@/lib/types'
import { createAppClient, viemConnector } from '@farcaster/auth-client'
import { ProviderType, Subscription } from '@prisma/client'
import { PrivyClient } from '@privy-io/server-auth'
import { compareSync } from 'bcrypt-edge'
import jwt from 'jsonwebtoken'
import NextAuth, { type NextAuthOptions } from 'next-auth'
import CredentialsProvider from 'next-auth/providers/credentials'
import { Address } from 'viem'
import {
  parseSiweMessage,
  validateSiweMessage,
  type SiweMessage,
} from 'viem/siwe'
import {
  initUserByAddress,
  initUserByEmail,
  initUserByFarcasterFrame,
  initUserByFarcasterInfo,
  initUserByGoogleInfo,
} from './initUser'
import { getAccountAddress, validateEmail } from './utils'

export type UserData = {
  user: FarcasterUser
}

export type FarcasterUser = {
  custody_address: string
  display_name: string
  fid: number
  follower_count: number
  following_count: number
  object: 'user'
  pfp_url: string
  power_badge: boolean
  profile: {
    bio: {
      text: string
    }
  }
  username: string
  verifications: string[]
  verified_accounts: any
  verified_addresses: {
    eth_addresses: string[]
    sol_addresses: string[]
  }
}

declare module 'next-auth' {
  interface Session {
    address: string
    name: string
    picture: string
    userId: string
    ensName: string | null
    role: string
    siteId: string
    activeSiteId: string
    accessToken: string
    subscriptionEndedAt: Date | null
    domain: {
      domain: string
      isSubdomain: boolean
    }
    subscriptions: SubscriptionInSession[]
  }
}

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: 'Ethereum',
      credentials: {
        message: {
          label: 'Message',
          placeholder: '0x0',
          type: 'text',
        },
        signature: {
          label: 'Signature',
          placeholder: '0x0',
          type: 'text',
        },
      },
      async authorize(credentials: any) {
        try {
          const siweMessage = parseSiweMessage(
            credentials?.message,
          ) as SiweMessage

          if (
            !validateSiweMessage({
              address: siweMessage?.address,
              message: siweMessage,
            })
          ) {
            return null
          }

          const publicClient = getBasePublicClient(NETWORK)

          const valid = await publicClient.verifyMessage({
            address: siweMessage?.address,
            message: credentials?.message,
            signature: credentials?.signature,
          })

          if (!valid) {
            return null
          }
          const address = siweMessage.address

          const account = await initUserByAddress(address.toLowerCase())

          // updateSubscriptions(account.userId, address as Address)
          return { ...account } as any
        } catch (e) {
          console.log('wallet auth error======:', e)
          return null
        }
      },
    }),
    CredentialsProvider({
      id: 'privy',
      name: 'Privy',
      credentials: {
        token: {
          label: 'Token',
          type: 'text',
          placeholder: '',
        },
        address: {
          label: 'Address',
          type: 'text',
          placeholder: '',
        },
      },
      async authorize(credentials) {
        try {
          if (!credentials?.token || !credentials?.address) {
            throw new Error('Token is undefined')
          }

          const { token, address } = credentials
          // console.log('====== token, address:', token, address)
          const site = await prisma.site.findFirst()
          if (!site) return null

          const authConfig = site.authConfig as any
          const privy = new PrivyClient(
            authConfig.privyAppId,
            authConfig.privyAppSecret,
          )

          try {
            const t0 = Date.now()
            await privy.verifyAuthToken(token)
            const t1 = Date.now()
            console.log('t1-t0=======>', t1 - t0)
            const account = await initUserByAddress(address.toLowerCase())
            const t2 = Date.now()
            console.log('t2-t1=======>', t2 - t1)
            // console.log('=====user:', user)
            // updateSubscriptions(account.userId, address as Address)
            return account
          } catch (error) {
            console.log('====authorize=error:', error)
            return null
          }
        } catch (e) {
          return null
        }
      },
    }),

    CredentialsProvider({
      id: 'penx-google',
      name: 'PenX',
      credentials: {
        email: {
          label: 'Email',
          type: 'text',
          placeholder: '',
        },
        openid: {
          label: 'OpenID',
          type: 'text',
          placeholder: '',
        },
        picture: {
          label: 'Picture',
          type: 'text',
          placeholder: '',
        },
        name: {
          label: 'Picture',
          type: 'text',
          placeholder: '',
        },
      },
      async authorize(credentials) {
        // console.log('=======google:', credentials)

        try {
          if (!credentials?.email || !credentials?.openid) {
            throw new Error('Login fail')
          }

          const account = await initUserByGoogleInfo(credentials)
          return account
        } catch (e) {
          console.log('=======>>>>e1:', e)
          return null
        }
      },
    }),

    CredentialsProvider({
      id: 'register-by-email',
      name: 'PenX',
      credentials: {
        validateToken: {
          label: 'Validate token',
          type: 'text',
          placeholder: '',
        },
      },
      async authorize(credentials) {
        // console.log('=======google:', credentials)

        try {
          if (!credentials?.validateToken) {
            throw new Error('Login fail')
          }

          const decoded = jwt.verify(
            credentials.validateToken,
            process.env.NEXTAUTH_SECRET!,
          ) as any

          const email = decoded.email
          const password = decoded.password
          const account = await initUserByEmail(email, password)
          return account
        } catch (e) {
          console.log('=======>>>>e1:', e)
          return null
        }
      },
    }),
    CredentialsProvider({
      id: 'penx-farcaster',
      name: 'Sign in with Farcaster',
      credentials: {
        message: {
          label: 'Message',
          type: 'text',
          placeholder: '0x0',
        },
        signature: {
          label: 'Signature',
          type: 'text',
          placeholder: '0x0',
        },
        // In a production app with a server, these should be fetched from
        // your Farcaster data indexer rather than have them accepted as part
        // of credentials.
        name: {
          label: 'Name',
          type: 'text',
          placeholder: '0x0',
        },
        pfp: {
          label: 'Pfp',
          type: 'text',
          placeholder: '0x0',
        },
      },
      async authorize(credentials: any) {
        console.log('======credentials:', credentials)

        try {
          const appClient = createAppClient({
            ethereum: viemConnector(),
          })

          const verifyResponse = await appClient.verifySignInMessage({
            message: credentials?.message as string,
            signature: credentials?.signature as `0x${string}`,
            domain: ROOT_DOMAIN,
            nonce: credentials.csrfToken,
          })
          const { success, fid } = verifyResponse

          if (!success) {
            return null
          }

          console.log('======:fid', fid.toString(), 'username:', credentials)

          const user = await initUserByFarcasterInfo({
            fid: fid.toString(),
            name: credentials?.name,
            image: credentials?.pfp,
          })
          return user
        } catch (error) {
          console.log('=====farcaster sign error==>>>>:', error)
          return null
        }
      },
    }),
    CredentialsProvider({
      id: 'farcaster-frame',
      name: 'Farcaster frame',
      credentials: {
        fid: {
          label: 'FID',
          type: 'text',
          placeholder: '',
        },
        username: {
          label: 'Username',
          type: 'text',
          placeholder: '',
        },
        displayName: {
          label: 'Display name',
          type: 'text',
          placeholder: '',
        },
        pfpUrl: {
          label: 'Picture',
          type: 'text',
          placeholder: '',
        },
        address: {
          label: 'Address',
          type: 'text',
          placeholder: '',
        },
      },
      async authorize(credentials) {
        try {
          if (!credentials?.fid || !credentials?.username) {
            throw new Error('Login fail')
          }
          const user = await initUserByFarcasterFrame(credentials)
          return user
        } catch (e) {
          console.log('=======>>>>e:', e)
          return null
        }
      },
    }),

    CredentialsProvider({
      id: 'password',
      name: 'PenX password login',
      credentials: {
        username: {
          label: 'username',
          type: 'text',
          placeholder: '',
        },
        password: {
          label: 'Password',
          type: 'text',
          placeholder: '',
        },
      },
      async authorize(credentials) {
        try {
          if (!credentials?.username || !credentials?.password) {
            throw new Error('Login fail')
          }

          if (validateEmail(credentials.username)) {
            //
          }

          const account = await prisma.account.findFirst({
            where: {
              OR: [
                {
                  providerType: ProviderType.PASSWORD,
                  providerAccountId: credentials.username,
                },
                {
                  providerType: ProviderType.EMAIL,
                  providerAccountId: credentials.username,
                },
              ],
            },
            include: {
              user: {
                include: {
                  subscriptions: true,
                  sites: {
                    include: {
                      domains: true,
                    },
                  },
                },
              },
            },
          })

          if (!account) {
            throw new Error('INVALID_USERNAME')
          }

          const match = compareSync(
            credentials.password,
            account.accessToken || '',
          )
          if (!match) throw new Error('INVALID_PASSWORD')

          return account
        } catch (e) {
          console.log('=======>>>>e:', e)
          return null
        }
      },
    }),
  ],
  pages: {
    signIn: `/`,
    verifyRequest: `/`,
    error: '/error', // Error code passed in query string as ?error=
    newUser: '/',
  },
  session: { strategy: 'jwt' },
  callbacks: {
    async jwt({ token, account, user, profile, trigger, session }) {
      if (user) {
        const sessionAccount = user as AccountWithUser
        // console.log('=====sessionUser:', sessionAccount)

        token.uid = sessionAccount.userId
        token.address = getAccountAddress(sessionAccount)
        token.ensName = sessionAccount.user?.ensName as string
        token.name = sessionAccount.user.name as string
        token.picture = sessionAccount.user.image as string
        token.domain = getSiteDomain(sessionAccount.user.sites[0])
        token.siteId = sessionAccount.user?.sites[0]?.id
        token.activeSiteId = sessionAccount.user?.sites[0]?.id
        token.subscriptionEndedAt = getSubscriptionEndedAt(
          sessionAccount.user.subscriptions,
        )

        token.accessToken = jwt.sign(
          {
            userId: token.uid,
            address: token.address,
          },
          process.env.NEXTAUTH_SECRET!,
          {
            expiresIn: '30d',
          },
        )

        token.subscriptions = Array.isArray(sessionAccount.user.subscriptions)
          ? sessionAccount.user.subscriptions.map((i: any) => ({
              planId: i.planId,
              startTime: i.startTime,
              duration: i.duration,
            }))
          : []
      }
      if (trigger === 'update') {
        if (session.type === 'UPDATE_PROFILE') {
          if (session.displayName) token.name = session.displayName
          if (session.image) token.picture = session.image
        }

        if (session.type === 'UPDATE_ACTIVE_SITE') {
          if (session.activeSiteId) token.activeSiteId = session.activeSiteId
        }

        const subscription = await prisma.subscription.findFirst({
          where: { userId: token.uid as string },
        })
        if (subscription) {
          token.subscriptionEndedAt = subscription.endedAt
        }

        // const subscriptions = await updateSubscriptions(
        //   token.uid as string,
        //   session.address as any,
        // )
        // token.subscriptions = Array.isArray(subscriptions)
        //   ? subscriptions.map((i: any) => ({
        //       planId: i.planId,
        //       startTime: Number(i.startTime),
        //       duration: Number(i.duration),
        //     }))
        //   : []
      }

      // console.log('jwt token========:', token)

      return token
    },
    session({ session, token, user, trigger, newSession }) {
      session.userId = token.uid as string
      session.address = token.address as string
      session.name = token.name as string
      session.picture = token.picture as string
      session.domain = token.domain as any
      session.siteId = token.siteId as any
      session.activeSiteId = token.activeSiteId as any
      session.subscriptions = token.subscriptions as any
      session.accessToken = token.accessToken as string
      session.subscriptionEndedAt = token.subscriptionEndedAt as any

      return session
    },
  },
}

async function updateSubscriptions(userId: string, address: Address) {
  if (!address) return []
  const site = await prisma.site.findFirst()
  if (!site?.spaceId) return []
  try {
    const publicClient = getBasePublicClient(NETWORK)

    const subscription = await publicClient.readContract({
      abi: spaceAbi,
      address: site?.spaceId as Address,
      functionName: 'getSubscription',
      args: [0, address],
    })

    // TODO:
    await prisma.user.update({
      where: { id: userId },
      data: {
        // subscriptions: [
        //   {
        //     ...subscription,
        //     startTime: Number(subscription.startTime),
        //     duration: Number(subscription.duration),
        //     amount: subscription.amount.toString(),
        //   },
        // ],
      },
    })
    return [subscription]
  } catch (error) {
    console.log('====== updateSubscriptions=error:', error)
    return []
  }
}

function getSubscriptionEndedAt(subscriptions: Subscription[] = []) {
  if (!subscriptions?.length) return null
  const [subscription] = subscriptions
  return subscription.endedAt
}
