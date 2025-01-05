'use client';

import { cn } from '@/lib/utils';
import { ConnectURI } from './connect-uri';
import { ConnectIframe } from './connect-iframe';

const ConnectTabs = ({
  activeTab,
  onTabChange,
  disabled,
  value,
  onValueChange,
  errorMessage
}: {
  activeTab: 'wallet' | 'iframe';
  onTabChange: (tab: 'wallet' | 'iframe') => void;
  disabled?: boolean;
  value: string;
  onValueChange: (value: string) => void;
  errorMessage?: string;
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
      {activeTab === 'wallet' && (
        <ConnectURI
          value={value}
          onValueChange={onValueChange}
          disabled={disabled}
          errorMessage={errorMessage}
        />
      )}
      {activeTab === 'iframe' && <ConnectIframe value={value} onValueChange={onValueChange} />}
    </div>
  );
};

export default ConnectTabs;
