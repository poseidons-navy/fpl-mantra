"use client"
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



async function DashboardPage() {
 
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
          {/* <CopyText
                        className='col-span-4'
                        text={user.walletAddress ?? ""}
                        title={"Account Address"}
                        icon='BookUser'
                        defaultView
                    />
                    <DecryptPrivateKey visible={true}/> */}
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
            </TableRow>
          </TableHeader>
          <TableBody>
            {
              /* {purchaseHistory.map((elem, index) => {
                        return*/ <TableRow /*key={index}*/>
                <TableCell>Wazito League{/*elem.name*/}</TableCell>
                <TableCell>Vincent{/*elem.creator.name*/}</TableCell>
                <TableCell>5{/*elem.genre*/}</TableCell>
                <TableCell>
                  <Link href="/dashboard/store/see">
                    <Button>Preview</Button>
                  </Link>
                </TableCell>
              </TableRow>
              /*})} */
            }
          </TableBody>
        </Table>
      </div>
      {/* Purchase History */}
      <div className="flex flex-col gap-y-4 w-full px-5 py-5">
        <div className="flex flex-row items-center gap-x-4 w-full">
          <HistoryIcon stroke="gray" />
          <h2 className="text-lg font-semibold">
            Previous Leagues (Completed)
          </h2>
        </div>

        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Creator</TableHead>
              <TableHead>Participants</TableHead>
              <TableHead></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {
              /* {purchaseHistory.map((elem, index) => {
                        return*/ <TableRow /*key={index}*/>
                <TableCell>Wazito League{/*elem.name*/}</TableCell>
                <TableCell>Vincent{/*elem.creator.name*/}</TableCell>
                <TableCell>5{/*elem.genre*/}</TableCell>
                <TableCell>
                  <Link href="/dashboard/store/see">
                    <Button>Preview</Button>
                  </Link>
                </TableCell>
              </TableRow>
              /*})} */
            }
          </TableBody>
        </Table>
      </div>
    </div>
  );
}

export default DashboardPage;
