'use client'

import { trpc } from '@/lib/trpc'
import { CreateButton } from './CreateButton'
import { RewardHistory } from './RewardHistory'
import { SummaryDashboard } from './SummaryDashboard'

export function PageRewards() {
  const { isLoading, data, error, refetch } = trpc.rewards.list.useQuery()

  return (
    <div className="flex flex-col justify-center pt-20 gap-8">
      <div className="flex justify-between">
        <h2 className="scroll-m-20 text-3xl font-semibold tracking-tight first:mt-0">
          Your Summary
        </h2>
        <CreateButton />
      </div>

      <SummaryDashboard isLoading={isLoading} rewardRequests={data!} />
      <h2 className="scroll-m-20  text-3xl font-semibold tracking-tight first:mt-0">
        Your History
      </h2>
      <RewardHistory isLoading={isLoading} rewardRequests={data!} />
    </div>
  )
}
