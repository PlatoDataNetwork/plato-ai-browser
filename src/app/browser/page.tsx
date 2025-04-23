'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { useWallet } from '@solana/wallet-adapter-react';
import { useRouter } from 'next/navigation';
import { handleWalletMessage, WalletMessage } from '@/utils/walletBridge';
import { NavigationBar } from '@/components/NavigationBar';
import { ArrowLeft, ArrowRight, RotateCw } from 'lucide-react';
import { HomeContent } from '@/components/HomeContent';
import { Grid } from 'lucide-react';
import { ReactNode } from 'react';

interface Tab {
  id: string;
  title: string;
  icon: ReactNode;
  url: string;
}

export default function Browser() {
  const [tabs, setTabs] = useState<Tab[]>([
    {
      id: 'speedDial',
      title: 'Speed Dial',
      icon: <Grid size={14} className="text-gray-400" />,
      url: ''
    }
  ]);
  const [activeTab, setActiveTab] = useState('speedDial');
  
  const handleTabChange = (tabId: string) => {
    setActiveTab(tabId);
    const tab = tabs.find(t => t.id === tabId);
    const tabUrl = tab?.url || '';
    setCurrentUrl(tabUrl);
    setUrl(tabUrl); // Make sure URL input shows the current tab's URL
  };
  
  const [url, setUrl] = useState('');
  const [currentUrl, setCurrentUrl] = useState('');
  const [history, setHistory] = useState<string[]>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const { connected, publicKey, signTransaction, signMessage } = useWallet();
  const router = useRouter();

  const canGoBack = historyIndex > 0;
  const canGoForward = historyIndex < history.length - 1;

  const handleMessage = useCallback(async (event: MessageEvent) => {
    if (!event.data || typeof event.data !== 'object') return;

    const response = await handleWalletMessage(
      event.data as WalletMessage,
      publicKey,
      signTransaction,
      signMessage
    );

    event.source?.postMessage(response, { targetOrigin: '*' });
  }, [publicKey, signTransaction, signMessage]);

  useEffect(() => {
    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, [handleMessage]);

  const [isLoading, setIsLoading] = useState(false);

    const navigate = useCallback((newUrl: string) => {
      setIsLoading(true);
      const updatedTabs = tabs.map(tab => 
        tab.id === activeTab ? { 
          ...tab, 
          url: newUrl,
          icon: <RotateCw size={14} className="text-gray-400 animate-spin" />
        } : tab
      );
      setTabs(updatedTabs);
      setCurrentUrl(newUrl);
      setUrl(newUrl);
      setHistory(prev => [...prev.slice(0, historyIndex + 1), newUrl]);
      setHistoryIndex(prev => prev + 1);
    }, [historyIndex, activeTab, tabs]);
  
    const handleIframeLoad = useCallback(() => {
      if (iframeRef.current) {
        try {
          // Get page title from iframe
          const title = iframeRef.current.contentWindow?.document.title;
          const domain = new URL(currentUrl).hostname;
          const favicon = `https://www.google.com/s2/favicons?domain=${domain}&sz=32`;
  
          // Update tab information
          setTabs(prevTabs => prevTabs.map(tab => 
            tab.id === activeTab 
              ? { 
                  ...tab, 
                  title: title || domain,
                  icon: <img src={favicon} alt="" className="w-4 h-4" />
                } 
              : tab
          ));
          setIsLoading(false);
        } catch (error) {
          console.error('Error accessing iframe content:', error);
          // Set fallback title and icon on error
          const domain = new URL(currentUrl).hostname;
          setTabs(prevTabs => prevTabs.map(tab => 
            tab.id === activeTab 
              ? { 
                  ...tab, 
                  title: domain,
                  icon: <img src={`https://www.google.com/s2/favicons?domain=${domain}&sz=32`} alt="" className="w-4 h-4" />
                } 
              : tab
          ));
          setIsLoading(false);
        }
      }
    }, [activeTab, currentUrl]);
  
    const handleSubmit = (e: React.FormEvent) => {
      e.preventDefault();
      if (url) {
        const fullUrl = url.startsWith('http') ? url : `https://${url}`;
        navigate(fullUrl);
      }
    };
  
    const handleBack = () => {
      if (historyIndex > 0) {
        setHistoryIndex(prev => prev - 1);
        setCurrentUrl(history[historyIndex - 1]);
      }
    };
  
    const handleReload = () => {
      if (iframeRef.current) {
        iframeRef.current.src = currentUrl;
      }
    };
  
    const handleForward = () => {
      if (historyIndex < history.length - 1) {
        setHistoryIndex(prev => prev + 1);
        setCurrentUrl(history[historyIndex + 1]);
      }
    };

    return (
      <div className="flex flex-col gap-2 bg-[#030716] p-2 h-screen">
        {connected ? (
          <>
            <NavigationBar
              url={url}
              setUrl={setUrl}
              onSubmit={handleSubmit}
              onBack={handleBack}
              onForward={handleForward}
              onReload={handleReload}
              canGoBack={canGoBack}
              canGoForward={canGoForward}
              activeTab={activeTab}
              onTabChange={handleTabChange}
              tabs={tabs}
              setTabs={setTabs}
            />
            
            <div className="flex-1 relative">
              {currentUrl ? (
                <iframe
                  ref={iframeRef}
                  src={currentUrl}
                  className="absolute inset-0 w-full h-full bg-white"
                  sandbox="allow-same-origin allow-scripts allow-popups allow-forms"
                  onLoad={handleIframeLoad}
                />
              ) : (
                <HomeContent onNavigate={navigate} />
              )}
            </div>
          </>
        ) : null}
      </div>
    );
}