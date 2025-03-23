import { SeriesDialog } from './SeriesDialog/SeriesDialog'
import { SeriesHeader } from './SeriesHeader'

export const dynamic = 'force-static'

export default function Page() {
  return (
    <div className="space-y-3 p-4">
      <SeriesHeader />
      <SeriesDialog />
    </div>
  )
}
