"use client"
import { FC } from "react";
import { WalletMultiButton } from "@solana/wallet-adapter-react-ui";

export const AppBar: FC = () => {
  return (
    <div className="pt-5 mx-auto flex items-center justify-around">
      <span>Wallet-Adapter Example</span>
      <WalletMultiButton />
    </div>
  );
};
