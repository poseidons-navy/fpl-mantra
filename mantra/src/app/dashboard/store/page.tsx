"use client";
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { PlusIcon, Search } from 'lucide-react'
import Link from 'next/link'
import React from 'react'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import axios from 'axios'
interface League {
  description: string;
  league_id: string;
  league_name: string;
  price: number;
  teams: number;
  joining_data: JoiningData;
}
interface JoiningData {
  join_code: string;
  join_link: string;
}
function StorePage() {
  
  
  const [leagues, setLeagues] = React.useState<League[]>([]);


  React.useEffect(() => {
    (async () => {
      try {
        const response = await axios.get(
          "/api/leagues"
        );
        setLeagues(response.data);
      } catch (err) {
        console.log(err);
      }
    })();
  }, []);
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
          <Input  placeholder='Search for leagues' />
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
            {(leagues || []).map((elem: any, index: number) => {
              return (
                <TableRow key={elem.league_id}>
                  <TableCell>{elem.name}</TableCell>
                  <TableCell>Admin</TableCell>
                  <TableCell>{elem.teams}</TableCell>
                  
                  <TableCell>
                      <Link href={`/dashboard/store/see?leagueId=${elem.league_id}&code=${elem.joining_data.join_code}&name=${elem.name}`}>
                        <Button >View</Button>
                      </Link>
                    </TableCell>
                </TableRow>
              );
            })}
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