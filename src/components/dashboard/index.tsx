'use client';
import { useCallback, useEffect, useRef, useState } from 'react';
import { useMutation, useQuery } from '@tanstack/react-query';
import { Plus } from 'lucide-react';

import { CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { getAllItems, addItem, deleteItem, Item } from '@/database/dapps-repository';
import { ScrollArea } from '@/components/ui/scroll-area';
import SelectChainDialog from '@/components/select-chain-dialog';
import useNavigateToDapp from '@/hooks/useLinkToDapp';

import AddDapp, { FormReturn } from './add-dapp';
import AppItem from './app-item';
import { AppDeleteConfirm } from './app-delete-confirm';
import AppItemWrapper from './app-item-wrapper';
import AppItemDetail from './app-item-detail';

// appUrl
export default function Home() {
  const formRef: React.MutableRefObject<FormReturn | null> = useRef(null);
  const [addDappOpen, setAddDappOpen] = useState(false);
  const [remoteChainAlertOpen, setRemoteChainAlertOpen] = useState(false);
  const [deleteDappOpen, setDeleteDappOpen] = useState(false);
  const [previewOpen, setPreviewOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<Item | null>(null);

  const navigateToDapp = useNavigateToDapp();
  const {
    data: dapps,
    refetch,
    isPending
  } = useQuery({
    queryKey: ['dapps'],
    queryFn: getAllItems
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
    async (data: Omit<Item, 'hostname'>) => {
      await mutateAddItem(data);
      await refetch();
      formRef?.current?.reset();
      setAddDappOpen(false);
    },
    [mutateAddItem, refetch]
  );

  const handleSelectChainOpenChange = useCallback((open: boolean) => {
    setRemoteChainAlertOpen(open);
  }, []);

  const handleConfirmDelete = useCallback(async () => {
    if (!selectedItem?.id) return;
    await mutateDeleteItem(selectedItem?.id);
    await refetch();
    setDeleteDappOpen(false);
  }, [selectedItem, mutateDeleteItem, refetch]);

  useEffect(() => {
    refetch();
  }, [refetch]);

  return (
    <div
      className="container relative px-8 py-6"
      style={{
        height: 'calc(100vh - var(--header) - var(--footer)'
      }}
    >
      <h2 className="mb-4 font-bold uppercase">ALL DAPPS</h2>
      <ScrollArea
        style={{
          height: 'calc(100% - 1rem)'
        }}
        className="scroll-fade-bottom px-4"
      >
        <div className="dapps-grid gap-6">
          {isPending ? (
            Array.from({ length: 10 }).map((_, index) => (
              <AppItemWrapper key={index}>
                <Skeleton className="h-full w-full" />
              </AppItemWrapper>
            ))
          ) : (
            <>
              <AppItemWrapper onClick={() => setAddDappOpen(true)}>
                <CardContent className="h-full w-full p-0">
                  <div
                    className=" flex h-full w-full flex-col items-center justify-center gap-2"
                    title="Add App"
                  >
                    <Plus size={48} strokeWidth={2} />
                    <p className="text-sm font-bold text-muted-foreground">Add Dapp</p>
                  </div>
                </CardContent>
              </AppItemWrapper>
              {dapps?.map((item) => (
                <AppItem
                  key={item.id}
                  item={item}
                  onClick={() => {
                    navigateToDapp(item).catch(() => {
                      handleSelectChainOpenChange(true);
                    });
                  }}
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
            </>
          )}
        </div>
      </ScrollArea>

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
      <AppItemDetail
        item={selectedItem}
        open={previewOpen}
        onOpenChange={setPreviewOpen}
        onOpenAlertChange={() => {
          handleSelectChainOpenChange(true);
        }}
      />
      <SelectChainDialog open={remoteChainAlertOpen} onOpenChange={handleSelectChainOpenChange} />
    </div>
  );
}
