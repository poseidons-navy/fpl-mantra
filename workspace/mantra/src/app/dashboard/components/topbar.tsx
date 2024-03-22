/* eslint-disable react/jsx-no-duplicate-props */
"use client";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import clsx from "clsx";
import { LogOut } from "lucide-react";
import { signOut, useSession } from "next-auth/react";
import React, { useEffect, useState } from "react";
import { WalletMultiButton } from "@solana/wallet-adapter-react-ui";
// import {AppContext} from '@/app/app-context'
// import { truncateString } from '@/app/helpers/truncate_string'
//import { LocalStorageKeys } from '@/app/helpers/local_storage_keys'
import { useRouter } from "next/navigation";

function DashboardTopBar() {
  //const session = useSession()
  const router = useRouter();
  //const app_context = useContext(AppContext);
  //const address = localStorage.getItem(LocalStorageKeys.USER_ADDRESS);
  return (
    <div
      className={clsx(
        "flex flex-row items-center justify-between w-full border-b-[1px] border-b-neutral-50  px-5 py-5 bg-gradient-to-r from-sky-400 to-sky-100"
      )}
    >
      <div className="flex flex-row items-center justify-start w-full space-x-2">
        <Avatar>
          <AvatarImage
          //src={session?.data?.user?.image}
          />
          <AvatarFallback>{/*session?.data?.user?.username*/}</AvatarFallback>
        </Avatar>
        <span className="text-md opacity-70 ">
          <WalletMultiButton />
          {/*session?.data?.user?.username*/}
        </span>
      </div>

      <div className="flex flex-row items-center justify-center cursor-pointer hover:bg-neutral-400 group p-2 rounded-full">
        <p>{/*address ?? ""*/}</p>
        <LogOut
          className="group-hover:text-neutral-100"
          onClick={() => {
            //localStorage.removeItem(LocalStorageKeys.USER_ADDRESS);
            router.push("/");
          }}
          onClick={() =>
            signOut({
              callbackUrl: "/",
            })
          }
        />
      </div>
    </div>
  );
}

export default DashboardTopBar;
