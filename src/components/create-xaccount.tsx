'use client';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useWriteContract } from 'wagmi';
import { Interface } from 'ethers';
import { Plus } from 'lucide-react';
import { isAddress } from 'viem';
import { useForm } from 'react-hook-form';
import { useCallback, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';

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
import { Separator } from '@/components/ui/separator';
import { getCrossChainFee } from '@/server/gaslimit';
import { RemoteChain } from '@/store/chain';
import {
  abi as xAccountFactoryAbi,
  address as xAccountFactoryAddress
} from '@/config/abi/xAccountFactory';
import { Skeleton } from '@/components/ui/skeleton';
import { useTransactionStore } from '@/store/transaction';
import { useXAccountsStore } from '@/store/xaccounts';
import { TransactionStatus } from '@/config/transaction';
import { APP_NAME } from '@/config/site';
import { MSG_PORT_OPTIONS, MsgPort } from '@/config/msg-port';

const iface = new Interface(xAccountFactoryAbi);

const functionFragment = iface.getFunction('xDeploy');

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
  msgPort: z.enum([MsgPort.ORMP_U, MsgPort.Multi])
});

interface Props {
  open?: boolean;
  fromChainId?: number;
  fromAddress?: string;
  toChain: RemoteChain | null;
  onOpenChange?: (open: boolean) => void;
}

function CreateXAccount({ fromChainId, fromAddress, toChain, open, onOpenChange }: Props) {
  const updateAccount = useXAccountsStore((state) => state.updateAccount);
  const addTransaction = useTransactionStore((state) => state.addTransaction);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      recoveryAccount: fromAddress,
      refund: fromAddress,
      msgPort: MsgPort.ORMP_U
    }
  });
  useEffect(() => {
    form.reset({
      recoveryAccount: fromAddress,
      refund: fromAddress,
      msgPort: form.getValues('msgPort')
    });
  }, [fromAddress, form]);

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

  const { writeContractAsync, isPending } = useWriteContract();

  const handleFormSubmit = useCallback(
    (data: z.infer<typeof formSchema>) => {
      if (
        typeof toChain?.id !== 'undefined' &&
        typeof crossChainFeeData?.data?.params !== 'undefined' &&
        typeof fromAddress !== 'undefined'
      ) {
        writeContractAsync({
          abi: xAccountFactoryAbi,
          address: xAccountFactoryAddress,
          functionName: 'xCreate',
          args: [
            data?.msgPort,
            toChain?.id ? BigInt(toChain?.id) : 0n,
            crossChainFeeData?.data?.params,
            (data?.recoveryAccount || fromAddress) as `0x${string}`
          ],
          value: crossChainFeeData?.data?.fee ? BigInt(crossChainFeeData?.data?.fee) : 0n
        })?.then((hash) => {
          onOpenChange?.(false);
          if (fromChainId) {
            updateAccount(
              {
                localChainId: fromChainId,
                localAddress: fromAddress as `0x${string}`,
                remoteChainId: toChain?.id
              },
              {
                safeAddress: toChain?.safeAddress as `0x${string}`,
                moduleAddress: toChain?.moduleAddress as `0x${string}`,
                status: 'pending',
                transactionHash: hash
              }
            );
            addTransaction({
              hash: hash,
              chainId: fromChainId as number,
              address: fromAddress as `0x${string}`,
              targetChainId: toChain?.id,
              status: TransactionStatus.ProcessingOnLocal
            });
          }
        });
      }
    },
    [
      toChain,
      crossChainFeeData?.data,
      fromChainId,
      fromAddress,
      addTransaction,
      writeContractAsync,
      onOpenChange,
      updateAccount
    ]
  );

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>
            Create {APP_NAME} on {toChain?.name}
          </DialogTitle>
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
                              {Array.from(MSG_PORT_OPTIONS.entries()).map(([value, label]) => (
                                <SelectItem key={value} value={value}>
                                  {label}
                                </SelectItem>
                              ))}
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
                            <Input placeholder="0x..." {...field} autoComplete="off" />
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
                  <Skeleton className="h-8 w-full" />
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
                  <Skeleton className="h-8 w-full" />
                ) : (
                  <Input value={(crossChainFeeData?.data?.fee || 0)?.toLocaleString()} disabled />
                )}
              </div>
            </div>

            <Button
              size="lg"
              type="submit"
              className="w-full rounded-xl"
              disabled={
                isLoading || !crossChainFeeData?.data?.fee || !crossChainFeeData?.data?.params
              }
              isLoading={isPending}
            >
              {isLoading ? <span className=" animate-pulse">Create</span> : 'Create'}
            </Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}

export default CreateXAccount;
