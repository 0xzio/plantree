'use client'

import { LoadingDots } from '@/components/icons/loading-dots'
import { Button } from '@/components/ui/button'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { useSite } from '@/hooks/useSite'
import { api, trpc } from '@/lib/trpc'
import { cn } from '@/lib/utils'
import { Site, TransferMethod } from '@prisma/client'
import { format } from 'date-fns'
import { produce } from 'immer'
import { Edit3, Eye, EyeOff } from 'lucide-react'
import { toast } from 'sonner'
import { PayoutAccountDialog } from './PayoutAccountDialog/PayoutAccountDialog'
import { usePayoutAccountDialog } from './PayoutAccountDialog/usePayoutAccountDialog'
import { useProductPriceDialog } from './ProductPriceDialog/useProductPriceDialog'

interface Props {}

export function PayoutAccountList({}: Props) {
  const { setState } = usePayoutAccountDialog()
  const productPriceDialog = useProductPriceDialog()
  const { data = [], isLoading } = trpc.payoutAccount.list.useQuery()

  if (isLoading) {
    return (
      <div>
        <LoadingDots className="bg-foreground" />
      </div>
    )
  }

  if (!data?.length)
    return (
      <div className="text-center mt-2 bg-amber-100">
        No payout accounts found.
      </div>
    )
  return (
    <>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Type</TableHead>
            <TableHead>Account</TableHead>
            <TableHead>Created</TableHead>
            <TableHead>Edit</TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          {data.map((item, index) => {
            let account: any
            if (item.transferMethod === TransferMethod.WALLET) {
              const info = item.info as any
              account = info?.address
            }

            return (
              <TableRow key={index}>
                <TableCell>{item.transferMethod}</TableCell>
                <TableCell>{account}</TableCell>
                <TableCell>{format(item.createdAt, 'MM-dd')}</TableCell>
                <TableCell className="flex items-center gap-1 text-foreground/70">
                  <Edit3
                    size={18}
                    className="cursor-pointer"
                    onClick={() => {
                      // setState({
                      //   isOpen: true,
                      //   product: item,
                      //   index,
                      // })
                    }}
                  />
                </TableCell>
              </TableRow>
            )
          })}
        </TableBody>
      </Table>
    </>
  )
}
