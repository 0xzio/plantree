import { precision } from '@/lib/math'
import { FEE_RATE, SECONDS_PER_DAY } from './Space'

export const SECONDS_PER_MONTH = BigInt(24 * 60 * 60 * 30) // 30 days

export type PlanRaw = {
  uri: string
  price: bigint
  isActive: boolean
}

export class Plan {
  constructor(
    public raw: PlanRaw,
    private x: bigint,
    private y: bigint,
    private k: bigint,
  ) {}

  get name() {
    return this.raw.uri
  }

  get subscriptionPrice() {
    return this.raw.price
  }

  get subscriptionPriceDecimal() {
    return precision.toDecimal(this.subscriptionPrice)
  }

  getUsdPrice(ethPrice: number) {
    return ethPrice * this.subscriptionPriceDecimal
  }

  getEthPricePerSecond() {
    const ethPricePerSecond = this.subscriptionPrice / SECONDS_PER_MONTH
    return ethPricePerSecond
  }

  /**
   * calculate the eth from subscription in a given duration
   * @param duration  duration by seconds
   * @returns
   */
  calEthByDuration(days: number | string) {
    const duration = BigInt(
      parseInt((Number(days) * Number(SECONDS_PER_DAY)).toString()),
    )
    const tokenPricePerSecond = this.getEthPricePerSecond()
    return duration * tokenPricePerSecond
  }

  calTokenByDuration(days: number | string) {
    const duration = BigInt(Number(days) * Number(SECONDS_PER_DAY))
    const tokenPricePerSecond = this.getTokenPricePerSecond()
    return duration * tokenPricePerSecond
  }

  getTokenPricePerSecond() {
    const ethPricePerSecond = this.getEthPricePerSecond()
    const tokenAmount = this.getTokenAmount(ethPricePerSecond)
    return tokenAmount
  }

  getTokenAmount(ethAmount: bigint) {
    const fee = (ethAmount * FEE_RATE) / BigInt(100)
    const ethAmountAfterFee = ethAmount - fee
    const newX = this.x + ethAmountAfterFee
    const newY = this.k / newX
    const tokenAmount = this.y - newY
    return tokenAmount
  }
}
