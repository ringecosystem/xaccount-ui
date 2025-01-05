import { Select } from '@/components/select';
import { blo } from 'blo';
import { useCallback, useState } from 'react';
import { ActionPreview } from './action-preview';
import ConnectTabs from './connect-tabs';
import { ConnectURI } from './connect-uri';
import { ConnectIframe } from './connect-iframe';

const accountOptions = [
  {
    value: '0x3d6d656c1bf92f7028Ce4C352563E1C363C58ED5',
    label: '0x3d6d656c1bf92f7028Ce4C352563E1C363C58ED5',
    asset: blo('0x3d6d656c1bf92f7028Ce4C352563E1C363C58ED5')
  },
  {
    value: '0x11514D3FC3D75D3c6F600bac870B99656C5a5546',
    label: '0x11514D3FC3D75D3c6F600bac870B99656C5a5546',
    asset: blo('0x11514D3FC3D75D3c6F600bac870B99656C5a5546')
  }
];

export const GenerateAction = () => {
  const [activeTab, setActiveTab] = useState<'wallet' | 'iframe'>('wallet');
  const [targetAccount, setTargetAccount] = useState(accountOptions[0].value);
  const [value, setValue] = useState('');

  const handleTabChange = useCallback((tab: 'wallet' | 'iframe') => {
    setValue('');
    setActiveTab(tab);
  }, []);

  return (
    <div className="flex flex-col gap-[20px]">
      <div className="space-y-2">
        <label className="text-sm font-semibold leading-[150%] text-[#F6F1E8]/70">
          Corresponding XAccounts
        </label>
        <Select
          placeholder="Select account on target chain"
          options={accountOptions}
          value={targetAccount}
          onValueChange={setTargetAccount}
        />
      </div>

      {
        <>
          <ConnectTabs activeTab={activeTab} onTabChange={handleTabChange}>
            {activeTab === 'wallet' && (
              <ConnectURI targetAccount={targetAccount} value={value} onValueChange={setValue} />
            )}
            {activeTab === 'iframe' && (
              <ConnectIframe targetAccount={targetAccount} value={value} onValueChange={setValue} />
            )}
          </ConnectTabs>
        </>
      }

      <ActionPreview />
    </div>
  );
};
