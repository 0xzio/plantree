'use client'

import { ReactNode } from 'react'
import { DashboardLayout } from '@/components/DashboardLayout/DashboardLayout'

export const dynamic = 'force-static'
export const revalidate = 3600 * 24

export default function Layout({ children }: { children: ReactNode }) {
  return <DashboardLayout>{children}</DashboardLayout>
}
