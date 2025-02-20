import { NETWORK, ROOT_DOMAIN } from '@/lib/constants'
import { getBasePublicClient } from '@/lib/getBasePublicClient'
import { getSiteDomain } from '@/lib/getSiteDomain'
import {
  initUserByAddress,
  initUserByEmail,
  initUserByFarcasterInfo,
  initUserByGoogleInfo,
} from '@/lib/initUser'
import { prisma } from '@/lib/prisma'
import { getServerSession, getSessionOptions } from '@/lib/session'
import {
  AccountWithUser,
  isFarcasterLogin,
  isGoogleLogin,
  isPasswordLogin,
  isRegisterByEmail,
  isUpdateActiveSite,
  isUpdateProfile,
  isUpdateSubscription,
  isWalletLogin,
  SessionData,
} from '@/lib/types'
import { getAccountAddress } from '@/lib/utils'
import { generateNonce } from '@/server/lib/generateNonce'
import { createAppClient, viemConnector } from '@farcaster/auth-client'
import { ProviderType, Subscription } from '@prisma/client'
import { compareSync } from 'bcrypt-edge'
import { getIronSession, IronSession } from 'iron-session'
import jwt from 'jsonwebtoken'
import { cookies } from 'next/headers'
import { NextRequest } from 'next/server'
import {
  parseSiweMessage,
  validateSiweMessage,
  type SiweMessage,
} from 'viem/siwe'

// export const runtime = 'edge'

async function updateSession(
  session: IronSession<SessionData>,
  account: AccountWithUser,
) {
  session.isLoggedIn = true
  session.message = ''
  session.uid = account.userId
  session.userId = account.userId
  session.address = getAccountAddress(account)
  session.ensName = account.user?.ensName as string
  session.name = account.user.name as string
  session.picture = account.user.image as string
  session.image = account.user.image as string
  session.domain = getSiteDomain(account.user.sites[0])
  session.siteId = account.user?.sites[0]?.id
  session.activeSiteId = account.user?.sites[0]?.id
  session.subscriptionEndedAt = getSubscriptionEndedAt(
    account.user.subscriptions,
  )

  session.accessToken = jwt.sign(
    {
      userId: session.uid,
      address: session.address,
    },
    process.env.NEXTAUTH_SECRET!,
    {
      expiresIn: '30d',
    },
  )

  session.subscriptions = Array.isArray(account.user.subscriptions)
    ? account.user.subscriptions.map((i: any) => ({
        planId: i.planId,
        startTime: i.startTime,
        duration: i.duration,
      }))
    : []

  await session.save()
}

