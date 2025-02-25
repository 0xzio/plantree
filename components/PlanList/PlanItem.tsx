import { Check } from 'lucide-react'
import { BecomeMemberButton } from './BecomeMemberButton'

interface Props {
  name: string
  type: 'FREE' | 'CREATOR' | 'TEAM'
  price: number
  collaboratorCount?: number
  benefits: string[]
}

export function PlanItem({
  name,
  type,
  price,
  benefits,
  collaboratorCount,
}: Props) {
  return (
    <div className="space-y-8 bg-background rounded-2xl px-10 py-8 shadow dark:border w-full flex flex-col">
      <div className="flex flex-col items-center justify-center gap-8">
        <div className="text-xl">{name}</div>
        <div className="flex items-center gap-1">
          <div className="text-2xl font-bold">${price}</div>
          <div className=""> / mo</div>
        </div>
      </div>
      <div className="space-y-3 flex-1">
        {benefits.map((benefit, index) => (
          <BenefitItem key={benefit} text={benefit} />
        ))}
      </div>
      <div className="text-center">
        <BecomeMemberButton type={type} />
      </div>
    </div>
  )
}

function BenefitItem({ text }: { text: string }) {
  return (
    <div className="flex items-center gap-3 flex-shrink-0">
      <Check className="text-green-500" size={16} />
      <div className="text-foreground/70">{text}</div>
    </div>
  )
}
