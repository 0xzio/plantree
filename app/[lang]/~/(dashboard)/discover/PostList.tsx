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
import { trpc } from '@/lib/trpc'
import { format } from 'date-fns'

export function PostList() {
  const { data = [], isLoading } = trpc.post.listAllPosts.useQuery()

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
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Index</TableHead>
          <TableHead>Title</TableHead>
          <TableHead>Links</TableHead>
          {/* <TableHead>siteId</TableHead> */}
          <TableHead>Created</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {data.map((post, index) => (
          <TableRow key={index} className="hover:bg-none">
            <TableCell>{index + 1}</TableCell>
            <TableCell>{post.title}</TableCell>
            <TableCell className="flex flex-col gap-1">
              {post.site.domains.map((item) => {
                let host = `${item.domain}.penx.io`
                if (!item.isSubdomain) {
                  host = item.domain
                }
                const link = `https://${host}/posts/${post.slug}`
                return (
                  <a
                    href={link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-brand"
                  >
                    {link}
                  </a>
                )
              })}
            </TableCell>
            {/* <TableCell>{post.siteId}</TableCell> */}
            <TableCell className="flex-1">
              {format(post.createdAt, 'yy-MM-dd')}
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )
}
