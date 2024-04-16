'use client';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

import { useWriteContract } from 'wagmi';
import { Interface } from 'ethers';
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
import { isAddress } from 'viem';
import { useForm } from 'react-hook-form';
import { useCallback } from 'react';
import { Separator } from '@/components/ui/separator';
import { getCrossChainFee } from '@/server/gaslimit';
import { useQuery } from '@tanstack/react-query';
import useChainStore, { RemoteChain } from '@/store/chain';
import {
  abi as xAccountFactoryAbi,
  address as xAccountFactoryAddress
} from '@/config/abi/xAccountFactory';
import { Skeleton } from '@/components/ui/skeleton';
import { useTransactionStatus } from '@/hooks/useTransactionStatus';
import { updateXAccountStatusByFromChainIdAndToChainIdAndFromAddress } from '@/database/xaccounts';

const iface = new Interface(xAccountFactoryAbi);

// 尝试获取函数定义
const functionFragment = iface.getFunction('xDeploy');

// 定义Zod验证模式
const formSchema = z.object({
  recoveryAccount: z
    .string()
    .optional()
    .refine(
      (data) => {
        if (!data || data === '0x0000000000000000000000000000000000000000') return true;
        return isAddress(data);
      },
      {
        message: 'Recovery account must be a valid Ethereum address or left blank'
      }
    ),
  refund: z.string().refine(
    (data) => {
      if (data === '0x0' || data === '') return true;
      return isAddress(data);
    },
    {
      message: 'Refund address must be a valid Ethereum address or left blank'
    }
  ),
  msgPort: z.enum(['ORMP', 'Multi'])
});

interface Props {
  open?: boolean;
  fromChainId?: number;
  fromAddress?: string;
  toChain: RemoteChain | null;
  onOpenChange?: (open: boolean) => void;
  onFinish?: (data: z.infer<typeof formSchema>) => void;
}

export function CreateXAccount({
  fromChainId,
  fromAddress,
  toChain,
  open,
  onOpenChange,
  onFinish
}: Props) {
  const setRemoteChain = useChainStore((state) => state.setRemoteChain);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      recoveryAccount: '',
      refund: '',
      msgPort: 'ORMP'
    }
  });

  const watchRefundAddress = form.watch('refund') || fromAddress || '0x';
  const msgPort = form.watch('msgPort');

  const encoded = functionFragment
    ? iface.encodeFunctionData(functionFragment, [fromAddress, fromAddress])
    : '0x';

  const { data: crossChainFeeData, isLoading } = useQuery({
    queryKey: [
      'crossChainFee',
      fromChainId,
      toChain?.id,
      xAccountFactoryAddress,
      xAccountFactoryAddress,
      encoded,
      watchRefundAddress,
      msgPort
    ],
    enabled:
      open &&
      !!fromChainId &&
      !!toChain?.id &&
      !!fromAddress &&
      !!toChain?.safeAddress &&
      encoded !== '0x' &&
      isAddress(watchRefundAddress) &&
      !!msgPort,
    queryFn: () =>
      getCrossChainFee({
        fromChainId: fromChainId,
        toChainId: toChain?.id,
        fromAddress: xAccountFactoryAddress,
        toAddress: xAccountFactoryAddress,
        payload: encoded,
        refundAddress: watchRefundAddress
      })
  });

  const { writeContractAsync, isPending, data: hash } = useWriteContract();

  const { isLoading: isClaimTransactionConfirming } = useTransactionStatus({
    hash,
    onSuccess: () => {
      onOpenChange?.(false);
    }
  });

  const handleFormSubmit = useCallback(
    (data: z.infer<typeof formSchema>) => {
      if (
        typeof toChain?.id !== 'undefined' &&
        typeof crossChainFeeData?.data?.params !== 'undefined' &&
        typeof fromAddress !== 'undefined'
      )
        writeContractAsync({
          abi: xAccountFactoryAbi,
          address: xAccountFactoryAddress,
          functionName: 'xCreate',
          args: [
            data?.msgPort,
            toChain?.id ? BigInt(toChain?.id) : 0n,
            crossChainFeeData?.data?.params as any,
            (data?.recoveryAccount || fromAddress) as `0x${string}`
          ],
          value: crossChainFeeData?.data?.fee ? BigInt(crossChainFeeData?.data?.fee) : 0n
        })?.then(() => {
          fromChainId &&
            updateXAccountStatusByFromChainIdAndToChainIdAndFromAddress({
              fromChainId: fromChainId,
              toChainId: toChain?.id,
              fromAddress: fromAddress,
              status: 'pending'
            });
        });
    },
    [toChain, crossChainFeeData?.data, fromChainId, fromAddress, writeContractAsync]
  );

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Create xAccount on {toChain?.name}</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleFormSubmit)} className="grid gap-4 py-4">
            <FormField
              control={form.control}
              name="recoveryAccount"
              render={({ field }) => (
                <FormItem className="pr-1">
                  <FormLabel>Recovery account</FormLabel>
                  <FormControl>
                    <Input placeholder="0x...." autoComplete="off" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Accordion type="single" collapsible className="w-full" defaultValue="advanced">
              <AccordionItem value="advanced" className="border-none">
                <AccordionTrigger>
                  <div className="flex items-center gap-1 font-bold">
                    <Plus width={18} height={18} />
                    Advanced
                  </div>
                </AccordionTrigger>
                <AccordionContent className=" space-y-2 pl-8">
                  <FormField
                    control={form.control}
                    name="msgPort"
                    render={({ field }) => (
                      <FormItem className="flex items-center gap-2 pr-1">
                        <FormLabel className="w-20">Name</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Multiport" />
                            </SelectTrigger>
                          </FormControl>

                          <SelectContent>
                            <SelectGroup>
                              <SelectItem value="ORMP">ORMP</SelectItem>
                              <SelectItem value="Multi">Multi</SelectItem>
                            </SelectGroup>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="refund"
                    render={({ field }) => (
                      <FormItem>
                        <div className="flex items-center gap-2 pr-1">
                          <FormLabel className="w-20">refund</FormLabel>
                          <FormControl>
                            <Input placeholder="0x..." {...field} />
                          </FormControl>
                        </div>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </AccordionContent>
              </AccordionItem>
            </Accordion>
            <Separator />
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Label className="w-20 text-sm capitalize text-muted-foreground">gas limit</Label>
                {isLoading ? (
                  <Skeleton className="h-9 w-full" />
                ) : (
                  <Input
                    value={(crossChainFeeData?.data?.gas?.total || 0)?.toLocaleString()}
                    disabled
                  />
                )}
              </div>
              <div className="flex items-center gap-2">
                <Label className="w-20 text-sm capitalize text-muted-foreground">fee</Label>
                {isLoading ? (
                  <Skeleton className="h-9 w-full" />
                ) : (
                  <Input value={(crossChainFeeData?.data?.fee || 0)?.toLocaleString()} disabled />
                )}
              </div>
            </div>

            <Button
              size="lg"
              type="submit"
              className="w-full"
              isLoading={isPending || isClaimTransactionConfirming}
            >
              Create
            </Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
