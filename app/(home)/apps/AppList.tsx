'use client'

import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { useApps } from '@/hooks/useApps'
import { precision } from '@/lib/math'
import { useAppDialog } from './AppDialog/useAppDialog'

export function AppList() {
  const { apps, isLoading } = useApps()
  const { setState } = useAppDialog()
  if (isLoading) return <div>Loading...</div>
  return (
    <div className="bg-white rounded-lg p-6 shadow grid gap-2">
      {apps.map((app) => (
        <div key={app.id} className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="text-neutral-400 w-7">#{app.id}</div>
            <div className="font-semibold">{app.uri}</div>
            <Badge variant="outline">
              {precision.toDecimal(app.feePercent) * 100} % Fee
            </Badge>
            <div>{/* <a href={app.website}>Website</a> */}</div>
          </div>
          <Button
            variant="outline"
            className=""
            onClick={() => {
              setState({ isOpen: true, app })
            }}
          >
            Update
          </Button>
        </div>
      ))}
    </div>
  )
}
