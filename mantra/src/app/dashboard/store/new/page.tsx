"use client"
import BackButton from '@/components/back-button'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input, Textarea } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { useToast } from '@/components/ui/use-toast'
import { Button } from '@/components/ui/button'
import React, { useState } from 'react'
import { useForm } from 'react-hook-form'
import { useSession } from 'next-auth/react'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import * as web3 from "@solana/web3.js";

const formSchema = z.object({
    name: z.string(),
    description: z.string(),
    teams: z.number(),
    price: z.number(),
    
    // tags: z.string()
})

type Schema = z.infer<typeof formSchema>

function CreateLeague() {
    const [loading, setLoading] = useState(false)
    const { toast } = useToast()
    //const session = useSession();
    const [showDialog, setShowDialog] = useState()
    const form = useForm<Schema>({
        resolver: zodResolver(formSchema)
    })
    const onButtonClick = (event: any)=>{
        event.preventDefault();
      
      }

    return (
        <div className="flex flex-col w-full h-full items-center  justify-center ">
            <div className="flex flex-row items-center justify-start w-full">
                <BackButton />
            </div>
            <div className="flex flex-col w-4/5  h-full items-center justify-center px-5 ">
                <h3 className='text-xl font-semibold ' >
                    Create your league
                </h3>
                <Form {...form} >
                    <form /*onSubmit={form.handleSubmit(onSubmit)}*/ className='w-full h-full space-y-4' >
                        {/* name */}
                        <FormField
                            control={form.control}
                            name='name'
                            render={({ /*field*/ }) => {
                                return (
                                    <FormItem>
                                        <FormLabel>
                                            Name of the league
                                        </FormLabel>
                                        <FormControl>
                                            <Input /*{...field}*/ placeholder='Name' type="text" />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )
                            }}
                        />

                        {/* description */}
                        <FormField
                            control={form.control}
                            name='description'
                            render={({ /*field*/ }) => {
                                return (
                                    <FormItem>
                                        <FormLabel>
                                            **Brief Description
                                        </FormLabel>
                                        <FormControl>
                                            <Textarea /*{...field}*/ placeholder='Description' className='h-[100px]' />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )
                            }}
                        />

                                           

                        
                        {/* page */}
                        <FormField
                            control={form.control}
                            name='teams'
                            render={({ /*field */}) => {
                                return (
                                    <FormItem>
                                        <FormLabel>
                                            Max number of teams
                                        </FormLabel>
                                        <FormControl>
                                            <Input /*{...field}*/ type='number' placeholder='Number of pages' onChange={(e) => {
                                                // const v = e.target.value
                                                // if (v !== "") {
                                                //     const value = parseInt(v)

                                                //     field.onChange(value)
                                                // }
                                            }} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )
                            }}
                        />

                        {/* price */}
                        <FormField
                            control={form.control}
                            name='price'
                            render={({/* field */}) => {
                                return (
                                    <FormItem>
                                        <FormLabel>
                                            Price to pay to join league
                                        </FormLabel>
                                        <FormControl>
                                            <Input /*{...field}*/ type='number' placeholder='Price' onChange={(e) => {
                                                // const v = e.target.value
                                                // if (v !== "") {
                                                //     const value = parseInt(v)

                                                //     field.onChange(value)
                                                // }
                                            }} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )
                            }}
                        />

                        <FormControl    >
                            <Button isLoading={loading} type="submit" >
                                Create
                            </Button>
                        </FormControl>
                    </form>
                </Form>
            </div>
        </div>
    )
}

export default CreateLeague