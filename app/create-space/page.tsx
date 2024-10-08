'use client'

import { CreateSpaceForm } from '@/components/CreateSpaceDialog/CreateSpaceForm'
import { Button } from '@/components/ui/button'
import { ChevronLeft } from 'lucide-react'
import { useRouter } from 'next/navigation'

export default function Page() {
  const { push } = useRouter()
  return (
    <div className="">
      <div className="container p-4">
        <div className="w-[460px] mx-auto">
          <div className="flex items-center gap-2 mb-10">
            <Button
              size="icon"
              variant="secondary"
              className="rounded-full"
              onClick={() => {
                push('/')
              }}
            >
              <ChevronLeft></ChevronLeft>
            </Button>
            <div className="font-semibold">Create Space</div>
          </div>
          <div className="w-[500px] flex-col flex justify-center">
            <CreateSpaceForm />
          </div>
        </div>
      </div>
    </div>
  )
}
