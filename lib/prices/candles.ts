import { getSpaceTokenTrades } from '../getSpaceTokenTrades'
import { Candle, Period, Trade } from '../types'

export async function getCandlesData(
  tokenAddress: string,
  period: Period,
  limit: number,
): Promise<Candle[]> {

    // todo

  const secondsPeriod = periodToSeconds(period) 
  const endTimestamp = Math.floor(Date.now() / 1000)
  const startTimestamp = endTimestamp - secondsPeriod * limit

  let trades: Trade[] = []
  let currentStartTimestamp = startTimestamp

  while (trades.length === 0 && currentStartTimestamp < endTimestamp) {
    trades = await getSpaceTokenTrades(
      tokenAddress,
      currentStartTimestamp,
      endTimestamp,
    )
    currentStartTimestamp -= secondsPeriod 
  }

  const candles: Candle[] = []
  let lastPrice = 0 

  const candleCount = Math.ceil((endTimestamp - startTimestamp) / secondsPeriod)
  for (let i = 0; i < candleCount; i++) {
    candles.push({
      timestamp: startTimestamp + i * secondsPeriod,
      open: 0,
      high: 0,
      low: 0,
      close: 0,
    })
  }

  trades.forEach((trade) => {
    const tradeTime = Number(trade.timestamp)
    const ethAmount = parseFloat(trade.ethAmount) / 1e18
    const tokenAmount = parseFloat(trade.tokenAmount) / 1e18

    if (tokenAmount === 0) return

    const tokenPrice = ethAmount / tokenAmount
    lastPrice = tokenPrice 

    const candleIndex = Math.floor((tradeTime - startTimestamp) / secondsPeriod)

    if (candleIndex >= 0 && candleIndex < candles.length) {
      if (candles[candleIndex].open === 0) {
        candles[candleIndex].open = tokenPrice
      }
      candles[candleIndex].high = Math.max(
        candles[candleIndex].high,
        tokenPrice,
      )
      candles[candleIndex].low =
        candles[candleIndex].low === 0
          ? tokenPrice
          : Math.min(candles[candleIndex].low, tokenPrice)
      candles[candleIndex].close = tokenPrice
    }
  })

  candles.forEach((candle) => {
    if (candle.high === 0 && candle.low === 0 && candle.close === 0) {
      candle.open = lastPrice 
      candle.high = lastPrice 
      candle.low = lastPrice
      candle.close = lastPrice 
    }
  })

  return candles.slice(-limit)
}

function periodToSeconds(period: Period): number {
  switch (period) {
    case '1m':
      return 60 
    case '5m':
      return 5 * 60 
    case '15m':
      return 15 * 60
    case '1h':
      return 60 * 60
    case '4h':
      return 4 * 60 * 60 
    case '1d':
      return 24 * 60 * 60 
    default:
      throw new Error(`Invalid period: ${period}`)
  }
}
