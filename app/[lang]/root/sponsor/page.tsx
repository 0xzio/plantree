import { Transaction } from '@/components/token/Transaction'
import { Badge } from '@/components/ui/badge'
import { addressMap } from '@/lib/address'
import { Globe } from 'lucide-react'
import { SponsorSlogan } from './SponsorSlogan'

// export const runtime = 'edge'

export const dynamic = 'force-static'

export default function HomePage() {
  return (
    <div className="flex flex-col justify-center pt-20 gap-8">
      <SponsorSlogan />
      <div className="text-center">
        <Badge variant="outline" className="text-center inline-flex gap-1">
          <div>Token contract: {addressMap.PenToken}</div>
          <a
            href={`https://basescan.org/address/${addressMap.PenToken}`}
            target="_blank"
          >
            <Globe size={14} className="cursor-pointer" />
          </a>
        </Badge>
      </div>
      <div className="grid gap-4 mx-auto sm:w-full mt-10 rounded-lg">
        <div className="md:w-[460px] sm:w-full mx-auto">
          <Transaction />
        </div>
      </div>
    </div>
  )
}
