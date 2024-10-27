import { ReactNode } from 'react'

export const dynamic = 'force-static'
export const revalidate = 3600 * 24 * 365

export default function Layout({ children }: { children: ReactNode }) {
  return (
    <div>
      <div className="flex lg:flex-row flex-col-reverse w-full sm:w-full mx-auto gap-12 mt-10 p-3 lg:p-0">
        <div className="flex flex-col gap-6 md:flex-1 rounded-2xl w-full md:w-auto">
          {children}
        </div>
      </div>
    </div>
  )
}
