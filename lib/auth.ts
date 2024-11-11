import { spaceAbi } from '@/lib/abi'
import { NETWORK, NetworkNames } from '@/lib/constants'
import { prisma } from '@/lib/prisma'
import { User, UserRole } from '@prisma/client'
import { readContract } from '@wagmi/core'
import NextAuth, { getServerSession, type NextAuthOptions } from 'next-auth'
import credentialsProvider from 'next-auth/providers/credentials'
import { Address, createPublicClient, http } from 'viem'
import { base, baseSepolia, mainnet } from 'viem/chains'
import {
  parseSiweMessage,
  validateSiweMessage,
  type SiweMessage,
} from 'viem/siwe'

const nextAuthSecret = process.env.NEXTAUTH_SECRET
if (!nextAuthSecret) {
  throw new Error('NEXTAUTH_SECRET is not set')
}

const publicClient = createPublicClient({
  chain: mainnet,
  transport: http(),
})

export const authOptions: NextAuthOptions = {
  secret: nextAuthSecret,
  providers: [
    credentialsProvider({
      name: 'Ethereum',
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

          const nextAuthUrl =
            process.env.NEXTAUTH_URL ||
            (process.env.VERCEL_URL
              ? `https://${process.env.VERCEL_URL}`
              : null)
          if (!nextAuthUrl) {
            return null
          }

          const nextAuthHost = new URL(nextAuthUrl).host
          if (siweMessage.domain !== nextAuthHost) {
            return null
          }

          const publicClient = createPublicClient({
            chain: getChain(),
            transport: http(),
          })

          const valid = await publicClient.verifyMessage({
            address: siweMessage?.address,
            message: credentials?.message,
            signature: credentials?.signature,
          })

          if (!valid) {
            return null
          }
          const address = siweMessage.address

          const user = await createUserByAddress(address)
          return { ...user }
        } catch (e) {
          return null
        }
      },
    }),
  ],
  // pages: {
  //   signIn: `/login`,
  //   verifyRequest: `/login`,
  //   error: '/login', // Error code passed in query string as ?error=
  // },
  session: { strategy: 'jwt' },
  callbacks: {
    async jwt({ token, account, user, profile, trigger, session }) {
      if (user) {
        const sessionUser = user as User & { chainId: string }
        token.uid = sessionUser.id
        token.address = sessionUser.address as string
        token.chainId = sessionUser.chainId
        token.ensName = (sessionUser.ensName as string) || null
        token.role = (sessionUser.role as string) || null
      }

      // console.log('jwt token========:', token)

      return token
    },
    session({ session, token, user, trigger, newSession }) {
      session.userId = token.uid as string
      session.address = token.address as string
      session.chainId = token.chainId as string
      session.ensName = token.ensName as string
      session.role = token.role as string

      return session
    },
  },
}

export function getSession() {
  return getServerSession(authOptions) as Promise<{
    user: {
      id: string
      name: string
      username: string
      email: string
      image: string
    }
    userId: string
    address: string
    chainId: string
    ensName: string
    role: UserRole
  } | null>
}

async function createUserByAddress(address: any) {
  let user = await prisma.user.findUnique({ where: { address } })

  let ensName: string | null = ''
  try {
    ensName = await publicClient.getEnsName({ address })
  } catch (error) {}

  const isAdmin = address === process.env.DEFAULT_ADMIN_ADDRESS
  const role = isAdmin ? UserRole.ADMIN : UserRole.USER

  if (!user) {
    user = await prisma.user.create({
      data: { address, ensName, role },
    })
  } else {
    await prisma.user.update({
      where: { id: user.id },
      data: { ensName: ensName, role },
    })
  }

  return { ...user, ensName }
}

function getChain() {
  if (NETWORK === NetworkNames.BASE_SEPOLIA) {
    return baseSepolia
  }
  return base
}
