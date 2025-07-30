"use client"
import HomeContent from "@/components/ui/HomeContent";
import {useAccount} from "wagmi";

export default function Home() {
  const { isConnected } = useAccount();
  return (
    <div>
      {!isConnected ? (
        <div>
          Please connect your wallet....
        </div>
      ) : (
        <div>
          <HomeContent />
        </div>
      )}
    </div>
  );
}
