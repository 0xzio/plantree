import { MarketplaceList } from './MarketplaceList'
import { MarketplaceSlogan } from './MarketplaceSlogan'

export function Marketplace() {
  return (
    <div className="flex flex-col justify-center pt-20 gap-8 pb-20">
      <MarketplaceSlogan />
      <MarketplaceList />
    </div>
  )
}
