'use client'

import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { ChevronLeft } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { CreateRewardRequestForm } from './CreateRewardForm'

export const dynamic = 'force-static'

export default function Page() {
  const { push } = useRouter()
  return (
    <div className="">
      <div className="container p-4">
        <div className="w-[550px] mx-auto">
          <div className="flex items-center gap-2 mb-10">
            <Button
              size="icon"
              variant="ghost"
              className="rounded-full shadow bg-white"
              onClick={() => {
                push('/rewards')
              }}
            >
              <ChevronLeft></ChevronLeft>
            </Button>
            <div className="font-semibold">Create Reward Request</div>
          </div>
          <Card className="w-[550px] flex-col flex justify-center p-5 shadow border-none">
            <CreateRewardRequestForm />
          </Card>
        </div>
      </div>
    </div>
  )
}
