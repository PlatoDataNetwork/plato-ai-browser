import { Grid, Plus } from 'lucide-react';
import { Tab } from './Tab';

interface Tab {
  id: string;
  title: string;
  icon?: React.ReactNode;
}

interface TabsBarProps {
  tabs: Tab[];
  activeTab: string;
  onTabChange: (tabId: string) => void;
  onNewTab: () => void;
  onCloseTab: (tabId: string) => void;
}

export function TabsBar({ tabs, activeTab, onTabChange, onNewTab, onCloseTab }: TabsBarProps) {
  return (
    <div className="flex items-end h-8 relative">
      <div className="flex-1 overflow-x-auto scrollbar-none">
        <div className="flex items-end h-full gap-1 min-w-max">
          {tabs.map((tab, index) => (
            <Tab
              key={tab.id}
              title={tab.title}
              icon={tab.icon}
              isActive={activeTab === tab.id}
              isLast={index === tabs.length - 1}
              index={index}
              onClick={() => onTabChange(tab.id)}
              onClose={() => onCloseTab(tab.id)}
              isOnlyTab={tabs.length === 1}
            />
          ))}

        <div className="flex items-center h-8">
            <div
            onClick={onNewTab}
            className="flex items-center justify-center w-6 h-6 bg-[#1e2235] rounded-full cursor-pointer hover:bg-[#3d4569]"
            >
            <Plus size={16} className="text-white" />
            </div>
        </div>

        </div>
      </div>
     
    </div>
  );
}