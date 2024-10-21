import { useAddress } from '@/hooks/useAddress'
import { treeTokenAbi } from '@/lib/abi'
import { addressMap } from '@/lib/address'
import { useReadContract } from 'wagmi'

export function useInkBalance() {
  const address = useAddress()
  return useReadContract({
    address: addressMap.TreeToken,
    abi: treeTokenAbi,
    functionName: 'balanceOf',
    args: [address!],
  })
}
