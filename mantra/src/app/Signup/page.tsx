"use client"
import BackButton from '@/components/back-button'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { useToast } from '@/components/ui/use-toast'
import { Button } from '@/components/ui/button'
import React, { useState } from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'

const formSchema = z.object({
    username: z.string(),
    password: z.string()
})

type Schema = z.infer<typeof formSchema>

function LoginPage() {
    const [loading, setLoading] = useState(false)
    const { toast } = useToast()
    const form = useForm<Schema>({
        resolver: zodResolver(formSchema)
    })

    
    const onSubmit = async (data: Schema) => {
        setLoading(true)
        setLoading(false)
    }

    return (
        <div className="flex flex-col items-center justify-center">
            <div className="flex flex-row items-center justify-start w-full">
                <BackButton />
            </div>
            <div className="flex flex-col w-3/5 h-full items-center justify-center px-5">
                <h3 className='text-xl font-semibold'>
                    Login
                </h3>
                <Form {...form} onSubmit={form.handleSubmit(onSubmit)}>
                    <form className='w-full h-full space-y-4'>
                        {/* Username */}
                        <FormField
                            control={form.control}
                            name='username'
                            render={({}) => {
                                return (
                                    <FormItem>
                                        <FormLabel>
                                            Username
                                        </FormLabel>
                                        <FormControl>
                                            <Input placeholder='Username' type="text" />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )
                            }}
                        />

                        {/* Password */}
                        <FormField
                            control={form.control}
                            name='password'
                            render={({}) => {
                                return (
                                    <FormItem>
                                        <FormLabel>
                                            Password
                                        </FormLabel>
                                        <FormControl>
                                            <Input placeholder='Password' type="password" />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )
                            }}
                        />

                        <FormControl>
                            <Button isLoading={loading} type="submit">
                                Login
                            </Button>
                        </FormControl>
                    </form>
                </Form>
            </div>
        </div>
    )
}

export default LoginPage
