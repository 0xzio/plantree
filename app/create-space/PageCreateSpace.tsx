'use client'

import { CreateSpaceForm } from '@/components/CreateSpaceDialog/CreateSpaceForm'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { ChevronLeft } from 'lucide-react'
import { useRouter } from 'next/navigation'

export function PageCreateSpace() {
  const { push } = useRouter()
  return (
    <div className="">
      <div className="container p-4">
        <div className="w-[460px] mx-auto">
          <div className="flex items-center gap-2 mb-10">
            <Button
              size="icon"
              variant="ghost"
              className="rounded-full shadow bg-white"
              onClick={() => {
                push('/')
              }}
            >
              <ChevronLeft></ChevronLeft>
            </Button>
            <div className="font-semibold">Create site</div>
          </div>
          <Card className="w-[500px] flex-col flex justify-center p-5 shadow border-none">
            <CreateSpaceForm />
          </Card>
        </div>
      </div>
    </div>
  )
}
