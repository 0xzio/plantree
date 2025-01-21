import { ReactNode } from 'react'
import { AddSubscriberButton } from './AddSubscriberButton'

export default function Layout({ children }: { children: ReactNode }) {
  return (
    <div className="flex flex-col gap-8 p-3 md:p-0">
      <div className="flex items-center justify-between">
        <div className="text-3xl font-bold">Subscribers</div>
        <AddSubscriberButton />
      </div>

      {children}
    </div>
  )
}
