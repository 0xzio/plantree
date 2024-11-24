import { Skeleton } from '@/components/ui/skeleton'
import { RequestStatus, RewardRequest } from '@prisma/client'

interface Props {
  rewardRequests: RewardRequest[] | null
  isLoading: boolean
}

export function SummaryDashboard({ rewardRequests, isLoading }: Props) {
  const totalRequest = rewardRequests?.length || 0
  const completed =
    rewardRequests?.filter(
      (reward: RewardRequest) => reward.status === RequestStatus.COMPLETED,
    ).length || 0
  const pending =
    rewardRequests?.filter(
      (reward: RewardRequest) => reward.status === RequestStatus.PENDING,
    ).length || 0
  const rewardsAmount =
    rewardRequests?.reduce(
      (acc: number, reward: RewardRequest) => acc + (reward.tokenAmount || 0),
      0,
    ) || 0

  const categories = [
    {
      label: 'Total Request',
      icon: 'i-[fluent-emoji--pick]',
      value: totalRequest,
    },
    { label: 'Pending', icon: 'i-[fluent-emoji--alarm-clock]', value: pending },
    {
      label: 'Completed',
      icon: 'i-[fluent-emoji--triangular-flag]',
      value: completed,
    },

    {
      label: 'Rewards',
      icon: 'i-[fluent-emoji--deciduous-tree]',
      value: rewardsAmount,
    },
  ]

  if (isLoading) {
    return (
      <div className="flex w-full border border-inherit rounded-3xl bg-background">
        {categories.map((category, index) => (
          <div
            key={index}
            className={`flex flex-col flex-1 ${
              index < categories.length - 1 ? 'border-r border-inherit' : ''
            } items-center justify-center space-y-2 p-6`}
          >
            <p className="text-base text-muted-foreground">{category.label}</p>
            <Skeleton className="h-12 w-full rounded-full" />
          </div>
        ))}
      </div>
    )
  }

  return (
    <div className="flex w-full border border-inherit rounded-3xl bg-background">
      {categories.map((category, index) => (
        <div
          key={index}
          className={`flex flex-col flex-1 ${
            index < categories.length - 1 ? 'border-r border-inherit' : ''
          } items-center justify-center space-y-2 p-6`}
        >
          <p className="text-base text-muted-foreground">{category.label}</p>
          <div className="flex items-center justify-center space-x-2 h-12">
            <span className={`${category.icon} w-8 h-8`}></span>
            <div className="text-4xl font-semibold">{category.value}</div>
          </div>
        </div>
      ))}
    </div>
  )
}
