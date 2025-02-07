'use client'

import { DeleteConfirmDialog } from '@/components/DeleteConfirmDialog'
import { Skeleton } from '@/components/ui/skeleton'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { useSiteTags } from '@/hooks/useSiteTags'
import { useSubscribers } from '@/hooks/useSubscribers'
import { api } from '@/lib/trpc'
import { Site } from '@prisma/client'
import { format } from 'date-fns'
import { toast } from 'sonner'

interface Props {
  site: Site
}

export function TagList({ site }: Props) {
  const { data = [], isLoading, refetch } = useSiteTags()

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
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Created date</TableHead>
            <TableHead>Operation</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.map((item, index) => (
            <TableRow key={index}>
              <TableCell>{item.name}</TableCell>
              <TableCell>{format(item.createdAt, 'yyyy/MM/dd')}</TableCell>
              <TableCell>
                <DeleteConfirmDialog
                  title={`Delete tag: ${item.name}`}
                  content="All tags in post will be deleted, are you sure you want to delete this tag?"
                  tooltipContent="Delete tag"
                  onConfirm={async () => {
                    await api.tag.deleteTag.mutate({
                      tagId: item.id,
                    })
                    await refetch()
                    toast.success('Tag deleted successfully!')
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
