'use client';

import { useWallet } from '@solana/wallet-adapter-react';
import { useWalletModal } from '@solana/wallet-adapter-react-ui';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';

const wallets = [
  {
    id: 'metamask',
    name: 'MetaMask',
    icon: '/metamask.webp',
  },
  {
    id: 'walletconnect',
    name: 'WalletConnect',
    icon: '/WalletConnect.webp',
  },
  {
    id: 'solflare',
    name: 'Solflare',
    icon: '/solflare.png',
  }
];

export default function Home() {
  const { connected } = useWallet();
  const { setVisible } = useWalletModal();
  const [showWalletModal, setShowWalletModal] = useState(true);
  const router = useRouter();

  useEffect(() => {
    if (connected) {
      router.push('/browser');
    }
  }, [connected, router]);

  const handleWalletClick = (walletId: string) => {
    // For Solana wallets, we'll just open the modal
    setVisible(true);
  };

  return (
    <div className="flex h-full">
      {/* Left side content */}
      <div className="flex-1 flex flex-col justify-center px-8 md:px-16 lg:px-24">
        <h1 className="text-6xl font-bold text-white mb-4">
          You will need a <span className="text-[#04a1ff]">Wallet</span> on Solana to use this app.
        </h1>
      </div>

      {/* Right side wallet connection */}
      <div className="flex-1 flex items-center justify-center relative">
        <div className="bg-[#0a0a0a] rounded-lg p-6 w-full max-w-md">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-semibold text-white">Connect a wallet</h2>
            <button 
              onClick={() => setShowWalletModal(false)}
              className="text-gray-400 hover:text-white"
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M18 6L6 18M6 6l12 12" />
              </svg>
            </button>
          </div>
          
          <div className="space-y-3">
            {wallets.map((wallet) => (
              <button
                key={wallet.id}
                className="w-full flex items-center justify-between p-3 rounded-lg bg-[#000] hover:bg-[#0a0a0a] transition-colors"
                onClick={() => handleWalletClick(wallet.id)}
              >
                <div className="flex items-center gap-3">
                  <Image
                    src={wallet.icon}
                    alt={wallet.name}
                    width={24}
                    height={24}
                    className="rounded-full"
                  />
                  <span className="text-white">{wallet.name}</span>
                </div>
                <svg 
                  className="w-5 h-5 text-gray-400" 
                  viewBox="0 0 20 20" 
                  fill="currentColor"
                >
                  <path 
                    fillRule="evenodd" 
                    d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" 
                    clipRule="evenodd" 
                  />
                </svg>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
