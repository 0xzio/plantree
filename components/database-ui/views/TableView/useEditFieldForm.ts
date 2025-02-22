'use client'

import { SubmitHandler, useForm } from 'react-hook-form'
import { Option } from '@/lib/types'
import { Field } from '@prisma/client'
import { useDatabaseContext } from '../../DatabaseProvider'

export type EditFieldValues = {
  displayName: string
  name: string
  fieldType: any
  options: Option[]
}

export function useEditFieldForm(field: Field) {
  const ctx = useDatabaseContext()
  const columnOptions = (field.options as any as Option[]) || []

  const form = useForm<EditFieldValues>({
    defaultValues: {
      displayName: field.displayName || '',
      name: field.name,
      fieldType: field.fieldType,
      options: columnOptions.map((o) => ({
        id: o.id,
        name: o.name,
        color: o.color,
      })),
    },
  })

  const onSubmit: SubmitHandler<EditFieldValues> = async (data) => {
    console.log('data', data)
    await ctx.updateField(field.id, data)
  }

  return { ...form, onSubmit: form.handleSubmit(onSubmit) }
}
