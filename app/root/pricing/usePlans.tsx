'use client'

import { memberAbi } from '@/lib/abi/penx'
import { addressMap } from '@/lib/address'
import { useReadContract } from 'wagmi'

export function usePlans() {
  const { data, isLoading, ...rest } = useReadContract({
    address: addressMap.Member,
    abi: memberAbi,
    functionName: 'getPlans',
  })

  return {
    data,
    isLoading,
    getPlanPrice: () => {
      if (!data) return BigInt(0)
      return data?.[0]!.price
    },
    ...rest,
  }
}
