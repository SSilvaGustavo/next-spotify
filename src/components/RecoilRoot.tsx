"use client"
import { RecoilRoot as Recoil } from 'recoil' 
import { ReactNode } from 'react'

interface RecoilProps {
  children: ReactNode,
}

export function RecoilProvider({ children }: RecoilProps) {
  return (
    <Recoil>
      {children}
    </Recoil>
  )
}
