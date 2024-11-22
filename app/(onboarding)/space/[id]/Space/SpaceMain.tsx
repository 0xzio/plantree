import { Space } from '@/domains/Space'

interface Props {
  space: Space
}

export function SpaceMain({ space }: Props) {
  return (
    <div className="flex-1 min-h-[100vh] mt-10 pr-8 pb-40">
      <div className="text-4xl font-semibold mb-14">{space.name}</div>
    </div>
  )
}
