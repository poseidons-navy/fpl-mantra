"use client";
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { PlusIcon, Search } from 'lucide-react'
import Link from 'next/link'
import React, { useEffect, useState } from 'react'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'

function StorePage() {
  const [search, setSearch] = useState<string>()
  const [searchLoading, setSearchLoading] = useState(false)
  

  return (
    <div className="flex flex-col w-full items-center pt-5 gap-y-4">
      <h3 className="font-semibold text-xl w-full">
        Leagues you have created
      </h3>
 
      
      <div className="flex flex-row w-full items-center justify-between gap-x-2">
        <Link href="/dashboard/store/new" legacyBehavior>
        <Button>
            Create new league
        </Button>
        </Link>
        <div className="flex flex-row items-center justify-center gap-x-1 w-4/5 ">
          <Input onChange={(e)=> setSearch(e.target.value)} placeholder='Search for leagues' />
          <Button /*onClick={handleSearch} variant={'outline'} isLoading={searchLoading}*/ >
            <Search/>
          </Button>
        </div>
      </div>

      

      <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>
                            Name
                        </TableHead>
                        <TableHead>
                            Creator
                        </TableHead>
                        <TableHead>
                            Participants
                        </TableHead>
                        <TableHead></TableHead>
                    </TableRow>

                </TableHeader>
                <TableBody>
                    {/* {purchaseHistory.map((elem, index) => {
                        return*/ <TableRow /*key={index}*/>
                            <TableCell>Wazito League{/*elem.name*/}</TableCell>
                            <TableCell>Vincent{/*elem.creator.name*/}</TableCell>
                            <TableCell>5{/*elem.genre*/}</TableCell>
                            <TableCell>
                              <Link href="/dashboard/store/view" legacyBehavior>
                                <Button>
                                    View
                                </Button>
                                </Link>
                            </TableCell>
                        </TableRow>
                    /*})} */}
                </TableBody>
            </Table>
      <div className="flex flex-col w-full items-center gap-y-5">
          <div className="w-full rounded-md bg-slate-100 animate-pulse h-[300px] shadow-sm"></div>
          <div className="w-full rounded-md bg-slate-100 animate-pulse h-[300px] shadow-sm"></div>
          <div className="w-full rounded-md bg-slate-100 animate-pulse h-[300px] shadow-sm"></div>
          <div className="w-full rounded-md bg-slate-100 animate-pulse h-[300px] shadow-sm"></div>
        </div>
      </div>
  )
}

export default StorePage