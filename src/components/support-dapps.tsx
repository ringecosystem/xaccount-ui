import Image from 'next/image';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { SafeDappInfo } from '@/types/communicator';
import { useEffect, useState } from 'react';
import { Search } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';

interface DappCardProps {
  dapp: SafeDappInfo;
  onSelect: (dapp: SafeDappInfo) => void;
}

const DappCard = ({ dapp, onSelect }: DappCardProps) => {
  return (
    <div
      className="flex h-full w-full cursor-pointer flex-col items-center justify-center space-y-2 rounded-lg p-4 transition-all duration-200 hover:scale-105 hover:opacity-80"
      onClick={() => onSelect(dapp)}
    >
      <Image
        src={dapp.iconUrl}
        alt={`${dapp.name} logo`}
        className="h-12 w-12 object-contain"
        width={48}
        height={48}
      />
      <span className="text-center text-sm font-medium">{dapp.name}</span>
    </div>
  );
};

const DappCardSkeleton = () => {
  return (
    <div className="flex h-full w-full flex-col items-center justify-center space-y-2 rounded-lg p-4">
      <Skeleton className="h-12 w-12 rounded-[8px]" />
      <Skeleton className="h-4 w-20 rounded-[8px]" />
    </div>
  );
};

export function SupportDapps({
  networkId,
  open,
  onOpenChange,
  onSelect
}: {
  networkId: number;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSelect: (dapp: SafeDappInfo) => void;
}) {
  const [searchQuery, setSearchQuery] = useState('');
  const [safeDapps, setSafeDapps] = useState<Record<number, SafeDappInfo[]>>({});
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchSafeDapps = async (networkId: number) => {
      setIsLoading(true);
      try {
        const response = await fetch(
          `https://safe-client.safe.global/v1/chains/${networkId}/safe-apps`,
          {
            cache: 'no-store'
          }
        );
        const data = await response.json();
        setSafeDapps((dapps) => ({
          ...dapps,
          [networkId]: data.filter((d: any) => ![29, 11].includes(d.id))
        }));
      } catch (error) {
        console.error('Failed to fetch dapps:', error);
      } finally {
        setIsLoading(false);
      }
    };

    if (open && !safeDapps[networkId]) {
      fetchSafeDapps(networkId);
    }
  }, [open, safeDapps, networkId]);

  const filteredDapps =
    safeDapps[networkId]?.filter((dapp) =>
      dapp.name.toLowerCase().includes(searchQuery.toLowerCase())
    ) || [];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[80vh] min-h-[300px] overflow-y-auto overflow-x-hidden sm:max-w-[800px]">
        <DialogHeader>
          <DialogTitle>Select a dapp</DialogTitle>
        </DialogHeader>

        <div className="px-6">
          <div className="relative mb-4">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 transform text-gray-500" />
            <Input
              placeholder="Search dapps..."
              className="pl-10"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          <div className="min-h-[200px] overflow-y-auto overflow-x-hidden">
            <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
              {isLoading ? (
                Array(8)
                  .fill(0)
                  .map((_, i) => <DappCardSkeleton key={i} />)
              ) : filteredDapps.length > 0 ? (
                filteredDapps.map((dapp) => (
                  <DappCard key={dapp.id} dapp={dapp} onSelect={onSelect} />
                ))
              ) : (
                <div className="col-span-full mt-8 text-center text-gray-500">No dapps found</div>
              )}
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
