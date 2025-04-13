'use client';

import { useWallet } from '@solana/wallet-adapter-react';
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function Home() {
  const { connected } = useWallet();
  const router = useRouter();

  useEffect(() => {
    if (connected) {
      router.push('/browser');
    }
  }, [connected, router]);

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gray-900">
      <div className="text-center space-y-6">
        <h1 className="text-4xl font-bold text-white mb-8">
          Welcome to Plato Browser
        </h1>
        <p className="text-gray-400 max-w-md mx-auto">
          Connect your Solana wallet to start browsing the decentralized web
        </p>
        <WalletMultiButton className="!bg-purple-600 hover:!bg-purple-700 transition-all" />
      </div>
    </div>
  );
}
