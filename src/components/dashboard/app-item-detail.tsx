'use client';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogFooter, DialogHeader } from '@/components/ui/dialog';
import { DappInfo } from '@/database/dapps';
import IframeComponent from '@/components/frame-component';
import { Card, CardContent } from '@/components/ui/card';
import useNavigateToDapp from '@/hooks/useLinkToDapp';

interface AppItemDetailProps {
  item: DappInfo | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onOpenAlertChange?: () => void;
}

const AppItemDetail = ({ item, open, onOpenChange, onOpenAlertChange }: AppItemDetailProps) => {
  const navigateToDapp = useNavigateToDapp();

  const handleClick = () => {
    navigateToDapp(item as DappInfo)?.catch(() => {
      onOpenAlertChange?.();
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader className="font-bold">{item?.name}</DialogHeader>

        <Card className="flex flex-col gap-2 rounded bg-card">
          <CardContent className="flex flex-col gap-6 p-4">
            <IframeComponent imageSrc={item?.icon || ''} />
            <div className="text-sm text-muted-foreground">{item?.description}</div>
          </CardContent>
        </Card>
        <DialogFooter>
          <Button type="button" className="w-full truncate" onClick={handleClick}>
            Open this app
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
export default AppItemDetail;
