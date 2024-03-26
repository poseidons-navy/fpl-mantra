"use client";
import BackButton from "@/components/back-button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input, Textarea } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { sendSol } from "@/utils/handle_league_payments";
import { useToast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";
import React, { useState } from "react";
import { useForm, FormProvider } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import * as web3 from "@solana/web3.js";
import axios from "axios";
import { handleCreateLeagueOnchain, League } from "@/utils/create_league";

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
  const { toast } = useToast();
  const [showDialog, setShowDialog] = useState();
  const { connection } = useConnection();
  const { publicKey, sendTransaction } = useWallet();
  const form = useForm<Schema>({
    resolver: zodResolver(formSchema),
  });

  const onSubmit = async (data: Schema) => {
    if (!publicKey) {
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
        //Create the league onchain
        const league = new League(
          data.league_id,
          data.name,
          [],
          "admin1",
          data.events_included
        );
        const transaction = await handleCreateLeagueOnchain(league, publicKey);
        //Send the transaction
        console.log("We are sending the transaction");
        let txid = await sendTransaction(transaction, connection);
        console.log(
          `Transaction submitted: https://explorer.solana.com/tx/${txid}?cluster=devnet`
        );
      }
      console.log(response);
    } catch (e) {
      throw new Error((e as Error).toString());
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
