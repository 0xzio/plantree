import { Button } from '@/components/ui/button'
import { Check } from 'lucide-react'

export function PricingCard() {
  return (
    <div className=" mx-auto space-y-8 bg-background rounded-2xl px-10 py-8 md:w-[500px] shadow">
      <div className="flex flex-col items-center justify-center gap-2">
        <div className="text-xl">Pro</div>
        <div className="flex items-center gap-1">
          <span className="text-4xl font-bold">200 $PEN</span>
          <span className="text-xl text-foreground/60 -mb-2"> / month</span>
        </div>
      </div>
      <div className="space-y-3">
        <BenefitItem text="Cloud Sync" />
        <BenefitItem text="Web App & Desktop App & Mobile App" />
        <BenefitItem text="Unlimited number of posts, pages, databases" />
        <BenefitItem text="One-to-One support in discord" />
      </div>
      <div className="text-center mt-4">
        <Button size="lg" className="rounded-full px-8 h-12 font-bold">
          Become a member
        </Button>
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
