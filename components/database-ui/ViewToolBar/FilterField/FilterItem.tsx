'use client'

import { ChangeEvent } from 'react'
import { Input } from '@/components/ui/input'
import { Filter } from '@/lib/types'
import { Field } from '@prisma/client'
import { FieldSelect } from './FieldSelect'
import { OperatorSelect } from './OperatorSelect'

interface Props {
  filter: Filter
  columns: Field[]
  sortedColumns: Field[]
  deleteFilter: (fieldId: string) => void
  updateFilter: (fieldId: string, newFieldId: string) => void
  onChangeValue: (val: ChangeEvent<HTMLInputElement>, fieldId: string) => void
}

export const FilterItem = ({
  filter,
  deleteFilter,
  updateFilter,
  onChangeValue,
  columns,
  sortedColumns,
}: Props) => {
  return (
    <div className="flex items-center justify-between gap-2">
      <FieldSelect
        filter={filter}
        columns={columns}
        updateFilter={updateFilter}
        sortedColumns={sortedColumns}
      />
      <OperatorSelect filter={filter} updateFilter={updateFilter} />
      <Input
        size="sm"
        flex-1
        value={filter?.value}
        onChange={(e) => onChangeValue(e, filter.fieldId)}
      />
      {/* <CloseButton size={20} onClick={() => deleteFilter(filter.columnId)} /> */}
    </div>
  )
}
