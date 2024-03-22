"use client"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import NavigationLink from "@/components/ui/navigation-link";
import { Medal, Star, CandlestickChart, KeyIcon,Heart, LibrarySquare, LogOut, PackageOpen, StoreIcon, UserIcon, Users} from "lucide-react";
import { signOut, useSession } from "next-auth/react";
import { ReactNode } from "react";
import DashboardTopBar from "./components/topbar";
import { QuestionMarkIcon } from "@radix-ui/react-icons";
import WalletContextProvider from "@/components/wallet/WalletContextProvider";

interface Props {
    children: ReactNode
}

export default function DashboardLayout(props: Props){
    const { children } = props 
    //const session = useSession()
    return (
            <div className="w-screen h-screen grid grid-cols-5 ">

                {/* Sidebar */}
                <div className="h-full flex flex-col items-center col-span-1 w-full gap-3 py-4 md:items-start md:justify-start md:p-6 bg-gradient-to-r from-sky-100 to-sky-400 ">
                     <div className="flex flex-row items-center justify-center py-5 w-full border-b-neutral-900 border-b-2">
                        <span
                            className="hidden md:inline text-lg "
                        >
                            <i>FPL MANTRA</i> 
                            
                        </span> 
                        <span className="block md:hidden text-center">FPL</span>
  <span className="inline md:hidden text-black-700"><Star/></span>
                    </div>

                    <NavigationLink
                        title={"My Profile"}
                        link="/dashboard"
                        icon={UserIcon} 
                    />
                                        
                    <NavigationLink
                        title={"My Leagues"}
                        link="/dashboard/store"
                        icon={Medal} 
                    />
                                       
                </div>
                <WalletContextProvider>
                {/* Main Content */}
                <div className="flex flex-col items-center justify-start col-span-4 w-full h-screen relative ">
                    {<DashboardTopBar/>}
                    <div className="flex flex-col pt-5 px-5 w-full h-full overflow-y-scroll">
                        
                        {children}
                    </div>
                </div>
                </WalletContextProvider>
            </div>

    )
}