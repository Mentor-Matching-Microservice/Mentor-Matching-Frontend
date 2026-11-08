import { Link } from 'react-router'

import { path } from '@/config/path'
import { cn } from '@/utils/cn'

type BrandLogoProps = {
  className?: string
  markClassName?: string
  textClassName?: string
}

export function BrandLogo({ className, markClassName, textClassName }: BrandLogoProps) {
  return (
    <Link className={cn('group flex items-center gap-2.5', className)} to={path.home}>
      <span
        className={cn(
          'flex h-9 w-9 shrink-0 items-center justify-center overflow-hidden rounded-xl bg-white shadow-sm ring-1 ring-blue-100 transition group-hover:shadow-md',
          markClassName
        )}
      >
        <svg
          aria-hidden='true'
          className='h-full w-full'
          viewBox='0 0 200 200'
          xmlns='http://www.w3.org/2000/svg'
        >
          <defs>
            <linearGradient id='brandGradient' x1='0%' x2='100%' y1='0%' y2='100%'>
              <stop offset='0%' stopColor='#2563eb' stopOpacity='1' />
              <stop offset='100%' stopColor='#1e40af' stopOpacity='1' />
            </linearGradient>
          </defs>
          <rect width='200' height='200' rx='40' fill='#ffffff' />
          <path
            d='M50 140V75L100 50L150 75V140'
            fill='none'
            stroke='url(#brandGradient)'
            strokeLinecap='round'
            strokeLinejoin='round'
            strokeWidth='12'
          />
          <path
            d='M50 100L100 125L150 100'
            fill='none'
            stroke='url(#brandGradient)'
            strokeLinecap='round'
            strokeLinejoin='round'
            strokeWidth='12'
          />
          <circle cx='100' cy='125' r='10' fill='url(#brandGradient)' />
          <path d='M150 75V95' stroke='url(#brandGradient)' strokeLinecap='round' strokeWidth='6' />
        </svg>
      </span>
      <span
        className={cn(
          'text-ink group-hover:text-primary text-xl font-bold tracking-tight transition-colors',
          textClassName
        )}
      >
        Mentor Matching
      </span>
    </Link>
  )
}
