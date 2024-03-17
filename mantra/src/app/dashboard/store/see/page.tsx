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
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'

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


    return (
        <div className="flex flex-col w-auto h-auto ">
            <div className="flex flex-row items-center justify-start w-full">
                <BackButton />
            </div>
            <div className="flex flex-col w-full  h-full items-center justify-center px-5 ">
                <h2 className='text-lg font-semibold' >
                    WAZITO LEAGUE
                </h2>
                <p><i className=' text-zinc-500'>Last Updated:</i> Sun 10 Mar 22:12(local time)</p>
                <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>
                            Pos
                        </TableHead>
                        <TableHead>
                            Team/Owner
                        </TableHead>
                        <TableHead>
                            GW1 Points
                        </TableHead>
                        <TableHead>
                            Total Points
                        </TableHead>
                        
                    </TableRow>

                </TableHeader>
                <TableBody>
                    {/* {purchaseHistory.map((elem, index) => {
                        return*/ <TableRow /*key={index}*/>
                            <TableCell>1{/*elem.pos*/}</TableCell>
                            <TableCell>Arsenal FC{/*elem.team.name*/}</TableCell>
                            <TableCell>52{/*elem.gameweek*/}</TableCell>
                            <TableCell>1134</TableCell>
                        </TableRow>
                        
                    /*})} */}
                    <TableRow>
                        <TableCell>2</TableCell>
                        <TableCell>Arsenal FC</TableCell>
                        <TableCell>52</TableCell>
                        <TableCell>1134</TableCell>
                    </TableRow>
                    <TableRow /*key={index}*/>
                            <TableCell>3{/*elem.name*/}</TableCell>
                            <TableCell>Arsenal FC{/*elem.creator.name*/}</TableCell>
                            <TableCell>52{/*elem.genre*/}</TableCell>
                            <TableCell>1134</TableCell>
                        </TableRow>
                        <TableRow /*key={index}*/>
                            <TableCell>4{/*elem.name*/}</TableCell>
                            <TableCell>Arsenal FC{/*elem.creator.name*/}</TableCell>
                            <TableCell>52{/*elem.genre*/}</TableCell>
                            <TableCell>1134</TableCell>
                        </TableRow>
                </TableBody>
            </Table>
            </div>
        </div>
    )
}

export default CreateLeague