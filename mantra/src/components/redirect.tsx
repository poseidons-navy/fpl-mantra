"use client"
import { Cog } from 'lucide-react'
import { useRouter } from 'next/navigation'
import React, { useEffect, useState } from 'react'

interface Props {
    link: string
}

function Redirect(props: Props) {
    const { link } = props
    const { push } = useRouter()

    useEffect(()=> {
        push(link)
    }, [])
  return (
    <div className="flex flex-col w-full items-center justify-center h-full">
        <div className="flex flex-row items-center gap-x-4">
            <Cog className='animate-spin' /> <span>Redirecting...</span>
        </div>
    </div>
  )
}

export default Redirect