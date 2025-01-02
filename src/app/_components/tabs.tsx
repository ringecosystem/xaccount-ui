'use client';

import { cn } from '@/lib/utils';

const tabs = [
  {
    label: 'Create XAccount',
    value: 'create'
  },
  {
    label: 'Generate Action',
    value: 'generate'
  }
];

interface TabsProps {
  activeTab: 'create' | 'generate';
  setActiveTab: (tab: 'create' | 'generate') => void;
}

export const Tabs = ({ activeTab, setActiveTab }: TabsProps) => {
  return (
    <div className="flex h-[50px] items-center justify-between rounded-[8px] border border-[#F6F1E8]/50">
      {tabs.map((tab, index) => (
        <h3
          key={tab.value}
          className={cn(
            'flex h-[50px] w-1/2 cursor-pointer items-center justify-center text-[14px] font-extrabold leading-normal text-[#F6F1E8] transition-all duration-300 hover:opacity-80',
            activeTab === tab.value ? 'bg-[#F6F1E8] text-[#1F1A1A]' : '',
            index === 0 ? 'rounded-l-[8px]' : 'rounded-r-[8px]'
          )}
          onClick={() => setActiveTab(tab.value as 'create' | 'generate')}
        >
          {tab.label}
        </h3>
      ))}
    </div>
  );
};
