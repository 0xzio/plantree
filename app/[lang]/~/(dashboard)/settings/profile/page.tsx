'use client'

import { ProfileSettingForm } from './ProfileSettingForm'

export const dynamic = 'force-static'

export default function Page() {
  return (
    <div className="space-y-6">
      <ProfileSettingForm />
    </div>
  )
}
