import type { ReactNode } from 'react'
import { ArrowLeft } from 'lucide-react'
import { Link } from 'react-router'

import { Card, CardContent } from '@/components/ui/card'
import { path } from '@/config/path'

type MentorProfilePageShellProps = {
  children: ReactNode
}

export function MentorProfilePageShell({ children }: MentorProfilePageShellProps) {
  return (
    <div className='py-2'>
      <Link
        className='text-muted hover:text-primary group mb-4 inline-flex items-center gap-2 text-sm font-semibold'
        to={path.discover}
      >
        <ArrowLeft size={16} className='transition group-hover:-translate-x-1' />
        Quay lại tìm mentor
      </Link>
      {children}
    </div>
  )
}

type MentorProfileContentSectionProps = {
  children: ReactNode
  id: string
  subtitle?: string
  title: string
}

export function MentorProfileContentSection({
  children,
  id,
  subtitle,
  title
}: MentorProfileContentSectionProps) {
  return (
    <Card id={id} className='scroll-mt-24 rounded-2xl border-slate-200 bg-white shadow-sm'>
      <CardContent className='p-5 md:p-6'>
        <h2 className='text-ink text-xl font-bold'>{title}</h2>
        {subtitle ? <p className='text-muted mt-1 text-sm'>{subtitle}</p> : null}
        <div className='mt-4'>{children}</div>
      </CardContent>
    </Card>
  )
}

type MentorProfileInlineEmptyProps = {
  text: string
}

export function MentorProfileInlineEmpty({ text }: MentorProfileInlineEmptyProps) {
  return <p className='text-muted rounded-xl bg-slate-50 p-4 text-sm'>{text}</p>
}

export function MentorProfileSkeleton() {
  return (
    <div className='animate-pulse space-y-5'>
      <div className='h-44 rounded-2xl bg-slate-100' />
      <div className='grid gap-5 lg:grid-cols-[minmax(0,1fr)_340px]'>
        <div className='space-y-5'>
          {Array.from({ length: 4 }).map((_, index) => (
            <div key={index} className='h-52 rounded-2xl bg-slate-100' />
          ))}
        </div>
        <div className='h-[560px] rounded-2xl bg-slate-100' />
      </div>
    </div>
  )
}
