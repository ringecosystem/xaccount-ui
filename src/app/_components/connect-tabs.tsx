'use client';

import { cn } from '@/lib/utils';
import { useState } from 'react';

const ConnectTabs = () => {
  const [activeTab, setActiveTab] = useState<'wallet' | 'iframe'>('wallet');

  return (
    <div className="flex items-center justify-center rounded-[8px]">
      <button
        onClick={() => setActiveTab('wallet')}
        className={cn(
          'h-[40px] w-[150px] appearance-none rounded-l-[8px] border text-[14px] font-extrabold leading-normal',
          'transition-all duration-200 ease-in-out hover:bg-[#F6F1E8]/5',
          activeTab === 'wallet'
            ? 'border-[#F6F1E8] text-[#F6F1E8]'
            : 'border-[#F6F1E8]/50 text-[#F6F1E8]/70'
        )}
      >
        Wallet Connect
      </button>
      <button
        onClick={() => setActiveTab('iframe')}
        className={cn(
          'h-[40px] w-[150px] appearance-none rounded-r-[8px] border text-[14px] font-extrabold leading-normal',
          'transition-all duration-200 ease-in-out hover:bg-[#F6F1E8]/5',
          activeTab === 'iframe'
            ? 'border-[#F6F1E8] text-white'
            : 'border-[#F6F1E8]/50 text-[#F6F1E8]/70'
        )}
      >
        iFrame
      </button>
    </div>
  );
};

export default ConnectTabs;
