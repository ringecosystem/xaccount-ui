'use client';
import { useCallback, useEffect, useRef, useState } from 'react';
import { useMutation, useQuery } from '@tanstack/react-query';
import { AiOutlinePlus } from 'react-icons/ai';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import Spin from '@/components/ui/spin';
import { Skeleton } from '@/components/ui/skeleton';
import { initDB, getAllItems, addItem, deleteItem, Item } from '@/database/dapps-list';

import AddDapp, { FormReturn } from './add-dapp';
import AppItem from './app-item';
import { AppDeleteConfirm } from './app-delete-confirm';
import AppItemWrapper from './app-item-wrapper';
import AppItemDetail from './app-item-detail';

export default function Home() {
  const isDBInitialized = useRef(false);
  const formRef: React.MutableRefObject<FormReturn | null> = useRef(null);
  const [addDappOpen, setAddDappOpen] = useState(false);
  const [deleteDappOpen, setDeleteDappOpen] = useState(false);
  const [previewOpen, setPreviewOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<Item | null>(null);

  const {
    data: dapps,
    refetch,
    isPending,
    isRefetching
  } = useQuery({
    queryKey: ['dapps'],
    queryFn: getAllItems,
    enabled: isDBInitialized.current
  });

  const { mutateAsync: mutateAddItem, isPending: addLoading } = useMutation({
    mutationFn: addItem,
    onMutate: async () => {
      await refetch();
    }
  });

  const { mutateAsync: mutateDeleteItem, isPending: deleteLoading } = useMutation({
    mutationFn: deleteItem,
    onMutate: async () => {
      await refetch();
    }
  });

  const handleFinish = useCallback(
    async (data: Item) => {
      await mutateAddItem(data);
      await refetch();
      formRef?.current?.reset();
      setAddDappOpen(false);
    },
    [mutateAddItem, refetch]
  );

  const handleConfirmDelete = useCallback(async () => {
    if (!selectedItem?.id) return;
    await mutateDeleteItem(selectedItem?.id);
    await refetch();
    setDeleteDappOpen(false);
  }, [selectedItem, mutateDeleteItem, refetch]);

  useEffect(() => {
    if (!isDBInitialized.current) {
      initDB()
        ?.then(() => {
          refetch();
        })
        ?.finally(() => {
          isDBInitialized.current = true;
        });
    }
  }, [refetch]);

  return (
    <>
      <Card className="container relative h-full w-full border-none shadow-none">
        <CardHeader>
          <CardTitle>All Dapps</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="4xl:grid-cols-7 grid-col-1 grid gap-6 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 ">
            {isPending ? (
              Array.from({ length: 10 }).map((_, index) => (
                <AppItemWrapper key={index}>
                  <Skeleton className="h-full w-full" />
                </AppItemWrapper>
              ))
            ) : (
              <>
                {dapps?.map((item) => (
                  <AppItem
                    key={item.id}
                    item={item}
                    onPreviewClick={() => {
                      setSelectedItem(item);
                      setPreviewOpen(true);
                    }}
                    onDeleteClick={() => {
                      setSelectedItem(item);
                      setDeleteDappOpen(true);
                    }}
                  />
                ))}
                <AppItemWrapper onClick={() => setAddDappOpen(true)}>
                  <CardContent className="h-full w-full p-0">
                    <div
                      className=" flex h-full w-full flex-col items-center justify-center gap-2"
                      title="Add App"
                    >
                      <AiOutlinePlus className="text-[50px]" />
                      <p className="text-sm font-bold text-muted-foreground">Add Dapp</p>
                    </div>
                  </CardContent>
                </AppItemWrapper>
              </>
            )}
          </div>
        </CardContent>
        {isRefetching && (
          <div className=" absolute inset-0 left-0 top-0 flex items-center justify-center bg-white/20">
            <Spin className="h-12 w-12" />
          </div>
        )}
      </Card>
      <AddDapp
        ref={formRef}
        open={addDappOpen}
        onOpenChange={setAddDappOpen}
        onFinish={handleFinish}
        confirmLoading={addLoading}
      />
      <AppDeleteConfirm
        title={selectedItem?.name || ''}
        open={deleteDappOpen}
        confirmLoading={deleteLoading}
        onOpenChange={(open) => {
          setDeleteDappOpen(open);
          if (!open) {
            setSelectedItem(null);
          }
        }}
        onConfirm={handleConfirmDelete}
      />
      <AppItemDetail item={selectedItem} open={previewOpen} onOpenChange={setPreviewOpen} />
    </>
  );
}
