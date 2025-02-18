'use client'

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { useCatalogue } from '../hooks/useCatalogue'
import { CategoryNodeForm } from './CategoryNodeForm'
import { useCategoryNodeDialog } from './useCategoryNodeDialog'

interface Props {}

export function CategoryNodeDialog({}: Props) {
  const { isOpen, setIsOpen } = useCategoryNodeDialog()
  const { addNode } = useCatalogue()

  return (
    <Dialog open={isOpen} onOpenChange={(v) => setIsOpen(v)}>
      <DialogContent className="sm:max-w-[425px] grid gap-4">
        <DialogHeader>
          <DialogTitle className="">Add a category</DialogTitle>
          <DialogDescription className="hidden"></DialogDescription>
        </DialogHeader>
        <CategoryNodeForm />
      </DialogContent>
    </Dialog>
  )
}
