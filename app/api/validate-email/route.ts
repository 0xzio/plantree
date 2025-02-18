import { sendEmail } from '@/lib/aws-ses-client'
import { initUserByEmail } from '@/lib/initUser'
import { prisma } from '@/lib/prisma'
import jwt from 'jsonwebtoken'
import { User } from 'lucide-react'
import { CID } from 'multiformats/cid'
import { NextRequest, NextResponse } from 'next/server'

// export const runtime = 'edge'

export async function GET(req: NextRequest) {
  const url = new URL(req.url)
  const token = url.searchParams.get('token') as string

  try {
    const decoded = jwt.verify(token, process.env.NEXTAUTH_SECRET!) as any
    console.log('>>>>>>>>>>>>++++++++++++mail........', decoded)

    const email = decoded.email
    const password = decoded.password
    const account = await initUserByEmail(email, password)

    const loginToken = jwt.sign(
      {
        userId: account.userId,
        accountId: account.id,
      },
      process.env.NEXTAUTH_SECRET!,
      { expiresIn: '30d' },
    )

    return NextResponse.redirect(
      new URL(`/magic-login?token=${loginToken}`, req.url),
    )
  } catch (error) {
    return NextResponse.json({
      ok: false,
      error: error,
      message: 'Invalid token',
    })
  }
}
