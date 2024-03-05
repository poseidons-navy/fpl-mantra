"use client"
import clsx from 'clsx'
import Lucide, { BookUser, Copy, CopyCheck, Eye, EyeOff, KeyRound, ShieldCheck } from 'lucide-react'
import React, { useState } from 'react'

interface Props {
    text: string
    title: string
    icon: keyof typeof Lucide
    defaultView?: boolean 
    className?: string
}

function CopyText(props: Props ) {
    const { text, title, icon, defaultView = false, className } = props 
    const Icon = icon == "ShieldCheck" ? ShieldCheck :  icon == "KeyRound" ? KeyRound : icon == "BookUser" ? BookUser : null
    const [copied, setCopied] = useState(false)
    const [view, setView] = useState(defaultView ?? false)

    const handleCopy = async () => {
        setCopied(false)
        await navigator.clipboard.writeText(text??"")
        setCopied(true)
        setTimeout(()=>{
            setCopied(false)
        }, 2000)
    }

    const toggleView = () =>{
        setView(t => !t)
    }


  return (
    <div className={clsx("flex flex-row items-center justify-between", className)}>
        <div className="flex flex-row items-center gap-x-5  w-4/5">
            {/* @ts-ignore */}
            <Icon/>
            <span className="font-semibold text-lg w-1/3">
                {title}
            </span>
            <div className="flex flex-row items-center justify-between w-max gap-x-2 ">
                <input
                    className='border-0 background-none outline-none w-fit px-5'
                    type={view ? 'text' : 'password'}
                    value={text}
                    readOnly
                />
                {
                    view ? <EyeOff onClick={toggleView} className='cursor-pointer' /> : <Eye onClick={toggleView} className='cursor-pointer' />
                }
            </div>
        </div>
        {!copied ? <Copy
            className='hover:opacity-80 cursor-pointer'
            onClick={handleCopy}

        /> : 
            <CopyCheck
                className='text-green-500'
            />
        }
    </div>
  )
}

export default CopyText