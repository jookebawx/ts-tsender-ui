"use client"

import {getDefaultConfig} from "@rainbow-me/rainbowkit";
import { anvil, sepolia, zksync } from "wagmi/chains";

export default getDefaultConfig({
    appName: "TSender",
    projectId: process.env.NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID!,
    chains: [anvil, zksync, sepolia],
    ssr: false,
});