// login
export async function POST(request: NextRequest) {
  const session = await getIronSession<SessionData>(
    await cookies(),
    getSessionOptions(),
  )
  const json = await request.json()

  if (isGoogleLogin(json)) {
    const account = await initUserByGoogleInfo(json)
    await updateSession(session, account)

    console.log('======session:', session)

    return Response.json(session)
  }

  if (isWalletLogin(json)) {
    try {
      const siweMessage = parseSiweMessage(json?.message) as SiweMessage

      if (
        !validateSiweMessage({
          address: siweMessage?.address,
          message: siweMessage,
        })
      ) {
        session.isLoggedIn = false
        await session.save()
        return Response.json(session)
      }

      const publicClient = getBasePublicClient(NETWORK)

      const valid = await publicClient.verifyMessage({
        address: siweMessage?.address,
        message: json?.message,
        signature: json?.signature as any,
      })

      if (!valid) {
        session.isLoggedIn = false
        await session.save()
        return Response.json(session)
      }

      const address = siweMessage.address.toLowerCase()
      const account = await initUserByAddress(address)
      await updateSession(session, account)
      return Response.json(session)
    } catch (e) {
      console.log('wallet auth error======:', e)
    }
  }

  if (isRegisterByEmail(json)) {
    try {
      const decoded = jwt.verify(
        json.validateToken,
        process.env.NEXTAUTH_SECRET!,
      ) as any

      const email = decoded.email
      const password = decoded.password
      const account = await initUserByEmail(email, password)
      await updateSession(session, account)
      return Response.json(session)
    } catch (error) {
      session.isLoggedIn = false
      await session.save()
      return Response.json(session)
    }
  }

  if (isFarcasterLogin(json)) {
    try {
      const appClient = createAppClient({
        ethereum: viemConnector(),
      })

      const verifyResponse = await appClient.verifySignInMessage({
        message: json.message as string,
        signature: json.signature as `0x${string}`,
        domain: ROOT_DOMAIN,
        nonce: generateNonce(),
      })
      const { success, fid } = verifyResponse

      if (!success) {
        session.isLoggedIn = false
        await session.save()
        return Response.json(session)
      }

      const account = await initUserByFarcasterInfo({
        fid: fid.toString(),
        name: json.name,
        image: json.pfp,
      })

      await updateSession(session, account)
      return Response.json(session)
    } catch (error) {
      session.isLoggedIn = false
      await session.save()
      return Response.json(session)
    }
  }

  if (isPasswordLogin(json)) {
    try {
      const account = await prisma.account.findFirst({
        where: {
          OR: [
            {
              providerType: ProviderType.PASSWORD,
              providerAccountId: json.username,
            },
            {
              providerType: ProviderType.EMAIL,
              providerAccountId: json.username,
            },
          ],
        },
        include: {
          user: {
            include: {
              subscriptions: true,
              sites: { include: { domains: true } },
            },
          },
        },
      })

      if (!account) {
        throw new Error('INVALID_USERNAME')
      }

      const match = compareSync(json.password, account.accessToken || '')
      if (!match) throw new Error('INVALID_PASSWORD')

      await updateSession(session, account)
      return Response.json(session)
    } catch (error: any) {
      console.log('error.mess==:', error.message)

      if (error.message === 'INVALID_USERNAME') {
        session.message = 'Invalid username'
      }

      if (error.message === 'INVALID_PASSWORD') {
        session.message = 'Invalid password'
      }

      session.isLoggedIn = false
      await session.save()
      return Response.json(session)
    }
  }

  session.isLoggedIn = false
  await session.save()
  return Response.json(session)
}

export async function PATCH(request: NextRequest) {
  const sessionOptions = getSessionOptions()
  const session = await getIronSession<SessionData>(
    await cookies(),
    sessionOptions,
  )

  const json = await request.json()

  if (isUpdateActiveSite(json)) {
    session.activeSiteId = json.activeSiteId
  }

  if (isUpdateProfile(json)) {
    if (json.displayName) session.name = json.displayName
    if (json.image) session.picture = json.image
  }

  if (isUpdateSubscription(json)) {
    const subscription = await prisma.subscription.findFirst({
      where: { userId: session.uid as string },
    })
    if (subscription) {
      session.subscriptionEndedAt = subscription.endedAt
    }
  }

  // session.updateConfig({
  //   ...sessionOptions,
  //   cookieOptions: {
  //     ...sessionOptions.cookieOptions,
  //     expires: new Date('2024-12-27T00:00:00.000Z'),
  //     maxAge: undefined,
  //   },
  // })

  await session.save()

  return Response.json(session)
}

// read session
export async function GET() {
  const session = await getServerSession()

  if (session?.isLoggedIn !== true) {
    return Response.json({})
  }

  return Response.json(session)
}

// logout
export async function DELETE() {
  const sessionOptions = getSessionOptions()
  const session = await getIronSession<SessionData>(
    await cookies(),
    sessionOptions,
  )

  session.destroy()
  return Response.json({ isLoggedIn: false })
}

function getSubscriptionEndedAt(subscriptions: Subscription[] = []) {
  if (!subscriptions?.length) return null
  const [subscription] = subscriptions
  return subscription.endedAt
}
