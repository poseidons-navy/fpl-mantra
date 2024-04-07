"use client";
import CopyText from "@/components/copy-text";
//import DecryptPrivateKey from '@/components/decrypt-private-key'
import Redirect from "@/components/redirect";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
//import { getServerAuthSession } from '@/server/auth'
//import { isNull } from 'lodash'
import { HistoryIcon } from "lucide-react";
import React from "react";
import Link from "next/link";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import axios from "axios";
import { set } from "lodash";
import { sendSol } from "@/utils/handle_league_payments";
import { useWallet, useConnection } from "@solana/wallet-adapter-react";
import {
  joinInstructionschema,
  handleJoinLeagueOnchain,
} from "@/utils/join_league";
import * as web3 from "@solana/web3.js";
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
function DashboardPage() {
  const [leagues, setLeagues] = React.useState<League[]>([]);
  const { connection } = useConnection();
  const { publicKey, sendTransaction } = useWallet();

  React.useEffect(() => {
    (async () => {
      try {
        const response: League[] = await axios.get(
          "http://localhost:3000/api/leagues"
        );
        setLeagues(response);
      } catch (err) {
        console.log(err);
      }
    })();
  }, []);
  async function handleJoin(
    leagueId: string,
    amount: number,
    league_name: string
  ) {
    if (!publicKey) {
      throw new Error("Wallet not connected");
    }
    try {
      //send sol to the league pda.
      const send_instruction = await sendSol(league_name, publicKey, amount);
      //After sending sol, send join league transaction
      const buffer = Buffer.alloc(10000);
      joinInstructionschema.encode(
        {
          variant: 3,
          league_id: leagueId,
          league_name: "",
          creator_id: "creator_id",
          events_included: 0,
          user_id: "user_id",
          manager_id: "manager_id",
          entry_fee: 0,
          name: "",
        },
        buffer
      );
      const instructionBuffer = buffer.subarray(
        0,
        joinInstructionschema.getSpan(buffer)
      );

      const join_instruction = await handleJoinLeagueOnchain(
        instructionBuffer,
        publicKey,
        leagueId
      );
      const transaction = new web3.Transaction()
        .add(send_instruction)
        .add(join_instruction);
      const txid = sendTransaction(transaction, connection);
      console.log("transaction sent", txid);
      //Join league offchain
      if (await txid) {
        const response = await axios.post("/api/join_league", {
          league_id: leagueId,
          member_id: publicKey.toBase58(),
        });
        if (response.status === 200) {
          console.log("Joined league successfully");
        }
      }
    } catch (e: any) {
      console.log("Error occured during join league", e);
      throw new Error(e.toString());
    }
  }
  return (
    <div className="flex flex-col items-center justify-center w-full space-y-10 px-2 pb-[100px]">
      {/* Wallet Section */}
      <div className="flex flex-col w-full space-y-5 ring-1 ring-amber-800 rounded-md shadow-lg px-5 py-5 ">
        <div className="flex flex-row justify-between">
          <h2 className="text-xl font-semibold">Solana Wallet</h2>
        </div>
        <div className="grid grid-cols-4 w-full gap-y-4">
          <div className="col-span-4 flex flex-row items-center justify-between">
            <div className="flex flex-row items-center gap-x-5">
              <span className="font-semibold text-lg">Current Balance</span>
            </div>
            <span>
              {/*balance*/}1 SOL | {/*(balance * 0.14).toFixed(2)*/}128 USD
            </span>
          </div>
        </div>
      </div>

      {/*Create or Join Existing league*/}
      <div className="flex flex-row items-center gap-x-4 w-full">
        <div>
          <Dialog>
            <DialogTrigger>
              <Button>Join existing league</Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Join an existing league</DialogTitle>
                <DialogDescription>
                  Enter league code to join the league. Make sure you have
                </DialogDescription>
              </DialogHeader>
              <div className="flex flex-col w-full gap-y-2 ">
                <Input
                  /*onChange={(e) => setPassword(e.target.value)}*/ placeholder="League code..."
                  type="password"
                />
                <Button variant={"default"} /*onClick={handleDecrypt}*/>
                  Join!
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        <Link href="/dashboard/store/new" legacyBehavior>
          <Button>Create new league</Button>
        </Link>
      </div>
      {/* Purchase History */}
      <div className="flex flex-col gap-y-4 w-full px-5 py-5">
        <div className="flex flex-row items-center gap-x-4 w-full">
          <HistoryIcon stroke="gray" />
          <h2 className="text-lg font-semibold">Leagues joined (Live)</h2>
        </div>

        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Creator</TableHead>
              <TableHead>Participants</TableHead>
              <TableHead></TableHead>
              <TableHead></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {(leagues.data || []).map((elem, index) => {
              return (
                <TableRow key={elem.league_id}>
                  <TableCell>{elem.name}</TableCell>
                  <TableCell>Admin</TableCell>
                  <TableCell>{elem.teams}</TableCell>
                  <TableCell>
                    {/* <Link href="/dashboard/store/see"> */}
                    <Button
                      onClick={() =>
                        // TODO: Changed the third argument
                        handleJoin(elem.league_id, elem.price, elem.league_id)
                      }
                    >
                      Join
                    </Button>

                    {/* </Link> */}
                   
                  </TableCell>
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
      </div>
      
    </div>
  );
}

export default DashboardPage;
