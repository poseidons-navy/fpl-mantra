"use client"
import BackButton from '@/components/back-button'
import React, { useEffect, useState } from 'react'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import {getCompetitionsFromDB} from '@/db/getions';
import {FirebaseCompetition} from '@/utils/firebase-types';

function CreateLeague() {
  const [competitions, setCompetitions] = useState<FirebaseCompetition[]>([]);
  useEffect(() => {
    async function getCompetitions() {
      try {
        console.log("Asking for competitons");
        let competitionsFromDB = await getCompetitionsFromDB();
        setCompetitions(competitionsFromDB);
        console.log("Done")
      } catch(err) {
        console.log("OHH SHIT");
        console.log(err)
      }
    }

    getCompetitions();
  }, [])

  const competitionEntries = competitions.map((c, i) => {
    return (
        <TableRow key={i}>
          <TableCell>{c.competition_name}</TableCell>
          <TableCell>{c.league_id}</TableCell>
          <TableCell>{c.creator_id}</TableCell>
          <TableCell>{c.entry_fee}</TableCell>
        </TableRow>
    );
  });
    return (
        <div className="flex flex-col w-auto h-auto ">
            <div className="flex flex-row items-center justify-start w-full">
                <BackButton />
            </div>
            <div className="flex flex-col w-full  h-full items-center justify-center px-5 ">
                <h2 className='text-lg font-semibold' >
                    COMPETITIONS
                </h2>
                <p><i className=' text-zinc-500'>Last Updated:</i> Sun 10 Mar 22:12(local time)</p>
                <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>
                            Name
                        </TableHead>
                        <TableHead>
                            League ID
                        </TableHead>
                        <TableHead>
                            Creator ID
                        </TableHead>
                        <TableHead>
                            Entry Fee
                        </TableHead>
                        
                    </TableRow>

                </TableHeader>
                <TableBody>
                    {competitionEntries}
                </TableBody>
            </Table>
            </div>
        </div>
    )
}

export default CreateLeague
