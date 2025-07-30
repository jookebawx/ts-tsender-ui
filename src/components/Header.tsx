// components/Header.tsx

import { ConnectButton } from "@rainbow-me/rainbowkit";
import { FaGithub } from "react-icons/fa";

export default function Header() {
  return (
    <header className="w-full flex items-center justify-between p-4 shadow-md bg-white">
      <div className="flex items-center gap-4">
        <h1 className="text-xl font-bold text-black">tsender</h1>
        <a
          href="https://github.com/jookebawx"
          target="_blank"
          rel="noopener noreferrer"
          className="text-gray-700 hover:text-black transition-colors"
        >
          <FaGithub size={24} />
        </a>
      </div>
      <div>
        <ConnectButton />
      </div>
    </header>
  );
}
