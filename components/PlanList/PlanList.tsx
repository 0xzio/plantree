import { PlanType } from '@prisma/client'
import { BillingCycleSelect } from './BillingCycleSelect'
import { PlanItem } from './PlanItem'
import { PricingSlogan } from './PricingSlogan'

export function PlanList() {
  return (
    <div className="flex flex-col items-center gap-8 pb-20">
      <PricingSlogan />

      <BillingCycleSelect />

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 justify-center border-l border-b border-foreground/10">
        <PlanItem
          monthlyPrice={0}
          annualPrice={0}
          name="Free"
          type={PlanType.FREE}
          collaboratorCount={1}
          benefits={['1 creators', '5 free official themes', 'Custom domain']}
        />
        <PlanItem
          monthlyPrice={10}
          annualPrice={90}
          name="Pro"
          type={PlanType.PRO}
          collaboratorCount={3}
          benefits={[
            '3 co-creators',
            'Unlimited custom themes',
            'Custom domain',
            'Sending newsletters',
            'AI assistance',
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
            '3 co-creators',
            'Unlimited custom themes',
            'Custom domain',
            'Sending newsletters',
            'AI assistance',
            'One-to-One support in discord',
            'Priority support',
          ]}
        />
      </div>
    </div>
  )
}
