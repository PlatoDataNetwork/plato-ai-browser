'use client';

import React, { FC } from 'react';
import Link from 'next/link';
import Image from 'next/image';

interface HeaderProps {
  onMenuToggle: () => void;
}

export const Header: FC<HeaderProps> = ({ onMenuToggle }) => {
  return (
    <header className="sticky top-0 left-0 right-0 z-50 flex items-center justify-between px-4 py-2 bg-[#0a0a0a] text-white">
      <div className="flex items-center gap-4">
        <button
          onClick={onMenuToggle}
          aria-label="Toggle menu"
        >
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path d="M3 6H21" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
            <path d="M3 12H21" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
            <path d="M3 18H21" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
          </svg>


        </button>

        <Link href="/" className="flex items-center space-x-2">
          <Image
            src="/plato_logo.png"
            alt="Plato AIStream"
            width={32}
            height={32}
            className="rounded-md"
          />
          <span className="text-lg font-medium text-white">Plato AiStream V2.1</span>
        </Link>
      </div>

      <nav className="flex items-center space-x-6">
        <Link href="/about" className="text-gray-300 hover:text-white transition-colors">
          About
        </Link>
        <Link href="/discover" className="text-gray-300 hover:text-white transition-colors">
          Discover
        </Link>
        <Link href="/openai" className="text-gray-300 hover:text-white transition-colors">
          OpenAI
        </Link>
        <Link href="/dalle" className="text-gray-300 hover:text-white transition-colors">
          DefiX
        </Link>
        <Link href="/features" className="text-gray-300 hover:text-white transition-colors">
          Features
        </Link>
        <Link href="/connect" className="text-gray-300 hover:text-white transition-colors">
          Connect
        </Link>

        <div>
          <Image
            src="/metamask.webp"
            alt="Plato AIStream"
            width={20}
            height={20}
          />
        </div>

        <div>
          <Image
            src="/WalletConnect.webp"
            alt="Plato AIStream"
            width={20}
            height={20}
          />
        </div>

        <div>
          <Image
            src="/solflare.png"
            alt="Plato AIStream"
            width={20}
            height={20}
          />
        </div>

      </nav>
    </header>
  );
};

export default Header;
