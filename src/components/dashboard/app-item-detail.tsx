import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogFooter, DialogHeader } from '@/components/ui/dialog';
import { Item } from '@/database/dapps-list';
import IframeComponent from '@/components/IframeComponent';
import { Card, CardContent } from '@/components/ui/card';

interface AppItemDetailProps {
  item: Item | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const AppItemDetail = ({ item, open, onOpenChange }: AppItemDetailProps) => {
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
          <Button type="button" className="w-full truncate">
            Open this app
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
export default AppItemDetail;
