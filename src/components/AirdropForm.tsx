"use client"

import InputField from "./ui/InputField"
import { useState, useMemo, useEffect } from "react"
import { chainsToTSender, tsenderAbi, erc20Abi } from "@/constants";
import { useChainId, useConfig, useAccount, useWriteContract } from "wagmi"
import { readContract, waitForTransactionReceipt } from "@wagmi/core";
import { calculateTotal } from "@/utils/calculateTotal/calculateTotal";
import { write } from "fs";


export default function AirdropForm() {
    const TOKEN_KEY = "tsender_token_address";
    const RECIPIENTS_KEY = "tsender_recipients";
    const AMOUNT_KEY = "tsender_amount";

    const [tokenAddress, setTokenAddress] = useState("");
    const [recipients, setRecipients] = useState("");
    const [amount, setAmount] = useState("");

    useEffect(() => {
        if (typeof window !== "undefined") {
            setTokenAddress(localStorage.getItem(TOKEN_KEY) || "");
            setRecipients(localStorage.getItem(RECIPIENTS_KEY) || "");
            setAmount(localStorage.getItem(AMOUNT_KEY) || "");
        }
    }, []);
    
    const [tokenName, setTokenName] = useState<string | null>(null);
    const [tokenSymbol, setTokenSymbol] = useState<string | null>(null);
    const [tokenDecimals, setTokenDecimals] = useState<number | null>(null);

    const chainId = useChainId()
    const config = useConfig()
    const account = useAccount()
    const total: number = useMemo(() => calculateTotal(amount), [amount])
    const { data: hash, isPending, writeContractAsync } = useWriteContract()
    const [isLoading, setIsLoading] = useState(false);

    const amountInUnits = useMemo(() => {
        if (tokenDecimals === null) return "N/A";
        const factor = 10 ** tokenDecimals;
        return (total / factor).toFixed(tokenDecimals);
    }, [total, tokenDecimals]);

    useEffect(() => {
        localStorage.setItem(TOKEN_KEY, tokenAddress);
    }, [tokenAddress]);

    useEffect(() => {
        localStorage.setItem(RECIPIENTS_KEY, recipients);
    }, [recipients]);

    useEffect(() => {
        localStorage.setItem(AMOUNT_KEY, amount);
    }, [amount]);

    useEffect(() => {
        const fetchTokenDetails = async () => {
            if (!tokenAddress || tokenAddress.length !== 42) {
                setTokenName(null);
                setTokenSymbol(null);
                setTokenDecimals(null);
                return;
            }

            try {
                const [name, symbol, decimals] = await Promise.all([
                    readContract(config, {
                        abi: erc20Abi,
                        address: tokenAddress as `0x${string}`,
                        functionName: "name",
                    }),
                    readContract(config, {
                        abi: erc20Abi,
                        address: tokenAddress as `0x${string}`,
                        functionName: "symbol",
                    }),
                    readContract(config, {
                        abi: erc20Abi,
                        address: tokenAddress as `0x${string}`,
                        functionName: "decimals",
                    }),
                ]);

                setTokenName(name as string);
                setTokenSymbol(symbol as string);
                setTokenDecimals(Number(decimals));
            } catch (err) {
                console.warn("Could not fetch token info:", err);
                setTokenName(null);
                setTokenSymbol(null);
                setTokenDecimals(null);
            }
        };

        fetchTokenDetails();
    }, [tokenAddress]);


    async function getApprovedAmount(tSenderAddress: string | null): Promise<number> {
        if (!tSenderAddress) {
            alert("TSender address not found for the current chain.");
            return 0;
        }

        // Interact with the TSender contract to get the approved amount
        const response = await readContract(config, {
            abi: erc20Abi,
            address: tokenAddress as `0x${string}`,
            functionName: "allowance",
            args: [account.address, tSenderAddress as `0x${string}`],
        });

        return response as number;
    }

    async function handleSubmit() {
        if (isLoading) return;

        setIsLoading(true);
        try {
            const tSenderAddress = chainsToTSender[chainId]["tsender"];
            const approvedAmount = await getApprovedAmount(tSenderAddress);

            const amountList = amount
                .split("\n")
                .map(a => a.trim())
                .filter(Boolean)
                .map(BigInt);

            const recipientList = recipients
                .split("\n")
                .map(r => r.trim())
                .filter(Boolean) as `0x${string}`[];

            const airdropArgs = [
                tokenAddress,
                recipientList,
                amountList,
                BigInt(total),
            ] as const;

            if (approvedAmount < total) {
                const approvalHash = await writeContractAsync({
                    abi: erc20Abi,
                    address: tokenAddress as `0x${string}`,
                    functionName: "approve",
                    args: [tSenderAddress as `0x${string}`, BigInt(total)],
                });

                await waitForTransactionReceipt(config, { hash: approvalHash });
            }

            await writeContractAsync({
                abi: tsenderAbi,
                address: tSenderAddress as `0x${string}`,
                functionName: "airdropERC20",
                args: airdropArgs,
            });
        } catch (err) {
            console.error("Airdrop failed:", err);
            // You might want to show toast or UI feedback here
        } finally {
            setIsLoading(false);
        }
    }


    return (
        <div>
            <InputField label="Token Address" placeholder="0x..." value={tokenAddress} onChange={e => setTokenAddress(e.target.value)} />
            <InputField label="Recipients" placeholder="0x123..,0x456..." value={recipients} onChange={e => setRecipients(e.target.value)} large={true} />
            <InputField label="Amount" placeholder="100,200,300...(in wei)" value={amount} onChange={e => setAmount(e.target.value)} large={true} />
            <button
                onClick={handleSubmit}
                disabled={isLoading}
                className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg shadow-md transition duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
                {isLoading ? (
                    <>
                        <svg
                            className="animate-spin h-5 w-5 text-white"
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                        >
                            <circle
                                className="opacity-25"
                                cx="12"
                                cy="12"
                                r="10"
                                stroke="currentColor"
                                strokeWidth="4"
                            ></circle>
                            <path
                                className="opacity-75"
                                fill="currentColor"
                                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                            ></path>
                        </svg>
                        Processing...
                    </>
                ) : (
                    "Airdrop"
                )}
            </button>

            {tokenName && tokenSymbol && tokenDecimals !== null && (
                <div className="mt-6 p-4 border border-gray-300 rounded-lg bg-gray-50 text-sm text-gray-700">
                    <div><strong>Token Name:</strong> {tokenName}</div>
                    <div><strong>Amount(wei):</strong> {amount}</div>
                    <div><strong>Amount:</strong> {amountInUnits} {tokenSymbol}</div>
                </div>
            )}


        </div>
    );
}
