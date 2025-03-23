import { ReactNode } from 'react'
import { AddSubscriberButton } from './AddSubscriberButton'

export default function Layout({ children }: { children: ReactNode }) {
  return (
    <div className="flex flex-col gap-8 px-4  md:max-w-5xl mx-auto mt-16">
      <div className="flex flex-col gap-2">
        <div className="text-3xl font-bold">Design theme</div>
        <div className="text-foreground/50">
          Configuring and designing themes
        </div>
      </div>
      {children}
    </div>
  )
}
