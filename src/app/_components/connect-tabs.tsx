'use client';

import { cn } from '@/lib/utils';

const ConnectTabs = ({
  activeTab,
  onTabChange,
  children
}: {
  activeTab: 'wallet' | 'iframe';
  onTabChange: (tab: 'wallet' | 'iframe') => void;
  children: React.ReactNode;
}) => {
  return (
    <div className="flex flex-col gap-[20px]">
      <div className="flex items-center justify-center rounded-[8px]">
        <button
          onClick={() => onTabChange('wallet')}
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
          onClick={() => onTabChange('iframe')}
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

      {children}
    </div>
  );
};

export default ConnectTabs;
