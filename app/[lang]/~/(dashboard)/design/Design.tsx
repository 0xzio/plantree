'use client'

import { LoadingDots } from '@/components/icons/loading-dots'
import { CommonSettingForm } from './forms/CommonSettingForm'
import { HomeSettingForm } from './forms/HomeSettingForm'
import { useLoading } from './hooks/useLoading'

export function Design() {
  const { isLoading } = useLoading()
  return (
    <div className="flex-1 space-y-3">
      {isLoading && (
        <div>
          <LoadingDots className="bg-foreground" />
        </div>
      )}
      {!isLoading && (
        <>
          {/* <CommonSettingForm /> */}
          <HomeSettingForm />
        </>
      )}
    </div>
  )
}
