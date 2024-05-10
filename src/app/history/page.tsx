'use client';
import { ScrollArea } from '@/components/ui/scroll-area';
import Spin from '@/components/ui/spin';
import { useEffect, useState } from 'react';
import TransactionCard from './components/history-item';
import { useInView } from 'react-intersection-observer';
import { Skeleton } from '@/components/ui/skeleton';
import { Card, CardContent } from '@/components/ui/card';
import { Package2 } from 'lucide-react';
import { cn } from '@/lib/utils';

const fetchData = (
  currentLength: number
): Promise<
  {
    status: 'completed' | 'pending' | 'failed';
    txHash: string;
    msgTxHash?: string;
    chainId: string | number;
  }[]
> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const moreData = Array.from({ length: 20 }, (_, i) => ({
        status:
          (currentLength + i) % 3 === 0
            ? 'completed'
            : (currentLength + i) % 3 === 1
              ? 'pending'
              : 'failed',
        txHash: `0x1234567890abcdef${currentLength + i}`,
        chainId: (currentLength + i) % 2 === 0 ? '1' : '56',
        msgTxHash: `0x1234567890abcdeff${currentLength + i}`
      }));
      resolve(moreData as any);
    }, 2000);
  });
};

const Page = () => {
  const [list, setList] = useState<
    {
      status: 'completed' | 'pending' | 'failed';
      txHash: string;
      msgTxHash?: string;
      chainId: string | number;
    }[]
  >([]);
  const [isPending, setIsPending] = useState(true);
  const [isRefetching, setIsRefetching] = useState(false);
  const [hasMore, setHasMore] = useState(true);

  const { ref, inView } = useInView({
    threshold: 0,
    skip: isRefetching || !hasMore
  });

  useEffect(() => {
    fetchData(0).then((initialData) => {
      setList(initialData);
      setIsPending(false);
    });
  }, []);

  useEffect(() => {
    if (inView && !isRefetching && hasMore) {
      setIsRefetching(true);
      fetchData(list.length).then((newData) => {
        setList((prev) => [...prev, ...newData]);
        setIsRefetching(false);
        if (newData.length < 20) {
          setHasMore(false);
        }
      });
    }
  }, [inView, isRefetching, hasMore, list.length]);

  return (
    <div className="container mx-auto h-full max-w-[800px] py-4">
      <h2 className="mb-4 font-bold uppercase">Transaction History</h2>
      {isPending ? (
        <div className="w-full space-y-4 px-4">
          {[...Array(5)].map((_, index) => (
            <Skeleton key={index} className="h-[108px] w-full md:h-20" />
          ))}
        </div>
      ) : (
        <ScrollArea
          className={cn('-mr-4 h-[calc(100%-1rem)] pr-4', !isRefetching && 'scroll-fade-bottom ')}
        >
          {list?.length ? (
            <div className="w-full space-y-4 ">
              {list.map((item, index) => (
                <TransactionCard key={index} {...item} />
              ))}
            </div>
          ) : (
            <Card className="w-full space-y-4">
              <CardContent className="flex items-center justify-center gap-4 !py-6 text-center">
                <Package2
                  strokeWidth={1}
                  width={32}
                  height={32}
                  color="hsl(var(--muted-foreground))"
                />
                <span>No data</span>
              </CardContent>
            </Card>
          )}

          {isRefetching && (
            <div className="mx-auto flex h-10 w-full items-center justify-center gap-2 ">
              <Spin className="text-muted-foreground"></Spin>
              <span>Loading more...</span>
            </div>
          )}
          {!isRefetching && hasMore && <div ref={ref} className="h-10"></div>}
          {!isRefetching && !hasMore && (
            <div className="py-4 text-center">
              <span>You&apos;ve reached the end.</span>
            </div>
          )}
        </ScrollArea>
      )}
    </div>
  );
};
export default Page;
