import { prisma } from '@/lib/prisma'
import { NextRequest, NextResponse } from 'next/server'

const apiKey = process.env.CREEM_API_KEY!

export async function POST(req: NextRequest) {
  const json = await req.json()
  console.log('==============>>>>>>>>>>>>:', json)
  return NextResponse.json({ ok: false })
}
