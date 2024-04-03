"use client";
import BackButton from "@/components/back-button";
import axios from "axios";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";
import React, { useState } from "react";
import { useForm, FormProvider } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { WalletMultiButton } from "@solana/wallet-adapter-react-ui";
import WalletContextProvider from "@/components/wallet/WalletContextProvider";
import { useWallet } from "@solana/wallet-adapter-react";

const formSchema = z.object({
  email: z.string(),
  password: z.string(),
  manager_id: z.string().transform((p) => Number.parseInt(p))
});

type Schema = z.infer<typeof formSchema>;

function LoginPage() {
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();
  const form = useForm<Schema>({
    resolver: zodResolver(formSchema),
  });
  const {publicKey} = useWallet();

  const onSubmit = async (data: Schema) => {
    try {
      // const response = await axios.get("api/get_leagues", {});

      // const response = await axios.post("/api/login", {
      //  email: data.email,
      //  manager_id: data.manager_id,
      //  password: data.password,
      //});
      //
      if (!publicKey) {
        console.log('error', 'Wallet not connected!');
        return;
      }

      const response = await axios.post("api/create-account", {
          email: data.email,
          manager_id: data.manager_id,
          publicKey
        });
      console.log(response);
    } catch (e) {
      throw new Error((e as Error).toString());
    }
    setLoading(true);
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
              render={({}) => {
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
              render={({}) => {
                return (
                  <FormItem>
                    <FormLabel>Manager ID</FormLabel>
                    <FormControl>
                      <Input
                        {...form.register("manager_id")}
                        placeholder="Manager ID"
                        type="number"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                );
              }}
            />

            {/* Password */}
            <FormField
              control={form.control}
              name="password"
              render={({}) => {
                return (
                  <FormItem>
                    <FormLabel>Password</FormLabel>
                    <FormControl>
                      <Input
                        {...form.register("password")}
                        placeholder="Password"
                        type="password"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                );
              }}
            />

              <div>
                  <WalletMultiButton />
              </div> 
            <FormControl>
              <Button type="submit">Login</Button>
            </FormControl>
          </form>
        </FormProvider>
      </div>
    </div>
  );
}

export default LoginPage;
