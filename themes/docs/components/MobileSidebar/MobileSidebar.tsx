'use client'

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
import { Site } from '@/lib/theme.types'
import { Menu } from 'lucide-react'
import { Sidebar } from '../Sidebar'
import { useMobileSidebar } from './useMobileSidebar'

interface Props {
  site: Site
}

export function MobileSidebar({ site }: Props) {
  const { isOpen, setIsOpen } = useMobileSidebar()
  return (
    <>
      <Sheet open={isOpen} onOpenChange={(v) => setIsOpen(v)}>
        <SheetTrigger className="block md:hidden">
          <Menu />
        </SheetTrigger>
        <SheetDescription className="hidden"></SheetDescription>
        <SheetContent
          side="left"
          className="flex flex-col gap-6 overflow-y-auto"
        >
          <SheetHeader>
            <SheetTitle></SheetTitle>
          </SheetHeader>
          <Sidebar site={site} />
        </SheetContent>
      </Sheet>
    </>
  )
}
