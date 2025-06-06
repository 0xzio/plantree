import { Transaction } from '@/components/token/Transaction'
import { Badge } from '@/components/ui/badge'
import { addressMap } from '@/lib/address'
import { Globe } from 'lucide-react'
import { PartnerProgram } from './PartnerProgram'

// export const runtime = 'edge'

export const dynamic = 'force-static'

export default function HomePage() {
  return (
    <div className="flex flex-col justify-center pt-20 gap-8 pb-20  h-full flex-1">
      <PartnerProgram />
    </div>
  )
}
