"use client";
import BackButton from "@/components/back-button";
import {
    FormControl,
    FormField,
    FormItem,
    FormLabel,
} from "@/components/ui/form";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectScrollUpButton, SelectGroup, SelectLabel, SelectItem } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import React, { useEffect, useState } from "react";
import { useForm, FormProvider } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";
import {getCompetitionsFromDB, getLeagues} from "@/db/getions";
import {FirebaseCompetition} from "@/utils/firebase-types";
const formSchema = z.object({
  competition_id: z.string(),
});

type Schema = z.infer<typeof formSchema>;

export default function JoinCompetition() {
    const form = useForm<Schema>({
        resolver: zodResolver(formSchema),
    });
    const [competitions, setCompetitions] = useState<FirebaseCompetition[]>([]);

    useEffect(() => {
      async function fetchCompetitions() {
        const manager_id = localStorage.getItem("manager_id");
        if (!manager_id) {
          console.log("Could Not Get Manager ID");
        } else {
          var comps = await getCompetitionsFromDB();
          setCompetitions(comps);
        }
      }

      fetchCompetitions();
    }, []);


    const onSubmit = async (data: Schema) => {
        try {
          console.log("OnSubmit");
            if (typeof window !== "undefined" && window.localStorage) {
              const manager_id = localStorage.getItem("manager_id") ?? "";
              console.log("Form Data", data);
              const response = await axios.post("/api/join-competition", {
                competition_id: data.competition_id,
                member_id: manager_id 
              });

              if (response.status === 201) {
                console.log("Joined Competition");
              } else {
                console.log("Could Not Join Competition");
              }
            } else {
              console.log("Could Not Get Stuff From Local Storage");
            }
        } catch (e) {
            throw new Error((e as Error).toString());
        }
    };
    const competitionItems = competitions.map((c: FirebaseCompetition, index: number) => {
      return (
        <SelectItem key={index} value={c.competition_id}>{c.competition_name}</SelectItem>
      );
    })

    return (
        <div className="flex flex-col items-center justify-center">
            <div className="flex flex-row items-center justify-start w-full">
                <BackButton />
            </div>
            <div className="flex flex-col w-3/5 h-full items-center justify-center px-5">
                <h3 className="text-xl font-semibold">Join Competition</h3>
                <FormProvider {...form}>
                    <form
                        {...form}
                        onSubmit={form.handleSubmit(onSubmit)}
                        className="w-full h-full space-y-4"
                    >
                        <FormField
                          control={form.control}
                          name="competition_id"
                          render={({ field }) => {
                            return(
                              <FormItem>
                                <FormLabel>Competition</FormLabel>
                                <FormControl>
                                  <Select onValueChange={field.onChange} {...field}>
                                    <SelectTrigger aria-label="competitions">
                                      <SelectValue placeholder="Select Competition" />
                                    </SelectTrigger>
                                    <SelectContent className="bg-white">
                                      <SelectScrollUpButton/>
                                      <SelectGroup>
                                        <SelectLabel>Competitions</SelectLabel>
                                        {competitionItems}
                                      </SelectGroup>
                                    </SelectContent>
                                  </Select>
                                </FormControl>
                              </FormItem>
                            );
                          }}/>
          
                        <FormControl>
                            <Button type="submit">Join</Button>
                        </FormControl>
                    </form>
                </FormProvider>
            </div>
        </div>
    );
}
