"use client";
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { PlusIcon, Search } from 'lucide-react'
import Link from 'next/link'
import React, { useEffect, useState } from 'react'

function StorePage() {
  const [search, setSearch] = useState<string>()
  const [searchLoading, setSearchLoading] = useState(false)
  

  return (
    <div className="flex flex-col w-full items-center pt-5 gap-y-4">
      <h3 className="font-semibold text-xl w-full">
        Leagues you have created
      </h3>
 
      <Link href="/dashboard/store/new" legacyBehavior >
        <div className="flex cursor-pointer shadow-sm hover:bg-slate-100 flex-col items-center justify-center w-full rounded-md h-[100px] ring-1 ring-amber-50 ">
            <PlusIcon />
            <span>
              Create a new league
            </span>
        </div>
      </Link>

      <div className="flex flex-row w-full items-center justify-between gap-x-4">
        <div className="flex flex-row items-center justify-center gap-x-3 w-4/5 ">
          <Input onChange={(e)=> setSearch(e.target.value)} placeholder='Search for your leagues' />
          <Button /*onClick={handleSearch} variant={'outline'} isLoading={searchLoading}*/ >
            <Search/>
          </Button>
        </div>
        <div className="flex flex-row items-center justify-center gap-x-3">
          <Select /*onValueChange={(value)=>{
            console.log("Value", value)
             handleChangeStatus(value)
          }}*/ >
            <SelectTrigger>
              <SelectValue placeholder="Choose a status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value='draft' >
                  Created
              </SelectItem>
              <SelectItem value='published' >
                Finished
              </SelectItem>
              <SelectItem value='archived' >
                Ongoing
              </SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      
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