'use client'

import { Button, ButtonProps } from './ui/button'

interface Props extends ButtonProps {}

export const CustomDomainButton = (props: Props) => {
  return (
    <Button
      onClick={() => {
        //
      }}
      {...props}
    >
      Custom domain
    </Button>
  )
}
