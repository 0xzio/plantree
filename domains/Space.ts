import { Address } from 'viem'
import { Plan } from './Plan'

export type SpaceRaw = {
  name: string
  symbol: string
  founder: Address
  x: bigint
  y: bigint
  k: bigint
  insuranceEthAmount: bigint
  insuranceTokenAmount: bigint
  daoFee: bigint
  stakingFee: bigint
  subscriptionIncome: bigint
  totalStaked: bigint
  accumulatedRewardsPerToken: bigint
  totalShare: bigint
  accumulatedRewardsPerShare: bigint
}

export type TokenRaw = [bigint, bigint, bigint]

export type PlanRaw = {
  uri: string
  price: bigint
  isActive: boolean
}

export const FEE_RATE = BigInt(1) // 1%
export const SECONDS_PER_MONTH = BigInt(24 * 60 * 60 * 30) // 30 days
export const SECONDS_PER_DAY = BigInt(24 * 60 * 60) // 1 days

export class Space {
  constructor(
    public tokenRaw: TokenRaw,
    public planRaws: PlanRaw[],
  ) {}

  // get symbolName() {
  //   return this.tokenRaw?.symbol
  // }

  get x() {
    return this.tokenRaw[0]
  }

  get y() {
    return this.tokenRaw[1]
  }

  get k() {
    return this.tokenRaw[2]
  }

  plans: Plan[] = this.planRaws.map(
    (planRaw) => new Plan(planRaw, this.x, this.y, this.k),
  )

  getTokenAmount(ethAmount: bigint) {
    const fee = (ethAmount * FEE_RATE) / BigInt(100)
    const ethAmountAfterFee = ethAmount - fee
    const newX = this.x + ethAmountAfterFee
    const newY = this.k / newX
    const tokenAmount = this.y - newY
    return tokenAmount
  }

  getEthAmount(tokenAmount: bigint) {
    const fee = (tokenAmount * FEE_RATE) / BigInt(100)
    const tokenAmountAfterFee = tokenAmount - fee
    const newY = this.y + tokenAmountAfterFee
    const newX = this.k / newY
    const ethAmount = this.x - newX
    return ethAmount
  }
}
