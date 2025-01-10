'use client'

import { api } from '@/lib/trpc'
import { RouterOutputs } from '@/server/_app'
import { useQuery } from '@tanstack/react-query'

export type Database = RouterOutputs['database']['byId']

export function useQueryDatabase(databaseId: string) {
  return useQuery({
    queryKey: ['database', databaseId],
    queryFn: async () => {
      return await api.database.byId.query(databaseId)
    },
    enabled: !!databaseId,
  })
}