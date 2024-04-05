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
import React, { useState } from "react";
import { useForm, FormProvider } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { createAccounts } from '@/db/creations';
// import { useWallet, useConnection } from "@solana/wallet-adapter-react";

const formSchema = z.object({
    manager_id: z.string(),
    email: z.string()
});

type Schema = z.infer<typeof formSchema>;

function CreateAccount() {
    // const { connection } = useConnection();
    const form = useForm<Schema>({
        resolver: zodResolver(formSchema),
    });
   // const { publicKey, sendTransaction } = useWallet();

    const onSubmit = async (data: Schema) => {
        try {
          // if (!publicKey) {
          //     console.log("Wallet Not Connected");
          //     return
          //   }

          console.log("OnSubmit")
          await createAccounts(data.manager_id, data.email);
          // console.log("Got Transaction");
          // const txID = sendTransaction(transaction, connection);
          // console.log(`Transaction sent ${txID}`);
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
                <h3 className="text-xl font-semibold">Login</h3>
                <FormProvider {...form}>
                    <form
                        {...form}
                        onSubmit={form.handleSubmit(onSubmit)}
                        className="w-full h-full space-y-4"
                    >
                        {/* Email */}
                        <FormField
                            control={form.control}
                            name="email"
                            render={({ }) => {
                                return (
                                    <FormItem>
                                        <FormLabel>Email</FormLabel>
                                        <FormControl>
                                            <Input
                                                {...form.register("email")}
                                                placeholder="Email"
                                                type="text"
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                );
                            }}
                        />

                        {/* Manager ID */}
                        <FormField
                            control={form.control}
                            name="manager_id"
                            render={({ }) => {
                                return (
                                    <FormItem>
                                        <FormLabel>Manager ID</FormLabel>
                                        <FormControl>
                                            <Input
                                                {...form.register("manager_id")}
                                                placeholder="Manager ID"
                                                type="text"
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                );
                            }}
                        />

                        <FormControl>
                            <Button type="submit">Login</Button>
                        </FormControl>
                    </form>
                </FormProvider>
            </div>
        </div>
    );
}

export default CreateAccount;
