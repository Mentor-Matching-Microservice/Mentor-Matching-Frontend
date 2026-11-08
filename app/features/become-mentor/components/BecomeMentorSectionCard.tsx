import type { ReactNode } from 'react'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

type BecomeMentorSectionCardProps = {
  id: string
  title: string
  description?: string
  eyebrow?: string
  children: ReactNode
}

export function BecomeMentorSectionCard({
  children,
  description,
  eyebrow,
  id,
  title
}: BecomeMentorSectionCardProps) {
  return (
    <Card
      className='rounded-[28px] border-slate-200/90 shadow-[0_20px_60px_-40px_rgba(15,23,42,0.35)]'
      id={id}
    >
      <CardHeader className='gap-3 border-b border-slate-100 pb-5'>
        {eyebrow ? (
          <p className='text-primary text-[11px] font-semibold tracking-[0.18em] uppercase'>
            {eyebrow}
          </p>
        ) : null}
        <div className='space-y-1'>
          <CardTitle className='text-xl'>{title}</CardTitle>
          {description ? <CardDescription>{description}</CardDescription> : null}
        </div>
      </CardHeader>
      <CardContent className='p-6'>{children}</CardContent>
    </Card>
  )
}
