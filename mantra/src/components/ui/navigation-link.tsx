"use client"
import { cn } from '@/lib/utils'
import { LucideIcon } from 'lucide-react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import React from 'react'

interface Props {
    title: string,
    link: string,
    icon: LucideIcon,
    className?: string
}

function NavigationLink(props: Props) {
    const {title, link, icon: Icon, className} = props
    const pathname = usePathname() 
    const active = link == pathname

  return (
    <Link
      href={link}
      className={cn(
        'flex aspect-square h-12 shrink-0 flex-row items-center justify-center gap-3 rounded-xl bg-black text-lg text-white hover:bg-neutral-300 md:m-0 md:aspect-auto md:h-12 md:w-full md:justify-start md:px-6',
        active && 'hover:bg-neutral-200 bg-gradient-to-r from-slate-950 to-slate-400 ',
        className
      )}
    >
      <Icon className='h-5 w-5 shrink-0' />
      <div className='hidden md:block'>{title}</div>
    </Link>
  )
}

export default NavigationLink