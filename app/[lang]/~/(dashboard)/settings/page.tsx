'use client'

import { DeleteSiteCard } from './DeleteSiteCard'
import { DeleteSiteDialog } from './DeleteSiteDialog/DeleteSiteDialog'
import { GeneralSettingForm } from './GeneralSettingForm'

export const dynamic = 'force-static'

export default function Page() {
  return (
    <div className="space-y-6">
      <GeneralSettingForm />
      <DeleteSiteDialog />
      <DeleteSiteCard />
    </div>
  )
}
