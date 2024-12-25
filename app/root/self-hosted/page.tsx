import { PropsWithChildren, ReactNode } from 'react'
import { Button } from '@/components/ui/button'
import { addressMap } from '@/lib/address'
import { cn } from '@/lib/utils'
import Link from 'next/link'

export const dynamic = 'force-static'

export default function Page() {
  return (
    <div className="mt-20 space-y-20 pb-20">
      <div>Hosted</div>
      <div>post..</div>
    </div>
  )
}
