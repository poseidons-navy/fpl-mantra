"use client";
import { NextPage } from "next";
import WalletContextProvider from "./wallet/WalletContextProvider";
import { AppBar } from "./components/appbar";
import CreateLeague from "./components/createleague";
const Home: NextPage = () => {
  console.log("Home called");
  return (
    <div>
      <WalletContextProvider>
        <AppBar />
        
        <CreateLeague />
      </WalletContextProvider>
    </div>
  );
};

export default Home;
