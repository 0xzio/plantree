'use client'

import { useState } from 'react'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Plus } from 'lucide-react'
import { Button } from '../ui/button'

export function AddPropButton() {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          size="sm"
          variant="ghost"
          className="flex items-center gap-1 rounded text-foreground/40 text-sm"
        >
          <Plus size={16} />
          <span>Add a property</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuLabel>Type</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem>Text</DropdownMenuItem>
        <DropdownMenuItem>Number</DropdownMenuItem>
        <DropdownMenuItem>Select</DropdownMenuItem>
        <DropdownMenuItem>Multi-select</DropdownMenuItem>
        <DropdownMenuItem>URL</DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
