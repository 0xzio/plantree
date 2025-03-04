import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { useSite } from '@/hooks/useSite'
import { trpc } from '@/lib/trpc'
import { Payment } from './Payment'

export const dynamic = 'force-static'

export default function Page() {
  return <Payment />
}
