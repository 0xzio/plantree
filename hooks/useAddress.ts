import { useSession } from '@/lib/useSession'
import { Address } from 'viem'
import { useAccount } from 'wagmi'

export function useAddress() {
  const { address } = useAccount()

  // const { data } = useSession()
  // return (data?.address || '') as Address
  return (address || '') as Address
}
