import { useMemo, useState } from "react"
import { StakingInput } from "./StakingInput"
import { toFloorFixed } from "@/lib/utils"
import { precision } from "@/lib/math"
import { useSpaceTokenBalance } from "@/components/spaceToken/hooks/useSpaceTokenBalance"
import { Button } from "@/components/ui/button"
import { useSpace } from "@/hooks/useSpace"
import { useAccount, useWriteContract } from "wagmi"
import { WalletConnectButton } from "@/components/WalletConnectButton"
import LoadingDots from "@/components/icons/loading-dots"
import { checkChain } from "@/lib/checkChain"
import { Address } from 'viem'
import { erc20Abi, spaceAbi } from '@/lib/abi'
import { wagmiConfig } from "@/lib/wagmi"
import { waitForTransactionReceipt } from '@wagmi/core'
import { toast } from "sonner"
import { extractErrorMessage } from "@/lib/extractErrorMessage"

export enum StakingDirection {
  Unstaking = 1,
  Staking = 2,
}

export const StakingPanel = () => {
  const { writeContractAsync } = useWriteContract()
  const [tokenAmount, setTokenAmount] = useState<string>('')
  const { data: tokenBalance } = useSpaceTokenBalance()
  const { space } = useSpace()
  const { isConnected } = useAccount()
  const [loading, setLoading] = useState(false)
  const [stakingDirection, setStakingDirection] = useState<StakingDirection>(StakingDirection.Staking)

  const isInsufficientBalance = useMemo(() => {
    if (stakingDirection === StakingDirection.Unstaking) {
      return false
    }

    const balance = precision.toDecimal(tokenBalance! || '0');
    const amount = parseFloat(tokenAmount);

    return balance < amount;
  }, [tokenBalance, tokenAmount, stakingDirection]);


  const isInsufficientBalanceUnstake = useMemo(() => {
    if (stakingDirection === StakingDirection.Staking) {
      return false
    }

    // const balance = precision.toDecimal(tokenBalance! || '0');
    // const amount = parseFloat(tokenAmount);
    // TODO: test
    return false;
  }, [tokenBalance, tokenAmount, stakingDirection]);

  const isAmountValid = parseFloat(tokenAmount) > 0

  const handleTokenChange = (value: string) => {
    setTokenAmount(value)
  }

  const handleMax = () => {
    if (!tokenBalance) return

    setTokenAmount(toFloorFixed(precision.toDecimal(tokenBalance), 4).toString())
  }

  const onStaking = async (stakingDirection: StakingDirection) => {
    setLoading(true)
    try {
      await checkChain()
      const value = precision.toExactDecimalBigint(tokenAmount)
      const contractAddress = space.address as Address
      if (stakingDirection === StakingDirection.Staking) {
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
          functionName: 'stake',
          args: [value],
        })

        await waitForTransactionReceipt(wagmiConfig, { hash })

        setTokenAmount('')
        toast.success(`Stake ${space?.symbolName} successfully!`)
      } else if (stakingDirection === StakingDirection.Unstaking) {
        const hash = await writeContractAsync({
          address: contractAddress,
          abi: spaceAbi,
          functionName: 'unstake',
          args: [value],
        })

        await waitForTransactionReceipt(wagmiConfig, { hash })

        setTokenAmount('')
        toast.success(`Unstake ${space?.symbolName} successfully!`)
      }
    } catch (error) {
      toast.error(extractErrorMessage(error) || 'Error')
    }

    setLoading(false)
  }

  const onSwitch = (direction: StakingDirection) => {
    setStakingDirection(direction)
    setTokenAmount('')
  }

  const renderButtonContent = () => {
    if (loading) {
      return <LoadingDots color="white" />;
    }

    if (!isAmountValid) {
      return 'Enter an amount';
    }

    if (stakingDirection === StakingDirection.Staking) {
      if (isInsufficientBalance) {
        return `Insufficient ${space.symbolName} balance`;
      }

      return 'Staking';
    } else if (stakingDirection === StakingDirection.Unstaking) {
      if (isInsufficientBalanceUnstake) {
        return `Insufficient ${space.symbolName} balance`;
      }

      return 'Unstaking';
    }


    return '';
  };

  return <div className="min-w-[320px] max-w-[460px] mt-10 p-10 border rounded-lg border-gray-300">
    <div className="mb-2">
      <button
        onClick={() => onSwitch(StakingDirection.Staking)}
        className={`mr-[10px] text-[#222222] py-[6px] px-[16px] rounded-[16px] ${stakingDirection === StakingDirection.Staking ? 'bg-[#22222212]' : ''}`}
      >
        Staking
      </button>
      <button
        onClick={() => onSwitch(StakingDirection.Unstaking)}
        className={`py-[6px] px-[16px] rounded-[16px] ${stakingDirection === StakingDirection.Unstaking ? 'bg-[#22222212]' : ''}`}
      >
        Unstaking
      </button>
    </div>
    <div>
      <div className="flex items-center px-4 py-2 rounded-lg border border-gray-300">
        <img src={space.logo} alt="ETH" className="w-5 h-auto rounded-full" />
        <div className="ml-2">
          <span className="text-sm">{space.symbolName}</span>
          <StakingInput
            value={tokenAmount}
            onChange={(value) => handleTokenChange(value)}
          />
        </div>

        <Button
          onClick={handleMax}
          disabled={
            typeof tokenBalance === undefined ||
            precision.toDecimal(tokenBalance!) <= 0
          }
          className="h-6 cursor-pointer text-xs text-white rounded-md px-2"
        >
          Max
        </Button>
      </div>

      <div className="w-full h-[50px] mt-4 text-sm text-white">
        {isConnected ? (
          <Button
            onClick={() => onStaking(stakingDirection)}
            disabled={!isAmountValid || isInsufficientBalance || isInsufficientBalanceUnstake || loading}
            className="w-full h-full cursor-pointer rounded-md"
          >
            {renderButtonContent()}
          </Button>
        ) : (
          <WalletConnectButton className="w-full h-full rounded-md">
            Connect wallet
          </WalletConnectButton>
        )}
      </div>
    </div>
  </div>
}
