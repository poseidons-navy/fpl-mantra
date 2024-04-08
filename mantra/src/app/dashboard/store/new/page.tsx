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

function CreateLeague() {
  const [loading, setLoading] = useState(false);
  const { connection } = useConnection();
  const { publicKey, sendTransaction } = useWallet();
  const form = useForm<Schema>({
    resolver: zodResolver(formSchema),
  });

  const onSubmit = async (data: Schema) => {
    if (!publicKey) {
      alert("Wallet not connected");
      throw new Error("Wallet not connected");
    }
    //TODO: Add max_teams to database, add description to database
    try {
      const response = await axios.post("/api/create_league", {
        name: data.name,
        league_id: data.league_id,
        description: data.description,
        teams: data.teams,
        price: data.price,
        events_included: data.events_included,
        joining_data: { join_link: data.join_link, join_code: data.join_code },
      });
      if (response.status === 200) {
        console.log("firebase succesfull. Now creating league onchain");

        const buffer = Buffer.alloc(10000);
        console.log("here");
        borshInstructionschema.encode(
          {
            variant: 0,
            league_id: data.league_id,
            creator_id: publicKey.toBase58(),
            league_name: data.name,
            events_included: data.events_included,
            user_id: "",
            manager_id: "",
            entry_fee: 0,
            name: "",
          },
          buffer
        );
        //Initialize league jackpot instruction
        const buffer2 = Buffer.alloc(10000);
        initInstructionschema.encode(
          {
            variant: 2,
            league_id: "",
            creator_id: "",
            league_name: data.name,
            events_included: 0,
            user_id: "",
            manager_id: "",
            entry_fee: 0,
            name: "",
          },
          buffer2
        );
          const initInstructinBuffer = buffer2.subarray(0, initInstructionschema.getSpan(buffer2));
        //End of init instruction
        console.log("Did we like reach here");
        console.log(borshInstructionschema);
        const instructionBuffer = buffer.subarray(
          0,
          borshInstructionschema.getSpan(buffer)
        );
        const create_instrcution = await init_jackpot_account(
          initInstructinBuffer,
          data.name,
          publicKey
        );
        const join_instruction = await handleCreateLeagueOnchain(
          instructionBuffer,
          publicKey,
          data.league_id
        );

        const transaction = new web3.Transaction();
        transaction.add(create_instrcution);
        transaction.add(join_instruction);
        console.log("transaction created");
        const txid = sendTransaction(transaction, connection);
        console.log("transaction sent", txid);
      }
      alert("League created successfully");
      console.log(response);
    } catch (e: any) {
      console.log("Error occure in one of the instructions", e);
      alert("Error creating league");
      throw new Error(e.toString());
    }
    setLoading(true);
  };

  return (
    <div className="flex flex-col w-full h-full items-center  justify-center ">
      <div className="flex flex-row items-center justify-start w-full">
        <BackButton />
      </div>
      <div className="flex flex-col w-4/5  h-full items-center justify-center px-5 ">
        <h3 className="text-xl font-semibold ">Create your league</h3>
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
              name="league_id"
              render={(
                {
                  /*field*/
                }
              ) => {
                return (
                  <FormItem>
                    <FormLabel>League id</FormLabel>
                    <FormControl>
                      <Input
                        /*{...field}*/ placeholder="league_id"
                        type="text"
                        {...form.register("league_id")}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                );
              }}
            />

            {/* description */}
            <FormField
              control={form.control}
              name="description"
              render={(
                {
                  /*field*/
                }
              ) => {
                return (
                  <FormItem>
                    <FormLabel>**Brief Description</FormLabel>
                    <FormControl>
                      <Textarea
                        /*{...field}*/ placeholder="Description"
                        className="h-[100px]"
                        {...form.register("description")}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                );
              }}
            />

            {/* page */}
            <FormField
              control={form.control}
              name="teams"
              render={() => {
                return (
                  <FormItem>
                    <FormLabel>Max number of teams</FormLabel>
                    <FormControl>
                      <Input
                        /*{...field}*/ type="number"
                        placeholder="Number of teams"
                        {...form.register("teams", { valueAsNumber: true })}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                );
              }}
            />

            <FormField
              control={form.control}
              name="events_included"
              render={(
                {
                  /*field*/
                }
              ) => {
                return (
                  <FormItem>
                    <FormLabel>Scoring starts</FormLabel>
                    <FormControl>
                      <Input
                        /*{...field}*/ placeholder="events_included"
                        type="number"
                        {...form.register("events_included", {
                          valueAsNumber: true,
                        })}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                );
              }}
            />

            {/* price */}
            <FormField
              control={form.control}
              name="price"
              render={() => {
                return (
                  <FormItem>
                    <FormLabel>Price to pay to join league</FormLabel>
                    <FormControl>
                      <Input
                        /*{...field}*/ type="number"
                        placeholder="Price"
                        {...form.register("price", { valueAsNumber: true })}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                );
              }}
            />
            <FormField
              control={form.control}
              name="join_link"
              render={({}) => {
                return (
                  <FormItem>
                    <FormLabel>Join link of the league</FormLabel>
                    <FormControl>
                      <Input
                        /*{...field}*/ placeholder="Join link"
                        type="text"
                        {...form.register("join_link")}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                );
              }}
            />

            <FormField
              control={form.control}
              name="join_code"
              render={({}) => {
                return (
                  <FormItem>
                    <FormLabel>Joining code league</FormLabel>
                    <FormControl>
                      <Input
                        /*{...field}*/ placeholder="Code"
                        type="text"
                        {...form.register("join_code")}
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

export default CreateLeague;
