'use client'

import { NumberInput } from '../NumberInput'
import { InkBalance } from './InkBalance'

interface Props {
  value: string
}

export const TokenOut = ({ value }: Props) => {
  return (
    <div className="mb-2 bg-white rounded-2xl p-4 shadow h-[114px]">
      <div className="text-sm">Receive</div>
      <div className="flex items-center gap-1">
        <NumberInput
          type="text"
          value={value}
          disabled
          placeholder="0.0"
          className="p-2 h-10 font-bold text-3xl pl-0 bg-white rounded w-full border-none focus:border-none outline-none disabled:opacity-100"
        />

        <span className="i-[fluent-emoji--deciduous-tree] w-6 h-6"></span>
        <span className="text-lg font-semibold">TREE</span>
      </div>
      <div className="flex justify-end">
        <InkBalance />
      </div>
    </div>
  )
}
