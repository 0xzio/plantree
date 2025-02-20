'use client'

import { ConfirmDialog } from '@/components/ConfirmDialog'
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
import { api } from '@/lib/trpc'
import { format } from 'date-fns'
import { Trash2 } from 'lucide-react'
import { AddSubscriberDialog } from './AddSubscriberDialog/AddSubscriberDialog'

export function SubscriberList() {
  const { data = [], isLoading, refetch } = useSubscribers()

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
            <TableHead>Operation</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.map((item, index) => (
            <TableRow key={index}>
              <TableCell>{item.email}</TableCell>
              <TableCell>{format(item.createdAt, 'yyyy/MM/dd')}</TableCell>
              <TableCell>
                <ConfirmDialog
                  title="Delete subscriber"
                  content="Are you sure you want to delete this subscriber?"
                  tooltipContent="delete subscriber"
                  onConfirm={async () => {
                    await api.subscriber.delete.mutate({
                      id: item.id,
                    })
                    await refetch()
                  }}
                />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </>
  )
}
