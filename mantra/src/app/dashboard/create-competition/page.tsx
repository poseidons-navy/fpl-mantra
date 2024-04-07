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
import { Button } from "@/components/ui/button";
import React, { useEffect, useState } from "react";
import { useForm, FormProvider } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";
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
    const [leagues, setLeagues] = useState([]);

    useEffect(() => {
      async function fetchUsersLeagues() {
        const manager_id = localStorage.getItem("manager_id");
        if (!manager_id) {
          console.log("Could Not Get Manager ID");
        } else {
   //       var leagues = await getLeaguesOfMember(manager_id);
          setLeagues(leagues ?? []);
        }
      }

      fetchUsersLeagues();
    }, []);


    const onSubmit = async (data: Schema) => {
        try {
          console.log("OnSubmit");
            if (typeof window !== "undefined" && window.localStorage) {
              const manager_id = localStorage.getItem("manager_id");
              console.log(`Manager ID is ${manager_id}`);
              const response = await axios.post("/api/create-competition", {
                creator_id: manager_id,
                entry_fee: data.entry_fee,
                league_id: data.league_id,
                name: data.name
              });
              console.log("Create Competition Done");

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
                        
                        {/* League ID */}
                        <FormField
                            control={form.control}
                            name="league_id"
                            render={({ }) => {
                                return (
                                    <FormItem>
                                        <FormLabel>League ID</FormLabel>
                                        <FormControl>
                                            <Input
                                                {...form.register("league_id")}
                                                placeholder="League ID"
                                                type="number"
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                );
                            }}
                        /> 

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
