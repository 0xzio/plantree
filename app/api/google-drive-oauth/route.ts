import { prisma } from '@/lib/prisma'
import { google } from 'googleapis'
import { NextRequest, NextResponse } from 'next/server'

const clientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID!
const clientSecret = process.env.GOOGLE_CLIENT_SECRET!

type TokenInfo = {
  access_token: string
  refresh_token: string
  scope: string
  token_type: string
  id_token: string
  expiry_date: number
}

export async function GET(req: NextRequest) {
  const url = new URL(req.url)
  const code = url.searchParams.get('code')
  const state = url.searchParams.get('state') as string

  const redirectUri = `${process.env.NEXTAUTH_URL}/api/google-drive-oauth`

  console.log('=======state:', state, 'redirectUri:', redirectUri)

  if (!code || !state) {
    return NextResponse.redirect('/error') // Handle error accordingly
  }

  const [host, address] = state.split('____')
  console.log('>>>>>>>>host, address:', host, address)

  const auth = new google.auth.OAuth2(clientId, clientSecret, redirectUri)

  const { tokens } = await auth.getToken(code)

  console.log('========tokens:', tokens)

  const oauth2Client = new google.auth.OAuth2(clientId, clientSecret)
  oauth2Client.setCredentials(tokens)

  const oauth2 = google.oauth2({
    auth: oauth2Client,
    version: 'v2',
  })

  const userInfo = await oauth2.userinfo.get()

  // console.log('userInfo======userInfo.data:', userInfo.data)

  // await prisma.user.update({
  //   where: { address: siteUrl },
  //   data: {
  //     google: {
  //       ...tokens,
  //       ...userInfo.data,
  //     },
  //   },
  // })

  return NextResponse.redirect(
    `${host}/api/google-oauth?address=${address}&access_token=${tokens.access_token}&refresh_token=${tokens.refresh_token}&expiry_date=${tokens.expiry_date}`,
  )
}
