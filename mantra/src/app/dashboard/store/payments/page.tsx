"use client";
import BackButton from "@/components/back-button";
import "dotenv/config";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input, Textarea } from "@/components/ui/input";

import { Button } from "@/components/ui/button";
import React, { useState } from "react";
import { useForm, FormProvider } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import axios from "axios";

import { Buffer } from "buffer";
import * as web3 from "@solana/web3.js";
import { getPublicKey } from "@/db/getions";
import {
  handlePaymentsOnchain,
  borshInstructionschema,
} from "@/utils/handle_paymets";
const formSchema = z.object({
  name: z.string(),
  description: z.string(),
  teams: z.number(),
  price: z.number(),
  league_id: z.string(),
  events_included: z.number(),
  join_link: z.string(),
  join_code: z.string(),

  // tags: z.string()
});

type Schema = z.infer<typeof formSchema>;
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
function Payments() {
  const [leagues, setLeagues] = React.useState<League[]>([]);
  const { connection } = useConnection();
  const { publicKey, sendTransaction } = useWallet();
  React.useEffect(() => {
    (async () => {
      try {
        const response = await axios.get("/api/leagues");
        setLeagues(response.data);
        console.log(response);
      } catch (err) {
        console.log(err);
      }
    })();
  }, []);
  async function handlePayments() {
    console.log("Payments clicked");
    if (!publicKey) {
      throw new Error("Wallet not connected");
    }
    const transaction = new web3.Transaction();
    for (let league of leagues)
     {
      const response = await axios.get(
        `/api/get_leagues?leagueId=${league.league_id}`,
       
      );
      const manager_id = response.data.standings.results[0].entry;
      //check the publickey of the manager using manager_id
      let user = await getPublicKey(manager_id.toString());
      if(!user)
        {
          throw new Error("User not found");
        }
      let publickey_offchain = user[0].wallet_address;
      if (!publickey_offchain) {
        throw new Error("Public key not found");
      }
      publickey_offchain = new web3.PublicKey(publickey_offchain);
      const buffer = Buffer.alloc(1000);
      borshInstructionschema.encode(
        {
          variant: 6,
          league_id: league.league_id,
          league_name: "",
          creator_id: "",
          events_included: 0,
          user_id: "",
          manager_id: "",
          entry_fee: league.price,
          name: "",
        },
        buffer
      );
      const instructionBuffer = buffer.subarray(
        0,
        borshInstructionschema.getSpan(buffer)
      );
      const instruction = await handlePaymentsOnchain(
        instructionBuffer,
        publickey_offchain,//TODO: change to publickey_offchain
        publicKey,
        league.league_id
      );
      transaction.add(instruction);
      console.log(league.league_id);
      console.log(instruction);
    };
    console.log(transaction);
    try {
      const signature = await sendTransaction(transaction, connection);
      console.log("Signature", signature);
    } catch (e) {
      console.error("Error sending transaction", e);
    }
  }
 
   
  
  return (
    <div className="flex flex-col w-full h-full items-center  justify-center ">
      <Button onClick={handlePayments}>Do payments</Button>
      
    </div>
  );
}

export default Payments;
