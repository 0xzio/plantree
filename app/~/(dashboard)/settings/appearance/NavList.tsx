'use client'

import { DeleteConfirmDialog } from '@/components/DeleteConfirmDialog'
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
import { defaultNavLinks } from '@/lib/constants'
import { NavLink } from '@/lib/theme.types'
import { api } from '@/lib/trpc'
import { Site } from '@prisma/client'
import { format } from 'date-fns'
import { Trash2 } from 'lucide-react'

interface Props {
  site: Site
}

export function NavList({ site }: Props) {
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

  const navLinks = (site.navLinks || defaultNavLinks) as NavLink[]

  console.log('=======navLinks:', navLinks)

  return (
    <>
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
                <DeleteConfirmDialog
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
