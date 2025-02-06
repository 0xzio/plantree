'use client'

import { useState } from 'react'
import { LoadingDots } from '@/components/icons/loading-dots'
import { useSpaceContext } from '@/components/SpaceContext'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { useAddress } from '@/hooks/useAddress'
import { useSpace } from '@/hooks/useSpace'
import { useVestings, Vesting } from '@/hooks/useVestings'
import { spaceAbi } from '@/lib/abi'
import { extractErrorMessage } from '@/lib/extractErrorMessage'
import { shortenAddress } from '@/lib/utils'
import { wagmiConfig } from '@/lib/wagmi'
import { waitForTransactionReceipt, writeContract } from '@wagmi/core'
import { format } from 'date-fns'
import { toast } from 'sonner'
import { Address } from 'viem'

export function VestingList() {
  const { vestings = [], isLoading } = useVestings()
  const space = useSpaceContext()
  const address = useAddress()

  if (isLoading) {
    return (
      <div className="grid gap-4 mt-2">
        {Array(5)
          .fill('')
          .map((_, i) => (
            <Skeleton key={i} className="h-[60px] rounded-lg" />
          ))}
      </div>
    )
  }

  if (!vestings.length) {
    return (
      <div className="grid gap-4 mx-auto sm:w-full mt-2 text-foreground/40">
        No share order yet.
      </div>
    )
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead className="">Payer</TableHead>
          <TableHead>Beneficiary</TableHead>
          <TableHead>Start Time</TableHead>
          <TableHead>Allocation</TableHead>
          <TableHead>Operation</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {vestings.map((item) => (
          <TableRow key={item.beneficiary}>
            <TableCell className="flex gap-2 items-center">
              <div>{shortenAddress(item.payer)}</div>
              {space.isFounder(item.payer) ? (
                <Badge>Founder</Badge>
              ) : (
                <Badge variant="outline">Shareholder</Badge>
              )}
            </TableCell>
            <TableCell>{shortenAddress(item.beneficiary)}</TableCell>
            <TableCell>
              {format(new Date(Number(item.start) * 1000), 'yyyy-MM-dd')}
            </TableCell>
            <TableCell>{item.allocation.toString()} shares</TableCell>
            <TableCell>
              {item.payer === address && (
                <CancelVestingButton beneficiary={item.beneficiary} />
              )}
              {item.payer !== address && (
                <ClaimVestingButton beneficiary={item.beneficiary} />
              )}
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )
}

function CancelVestingButton({ beneficiary }: { beneficiary: Address }) {
  const space = useSpaceContext()
  const { refetch } = useVestings()
  const [loading, setLoading] = useState(false)

  return (
    <Button
      size="sm"
      variant="outline"
      className="rounded-xl w-20"
      onClick={async () => {
        try {
          setLoading(true)
          const hash = await writeContract(wagmiConfig, {
            address: space.address,
            abi: spaceAbi,
            functionName: 'removeVesting',
            args: [beneficiary],
          })
          await waitForTransactionReceipt(wagmiConfig, { hash })
          await refetch()
          toast.success('Cancel vesting successfully!')
        } catch (error) {
          const msg = extractErrorMessage(error)
          toast.error(msg)
        }
        setLoading(false)
      }}
    >
      {loading ? <LoadingDots></LoadingDots> : 'Cancel'}
    </Button>
  )
}

function ClaimVestingButton({ beneficiary }: { beneficiary: Address }) {
  const space = useSpaceContext()
  const { refetch } = useVestings()
  const [loading, setLoading] = useState(false)
  const address = useAddress()

  return (
    <Button
      size="sm"
      variant="outline"
      className="rounded-xl w-24"
      disabled={loading || address !== beneficiary}
      onClick={async () => {
        try {
          setLoading(true)
          const hash = await writeContract(wagmiConfig, {
            address: space.address,
            abi: spaceAbi,
            functionName: 'claimVesting',
          })
          await waitForTransactionReceipt(wagmiConfig, { hash })
          await refetch()
          toast.success('Claim share successfully!')
        } catch (error) {
          const msg = extractErrorMessage(error)
          toast.error(msg)
        }
        setLoading(false)
      }}
    >
      {loading ? <LoadingDots></LoadingDots> : 'Claim share'}
    </Button>
  )
}
