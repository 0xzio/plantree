'use client'

import { Badge } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/skeleton'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { useSubscribers } from '@/hooks/useSubscribers'
import { format } from 'date-fns'
import { AddSubscriberDialog } from './AddSubscriberDialog/AddSubscriberDialog'

export function SubscriberList() {
  const { data = [], isLoading } = useSubscribers()

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

  return (
    <>
      <AddSubscriberDialog />
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Email</TableHead>
            <TableHead>Date subscribed</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.map((item, index) => (
            <TableRow key={index}>
              <TableCell>{item.email}</TableCell>
              <TableCell>{format(item.createdAt, 'yyyy/MM/dd')}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </>
  )
}
