'use client';

import { ArrowLeft, ArrowRight, RotateCw, Plus, Grid, Search } from 'lucide-react';
import { TabsBar } from './BrowserTabs/TabsBar';
import { useState, useEffect } from 'react';
import { ReactNode } from 'react';

interface NavigationBarProps {
  url: string;
  setUrl: (url: string) => void;
  onSubmit: (e: React.FormEvent) => void;
  onBack: () => void;
  onForward: () => void;
  onReload: () => void;
  canGoBack: boolean;
  canGoForward: boolean;
  activeTab: string;
  onTabChange: (tabId: string) => void;
  tabs: Tab[];
  setTabs: (tabs: Tab[]) => void;
}

interface Tab {
  id: string;
  title: string;
  icon: ReactNode;
  url: string;
}

export function NavigationBar({
  url,
  setUrl,
  onSubmit,
  onBack,
  onForward,
  onReload,
  canGoBack,
  canGoForward,
  activeTab,
  onTabChange,
  tabs,
  setTabs,
}: NavigationBarProps) {
  const generateUniqueTabId = () => {
    return `tab-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  };

  const handleNewTab = () => {
    const newTab = {
      id: generateUniqueTabId(),
      title: 'Speed Dial',
      icon: <Grid size={14} className="text-gray-400" />,
      url: ''
    };
    setTabs([...tabs, newTab]);
    onTabChange(newTab.id);
  };

  const handleCloseTab = (tabId: string) => {
      if (tabs.length > 1) {
        const newTabs = tabs.filter(tab => tab.id !== tabId);
        setTabs(newTabs);
        
        if (activeTab === tabId) {
          const index = tabs.findIndex(tab => tab.id === tabId);
          const newActiveTab = tabs[Math.max(0, index - 1)].id;
          onTabChange(newActiveTab);
        }
      }
    };
  
    return (
      <div className="flex flex-col gap-2">
        <TabsBar
          tabs={tabs}
          activeTab={activeTab}
          onTabChange={onTabChange}
          onNewTab={handleNewTab}
          onCloseTab={handleCloseTab}
        />
        
        {/* Rest of the navigation bar remains the same */}
      <div className="flex items-center h-10 bg-[#1e2235] rounded-md px-2 gap-1">
        <div className="flex items-center gap-1">
          <div
            onClick={!canGoBack ? undefined : onBack}
            className={`flex items-center justify-center w-8 h-8 text-gray-400 rounded-md ${!canGoBack ? 'opacity-40 cursor-not-allowed' : 'cursor-pointer hover:bg-[#3d4569]'}`}
          >
            <ArrowLeft size={17} />
          </div>
          <div
            onClick={!canGoForward ? undefined : onForward}
            className={`flex items-center justify-center w-8 h-8 text-gray-400 rounded-md ${!canGoForward ? 'opacity-40 cursor-not-allowed' : 'cursor-pointer hover:bg-[#3d4569]'}`}
          >
            <ArrowRight size={17} />
          </div>
          <div
            onClick={onReload}
            className="flex items-center justify-center w-8 h-8 text-white cursor-pointer  hover:bg-[#3d4569] rounded-md"
          >
            <RotateCw size={17} />
          </div>
        </div>

        <form onSubmit={onSubmit} className="flex-1 flex items-center">
          <div className="relative flex-1 flex items-center">
            <input
              type="text"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="Enter search or web address"
              className="w-full h-8 pl-9 pr-2 text-[16px] bg-[#3d4569] text-white placeholder-white rounded-md focus:outline-none"
            />
            <Search size={17} className="absolute left-2 text-white" />
          </div>
        </form>
      </div>
    </div>
  );
}