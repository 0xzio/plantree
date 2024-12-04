import { useAddress } from '@/hooks/useAddress'
import { penTokenAbi } from '@/lib/abi'
import { addressMap } from '@/lib/address'
import { useReadContract } from 'wagmi'

export function usePenBalance() {
  const address = useAddress()
  return useReadContract({
    address: addressMap.PenToken,
    abi: penTokenAbi,
    functionName: 'balanceOf',
    args: [address!],
  })
}
