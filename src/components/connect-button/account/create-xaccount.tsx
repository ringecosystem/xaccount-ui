import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ChainConfig } from '@/types/chains';

import {
  abi as PortRegistryProxyAbi,
  address as PortRegistryProxyAddress
} from '@/config/abi/PortRegistryProxy';
import {
  abi as xAccountFactoryAbi,
  address as xAccountFactoryAddress
} from '@/config/abi/xAccountFactory';
import { useReadContract, useWriteContract } from 'wagmi';
import { ethers } from 'ethers';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger
} from '@/components/ui/accordion';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';
import { Plus } from 'lucide-react';
import { Separator } from '@/components/ui/separator';

interface Props {
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  chain: ChainConfig | null;
}

export function CreateXAccount({ chain, open, onOpenChange }: Props) {
  const { writeContract, isError, isSuccess, isPending, failureReason } = useWriteContract();

  // const result = useReadContract({
  //   abi: PortRegistryProxyAbi,
  //   address: PortRegistryProxyAddress,
  //   functionName: 'get',
  //   args: [chain?.id, chain?.name]
  // });
  // 定义要编码的参数
  const param1 = 210000;
  const param2 = '0x3d6d656c1bf92f7028Ce4C352563E1C363C58ED5';

  const params = new ethers.AbiCoder().encode(['uint256', 'address'], [param1, param2]);
  console.log(params);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Create xAccount on {chain?.name}</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="flex flex-col gap-2">
            <Label htmlFor="recovery" className="mb-2 font-bold">
              Recovery account:
            </Label>
            <Input id="recovery" placeholder="0x..." />
            <p className="text-sm text-muted-foreground">
              Recovery account is ... Leave it blank to create an unrecoverable xAccount
            </p>
          </div>
          {/* <Separator /> */}

          <Accordion type="single" collapsible className="w-full" defaultValue="advanced">
            <AccordionItem value="advanced" className="border-none">
              <AccordionTrigger>
                <div className="flex items-center gap-1 font-bold">
                  <Plus width={18} height={18} />
                  Advanced
                </div>
              </AccordionTrigger>
              <AccordionContent className="mt-1">
                <div className="flex items-center gap-4 pr-1">
                  <Label>Msgport:</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Multiport" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup>
                        <SelectItem value="Multi">Multi</SelectItem>
                        <SelectItem value="ORMP">ORMP</SelectItem>
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                </div>
                <div className="pr-1">
                  <Label>Params</Label>
                  <div className="space-y-2 pl-8">
                    <div className="flex items-center gap-2">
                      <Label className="w-20 flex-shrink-0">gas limit:</Label>
                      <Input placeholder="200000"></Input>
                    </div>
                    <div className="flex items-center gap-2">
                      <Label className="w-20 flex-shrink-0">refund:</Label>
                      <Input placeholder="0x..."></Input>
                    </div>
                  </div>
                </div>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>
        <DialogFooter className="flex items-center gap-2">
          <Button
            size="lg"
            type="submit"
            variant="secondary"
            className="w-full"
            disabled
            onClick={() =>
              writeContract({
                abi: xAccountFactoryAbi,
                address: xAccountFactoryAddress,
                functionName: 'xCreate',
                args: ['Multi', chain?.id, params, '0x3d6d656c1bf92f7028Ce4C352563E1C363C58ED5']
              })
            }
          >
            {/* Create */}
            🚧 Coming Soon
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
