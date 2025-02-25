import { NextRequest, NextResponse } from 'next/server'

export async function GET(req: NextRequest) {
  const url = new URL(req.url)
  // const hash = url.searchParams.get('cid')

  const data = {
    url: url.toString(),
    query: url.searchParams.toString(),
    ok: true,
  }
  return NextResponse.json(data)
}