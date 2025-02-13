import { PricingCard } from './PricingCard'
import { PricingSlogan } from './PricingSlogan'

// export const runtime = 'edge'

export const dynamic = 'force-static'

export default function HomePage() {
  return (
    <div className="flex flex-col justify-center pt-20 gap-8">
      <PricingSlogan />
      <PricingCard />
    </div>
  )
}
