import { PlanType } from '@prisma/client'
import { BillingCycleSelect } from './BillingCycleSelect'
import { PlanItem } from './PlanItem'
import { PricingSlogan } from './PricingSlogan'

export function PlanList() {
  return (
    <div className="flex flex-col items-center gap-8 pb-20">
      <PricingSlogan />

      <BillingCycleSelect />

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 justify-center border-l border-b border-foreground/10">
        <PlanItem
          monthlyPrice={0}
          annualPrice={0}
          name="Free"
          type={PlanType.FREE}
          collaboratorCount={1}
          benefits={['1 creators', '5 free official themes', 'Custom domain']}
        />
        <PlanItem
          monthlyPrice={10.24}
          annualPrice={92.16}
          name="Basic"
          type={PlanType.BASIC}
          collaboratorCount={3}
          benefits={[
            '2 co-creators',
            'Unlimited themes',
            'Custom domain',
            'Sending newsletters',
            'Podcast',
            'AI assistance',
          ]}
        />
        <PlanItem
          monthlyPrice={25.6}
          annualPrice={230.4}
          name="Pro"
          type={PlanType.PRO}
          collaboratorCount={3}
          benefits={[
            '5 co-creators',
            'Unlimited themes',
            'Custom domain',
            'Sending newsletters',
            'AI assistance',
            'Podcast',
            'One-to-one custom theme',
            'One-to-One support in discord',
          ]}
        />
        <PlanItem
          monthlyPrice={20}
          annualPrice={180}
          name="Believer"
          type={PlanType.BELIEVER}
          collaboratorCount={3}
          isBeliever
          benefits={[
            'everything in Pro Plan',
            'Priority support',
            'Early access for new features',
          ]}
        />
      </div>
    </div>
  )
}
