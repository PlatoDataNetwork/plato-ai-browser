'use client';

import { useState } from "react";
import { WalletContextProvider } from '@/components/WalletProvider';
import Header from '@/components/Header';
import Sidebar from '@/components/Sidebar';

interface LayoutContentProps {
  children: React.ReactNode;
  geistSans: string;
  geistMono: string;
}

export default function LayoutContent({ children, geistSans, geistMono }: LayoutContentProps) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const handleMenuToggle = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <body className={`${geistSans} ${geistMono} antialiased h-screen flex flex-col overflow-hidden`}>
      <WalletContextProvider>
        <Header onMenuToggle={handleMenuToggle} />
        <div className="h-[calc(100vh-52px)] flex overflow-hidden">
          <div 
            className={`${
              isSidebarOpen ? 'w-64' : 'w-0'
            } flex-shrink-0 bg-[#0a0a0a] transition-[width] duration-300 ease-in-out overflow-hidden`}
          >
            <div className="w-64 h-full overflow-y-auto scrollbar-hide">
              <Sidebar isOpen={isSidebarOpen} />
            </div>
          </div>
          <main 
            className={`
              flex-1 h-full overflow-y-auto scrollbar-hide
              border-t border-[#242424]
              ${isSidebarOpen ? 'border-l border-[#242424] rounded-tl-[10px]' : ''}
            `}
          >
            <div className="h-full">
              {children}
            </div>
          </main>
        </div>
      </WalletContextProvider>
    </body>
  );
}