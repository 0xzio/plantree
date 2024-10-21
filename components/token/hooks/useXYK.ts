import { useEffect } from 'react'
import { treeTokenAbi } from '@/lib/abi'
import { addressMap } from '@/lib/address'
import { atom, useAtom } from 'jotai'
import { useReadContracts } from 'wagmi'

const xykAtom = atom({
  x: BigInt(0),
  y: BigInt(0),
  k: BigInt(0),
})

export function useXYK() {
  const [state, setState] = useAtom(xykAtom)
  return {
    ...state,
    setState,
  }
}

export function useQueryXYK() {
  const { setState } = useXYK()
  const { data, ...rest } = useReadContracts({
    contracts: [
      {
        address: addressMap.TreeToken,
        abi: treeTokenAbi,
        functionName: 'x',
      },
      {
        address: addressMap.TreeToken,
        abi: treeTokenAbi,
        functionName: 'y',
      },
      {
        address: addressMap.TreeToken,
        abi: treeTokenAbi,
        functionName: 'k',
      },
    ],
  })

  useEffect(() => {
    if (!data) return
    const [{ result: x }, { result: y }, { result: k }] = data
    setState({ x: x!, y: y!, k: k! })
  }, [data, setState])

  return { data, ...rest }
}
