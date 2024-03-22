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
const formSchema = z.object({
  username: z.string(),
  password: z.string(),
});

type Schema = z.infer<typeof formSchema>;

function LoginPage() {
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();
  const form = useForm<Schema>({
    resolver: zodResolver(formSchema),
  });

  const onSubmit = async (data: Schema) => {
    try {
      const response = await axios.post('/api/login', { username: data.username, password: data.password });
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
            {/* Username */}
            <FormField
              control={form.control}
              name="username"
              render={({}) => {
                return (
                  <FormItem>
                    <FormLabel>Username</FormLabel>
                    <FormControl>
                      <Input
                        {...form.register("username")}
                        placeholder="Username"
                        type="text"
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
