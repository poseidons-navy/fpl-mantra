"use client"

import { SessionProvider } from "next-auth/react"
import { ReactNode } from "react"


interface Props {
    children: ReactNode
}

export default function AuthProvider(props: Props){
    const { children } = props
    return (
        <SessionProvider>
            {children}
        </SessionProvider>
    )
}