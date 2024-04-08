"use client";
// import Account from '@/utils/account';
import BackButton from "@/components/back-button";
import {
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectScrollUpButton, SelectGroup, SelectLabel, SelectItem } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import React, { useEffect, useState } from "react";
import { useForm, FormProvider } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";
import {getLeagues} from "@/db/getions";
import {DocumentData} from "firebase/firestore";
import FPLMantraCompetition from "@/utils/competition";
import {publicKey} from "@coral-xyz/borsh";
import { useWallet, useConnection } from "@solana/wallet-adapter-react";
// import {getLeaguesOfMember} from "@/db/getions";

const formSchema = z.object({
  name: z.string(),
  league_id: z.string(),
  entry_fee: z.string().transform((p) => Number.parseFloat(p))
});

type Schema = z.infer<typeof formSchema>;

function CreateCompetition() {
    const form = useForm<Schema>({
        resolver: zodResolver(formSchema),
    });
    const [leagues, setLeagues] = useState<DocumentData>([]);
    const { connection } = useConnection();
    const { publicKey, sendTransaction } = useWallet();

    useEffect(() => {
      async function fetchUsersLeagues() {
        const manager_id = localStorage.getItem("manager_id");
        if (!manager_id) {
          console.log("Could Not Get Manager ID");
        } else {
          var leagues = await getLeagues();
          console.log(leagues);
          setLeagues(leagues ?? []);
        }
      }

      fetchUsersLeagues();
    }, []);


    const onSubmit = async (data: Schema) => {
        try {
          console.log("OnSubmit");
          if (!publicKey) {
            console.log("Wallet Not Connected");
            return;
          }
            if (typeof window !== "undefined" && window.localStorage) {
              const manager_id = localStorage.getItem("manager_id") ?? "";
              console.log("Form Data", data);
              const response = await axios.post("/api/create-competition", {
                creator_id: manager_id,
                entry_fee: data.entry_fee,
                league_id: data.league_id,
                name: data.name
              });

              // Create competition offchain
              const competition = new FPLMantraCompetition();
              let creator_id = localStorage.getItem("userobjectid") ?? "";
              const transaction = await competition.createAccountOnChain(publicKey, data.name, data.league_id, data.entry_fee, creator_id, manager_id);
              const transHash = await sendTransaction(transaction, connection);
              console.log(`Transaction complete: ${transHash}`);

              if (response.status === 201) {
                console.log("Competition Created");
              } else {
                console.log("Could Not Create Competition");
              }
            } else {
              console.log("Could Not Get Stuff From Local Storage");
            }
        } catch (e) {
            throw new Error((e as Error).toString());
        }
    };

    const leagueSelectItems = leagues.map((l: DocumentData, index: number) => {
      return (
        <SelectItem key={index} value={l.league_id} >{l.name}</SelectItem>
      );
    })

    return (
        <div className="flex flex-col items-center justify-center">
            <div className="flex flex-row items-center justify-start w-full">
                <BackButton />
            </div>
            <div className="flex flex-col w-3/5 h-full items-center justify-center px-5">
                <h3 className="text-xl font-semibold">Create Competition</h3>
                <FormProvider {...form}>
                    <form
                        {...form}
                        onSubmit={form.handleSubmit(onSubmit)}
                        className="w-full h-full space-y-4"
                    >
                        {/* Name */}
                        <FormField
                            control={form.control}
                            name="name"
                            render={({ }) => {
                                return (
                                    <FormItem>
                                        <FormLabel>Name</FormLabel>
                                        <FormControl>
                                            <Input
                                                {...form.register("name")}
                                                placeholder="Competition Name"
                                                type="text"
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
                          render={({ field }) => {
                            return(
                              <FormItem>
                                <FormLabel>League</FormLabel>
                                <FormControl>
                                  <Select onValueChange={field.onChange} {...field}>
                                    <SelectTrigger aria-label="leagues">
                                      <SelectValue placeholder="Select League" />
                                    </SelectTrigger>
                                    <SelectContent className="bg-white">
                                      <SelectScrollUpButton/>
                                      <SelectGroup>
                                        <SelectLabel>Leagues</SelectLabel>
                                        {leagueSelectItems}
                                      </SelectGroup>
                                    </SelectContent>
                                  </Select>
                                </FormControl>
                              </FormItem>
                            );
                          }}/>
          
                        {/* Entry Fee */}
                        <FormField
                            control={form.control}
                            name="entry_fee"
                            render={({ }) => {
                                return (
                                    <FormItem>
                                        <FormLabel>Entry Fee</FormLabel>
                                        <FormControl>
                                            <Input
                                                {...form.register("entry_fee")}
                                                placeholder="Entry Fee"
                                                type="number"
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                );
                            }}
                        />

                        <FormControl>
                            <Button type="submit">Create Competition</Button>
                        </FormControl>
                    </form>
                </FormProvider>
            </div>
        </div>
    );
}

export default CreateCompetition;
