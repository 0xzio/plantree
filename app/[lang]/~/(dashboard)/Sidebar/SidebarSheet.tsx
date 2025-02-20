import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet'
import { Post } from '@/lib/theme.types'
import { Sidebar } from './Sidebar'
import { useSidebarSheet } from './useSidebarSheet'

interface Props {}

export function SidebarSheet({}: Props) {
  const { isOpen, setIsOpen } = useSidebarSheet()
  return (
    <>
      <Sheet open={isOpen} onOpenChange={(v) => setIsOpen(v)}>
        <SheetContent
          side="left"
          className="flex flex-col gap-6 overflow-y-auto p-0"
        >
          <Sidebar bordered={false} />
        </SheetContent>
      </Sheet>
    </>
  )
}
