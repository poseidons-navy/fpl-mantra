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
import {
  handleCreateLeagueOnchain,
  borshInstructionschema,
} from "@/utils/create_league";
import { init_jackpot_account, initInstructionschema } from "@/utils/init_league_jackpot";
import { Buffer } from "buffer";
import * as web3 from "@solana/web3.js";
const formSchema = z.object({
  name: z.string(),
  entry_fee: z.string().transform((p) => Number.parseFloat(p))
});

type Schema = z.infer<typeof formSchema>;

export default function CreateLeague() {
  const { connection } = useConnection();
  const { publicKey, sendTransaction } = useWallet();
  const form = useForm<Schema>({
    resolver: zodResolver(formSchema),
  });

  const onSubmit = async (data: Schema) => {
    if (!publicKey) {
      throw new Error("Wallet not connected");
    }
    
    try {
      const response = await axios.post("/api/", {
        
      })   
    } catch (e: any) {
      console.log("Error occure in one of the instructions", e);
      throw new Error(e.toString());
    }
  };

  return (
    <div className="flex flex-col w-full h-full items-center  justify-center ">
      <div className="flex flex-row items-center justify-start w-full">
        <BackButton />
      </div>
      <div className="flex flex-col w-4/5  h-full items-center justify-center px-5 ">
        <h3 className="text-xl font-semibold ">Create Competition</h3>
        <FormProvider {...form}>
          <form
            className="w-full h-full space-y-4"
            {...form}
            onSubmit={form.handleSubmit(onSubmit)}
          >
            <FormField
              control={form.control}
              name="name"
              render={({}) => {
                return (
                  <FormItem>
                    <FormLabel>Name of the league</FormLabel>
                    <FormControl>
                      <Input
                        /*{...field}*/ placeholder="Name"
                        type="text"
                        {...form.register("name")}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                );
              }}
            />

            <FormField
              control={form.control}
              name="entry_fee"
              render={(
                {
                  /*field*/
                }
              ) => {
                return (
                  <FormItem>
                    <FormLabel>Entry Fee</FormLabel>
                    <FormControl>
                      <Input
                        /*{...field}*/ placeholder="Entry Fee"
                        type="text"
                        {...form.register("entry_fee")}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                );
              }}
            />

            <FormControl>
              <Button type="submit">Create</Button>
            </FormControl>
          </form>
        </FormProvider>
      </div>
    </div>
  );
}
