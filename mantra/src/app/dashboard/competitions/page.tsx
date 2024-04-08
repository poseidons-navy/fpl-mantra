"use client"
import BackButton from '@/components/back-button'
import React, { useEffect, useState } from 'react'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import {getCompetitionsFromDB} from '@/db/getions';
import {FirebaseCompetition} from '@/utils/firebase-types';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import axios from 'axios';
import returnSendSolInstruction from '@/utils/sendSol';
import { useWallet, useConnection } from '@solana/wallet-adapter-react';
import FPLMantraCompetition from '@/utils/competition';
import {Transaction} from "@solana/web3.js";

function CreateLeague() {
  const {connection} = useConnection();
  const {publicKey, sendTransaction} = useWallet();
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

  async function handleJoin(competition_id: string, joining_fee: number, league_id: string, name: string) {
    try {
      if (!publicKey) {
        console.log("Wallet Not Connected");
        return
      }
      if (typeof window !== "undefined" && window.localStorage) {
        const manager_id = localStorage.getItem("manager_id") ?? "";
        const response = await axios.post("/api/join-competition", {
          competition_id: competition_id,
          member_id: manager_id 
        });

        if (response.status === 201) {
          console.log("Joined Competition");

          // Charge for joining competition
          const competition = new FPLMantraCompetition();
          const competitionPDA = competition.getCompetitionPDA(league_id, name)[0];
          var payJoiningFeeInsturction = await returnSendSolInstruction(competitionPDA, publicKey, joining_fee);
          const transaction = new Transaction();
          transaction.add(payJoiningFeeInsturction);
          const transHash = await sendTransaction(transaction, connection);
          console.log(transHash);
        } else {
          console.log("Could Not Join Competition");
        }
      } else {
        console.log("Could Not Get Stuff From Local Storage");
      }
    } catch(err) {
      console.log("OHH SHIT", err);
    }
  }

  const competitionEntries = competitions.map((c, i) => {
    return (
        <TableRow key={i}>
          <TableCell>{c.competition_name}</TableCell>
          <TableCell>{c.league_id}</TableCell>
          <TableCell>{c.creator_id}</TableCell>
          <TableCell>{c.entry_fee}</TableCell>
          <TableCell>
                    <Button
                      onClick={() =>
                        // TODO: Changed the third argument
                        handleJoin(c.competition_id, c.entry_fee, c.league_id, c.competition_name)
                      }
                    >
                      Join
                    </Button>
                  </TableCell>  
        </TableRow>
    );
  });
    return (
        <div className="flex flex-col w-auto h-auto ">
            <div className="flex flex-row items-center justify-start w-full">
                <BackButton />
            </div>
            <div className="flex flex-col w-full  h-full items-center justify-center px-5 ">
              <Link href="/dashboard/create-competition" legacyBehavior >
                <Button className="mr-auto mt-2">Create Competition</Button>
              </Link>

                <h2 className='text-lg font-semibold mt-4' >
                    COMPETITIONS
                </h2>
                <Table className='mt-4'>
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
                        <TableHead />
                        
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
