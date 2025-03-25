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
import { Site } from '@prisma/client'
import { format } from 'date-fns'
import { produce } from 'immer'
import { Edit3, Eye, EyeOff } from 'lucide-react'
import { toast } from 'sonner'

interface Props {}

export function ReferralList({}: Props) {
  const { data = [], isLoading } = trpc.referral.list.useQuery()

  console.log('=======data:', data)

  if (isLoading) {
    return (
      <div>
        <LoadingDots className="bg-foreground" />
      </div>
    )
  }
  return (
    <>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Username</TableHead>
            <TableHead>Plan type</TableHead>
            <TableHead>Created</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.map((item, index) => {
            const site = item.user.sites[0]
            return (
              <TableRow key={index}>
                <TableCell>{item.user.name}</TableCell>
                <TableCell className="flex items-center gap-1">
                  <span>{site.sassPlanType}</span>
                </TableCell>
                <TableCell>{format(item.createdAt, 'yyyy-MM-dd')}</TableCell>
              </TableRow>
            )
          })}
        </TableBody>
      </Table>
    </>
  )
}
