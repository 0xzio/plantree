import { useState } from 'react'
import { LoadingDots } from '@/components/icons/loading-dots'
import { Button } from '@/components/ui/button'
import { WalletConnectButton } from '@/components/WalletConnectButton'
import { useCheckChain } from '@/hooks/useCheckChain'
import { useWagmiConfig } from '@/hooks/useWagmiConfig'
import { erc20Abi, spaceAbi } from '@/lib/abi'
import { extractErrorMessage } from '@/lib/extractErrorMessage'
import { precision } from '@/lib/math'
import { waitForTransactionReceipt } from '@wagmi/core'
import { toast } from 'sonner'
import { Address } from 'viem'
import { useWriteContract } from 'wagmi'
import { Space } from '@/domains/Space'
import { useAddress } from '@/hooks/useAddress'
import { useQueryEthBalance } from '@/hooks/useEthBalance'
import { useTrades } from '@/hooks/useTrades'
import { useSpaceTokenBalance } from './hooks/useSpaceTokenBalance'

interface Props {
  ethAmount: string
  tokenAmount: string
  handleSwap: () => void
  isInsufficientBalance: boolean
  isAmountValid: boolean
  space: Space
}

export const SellBtn = ({
  ethAmount,
  tokenAmount,
  isInsufficientBalance,
  isAmountValid,
  handleSwap,
  space,
}: Props) => {
  const [loading, setLoading] = useState(false)
  const { writeContractAsync } = useWriteContract()
  const balance = useSpaceTokenBalance()
  const address = useAddress()
  const wagmiConfig = useWagmiConfig()
  const checkChain = useCheckChain()
  const { refetch: refetchEth } = useQueryEthBalance()
  const trade = useTrades()

  const onSell = async () => {
    setLoading(true)
    try {
      await checkChain()
      const value = precision.toExactDecimalBigint(tokenAmount)
      const contractAddress = space.address as Address
      const approveTx = await writeContractAsync({
        address: contractAddress,
        abi: erc20Abi,
        functionName: 'approve',
        args: [contractAddress, value],
      })

      await waitForTransactionReceipt(wagmiConfig, { hash: approveTx })

      const hash = await writeContractAsync({
        address: contractAddress,
        abi: spaceAbi,
        functionName: 'sell',
        args: [value, BigInt(0)],
      })

      await waitForTransactionReceipt(wagmiConfig, { hash })

      await Promise.all([balance.refetch(), refetchEth()])
      trade.refetch()
      handleSwap()
      toast.success(`Sold ${space?.symbolName} successfully!`)
    } catch (error) {
      toast.error(extractErrorMessage(error) || 'sell error')
    }
    setLoading(false)
  }

  return (
    <>
      {address ? (
        <Button
          variant="brand"
          className="h-[50px] w-full rounded-xl"
          disabled={!isAmountValid || isInsufficientBalance || loading}
          onClick={() => onSell()}
        >
          {loading ? (
            <LoadingDots />
          ) : isInsufficientBalance ? (
            `Insufficient ${space.symbolName} balance`
          ) : isAmountValid ? (
            'Sell'
          ) : (
            'Enter an amount'
          )}
        </Button>
      ) : (
        <WalletConnectButton
          variant="brand"
          className="h-[50px] w-full rounded-full"
        >
          Connect wallet
        </WalletConnectButton>
      )}
    </>
  )
}
