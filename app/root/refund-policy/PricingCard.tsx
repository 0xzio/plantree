import { Check } from 'lucide-react'
import { BecomeMemberButton } from './BecomeMemberButton'
import { SubscriptionPrice } from './SubscriptionPrice'

export function PricingCard() {
  return (
    <div className=" mx-auto space-y-8 bg-background rounded-2xl px-10 py-8 md:w-[500px] shadow dark:border">
      <div className="flex flex-col items-center justify-center gap-2">
        <div className="text-xl">Pro</div>
        <SubscriptionPrice />
      </div>
      <div className="space-y-3">
        <BenefitItem text="Cloud Sync" />
        <BenefitItem text="Web App & Desktop App & Mobile App" />
        <BenefitItem text="Unlimited number of posts, pages, databases" />
        <BenefitItem text="One-to-One support in discord" />
      </div>
      <div className="text-center mt-4">
        <BecomeMemberButton />
      </div>
    </div>
  )
}

function BenefitItem({ text }: { text: string }) {
  return (
    <div className="flex items-center gap-3">
      <Check className="text-green-500" />
      <div className="text-foreground/70">{text}</div>
    </div>
  )
}
