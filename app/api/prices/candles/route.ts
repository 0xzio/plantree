import { getCandlesData } from '@/lib/prices/candles'
import { Period } from '@/lib/types'
import { NextResponse } from 'next/server'

export async function GET(req: Request) {
  const url = new URL(req.url)
  const tokenAddress = url.searchParams.get('tokenAddress') || ''
  const period = url.searchParams.get('period') as Period
  const limit = parseInt(url.searchParams.get('limit') || '10')

  if (!tokenAddress) {
    return NextResponse.json(
      { error: 'tokenAddress is required.' },
      { status: 400 },
    )
  }

  if (!period) {
    return NextResponse.json({ error: 'period is required.' }, { status: 400 })
  }

  if (isNaN(limit) || limit <= 0) {
    return NextResponse.json(
      { error: 'Invalid limit. It must be a positive number.' },
      { status: 400 },
    )
  }

  const candles = await getCandlesData(tokenAddress, period, limit)

  return NextResponse.json({
    period: period,
    candles: candles,
  })
}
