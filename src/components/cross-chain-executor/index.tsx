import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';

interface CrossChainExecutorProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}
const CrossChainExecutor = ({ open, onOpenChange }: CrossChainExecutorProps) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="w-full sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Execute transaction</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-8">
          <div className="space-y-8">
            <div>
              <h4 className=" text-sm font-bold uppercase">interact with</h4>
              <div className="text-sm text-muted-foreground">arbitrum:0x(uniswap)</div>
            </div>
            <div>
              <h4 className="text-sm font-bold uppercase">data</h4>
              <div className="break-all text-sm text-muted-foreground">
                0x5469726564206f6e20617262697472756d3a307828756e6973776170290x5469726564206f6e20617262697472756d3a307828756e697377617029
              </div>
            </div>

            <details className="space-y-2">
              <summary className="cursor-pointer text-sm font-bold uppercase">Advanced</summary>
              <div className="flex items-center gap-2">
                <div>value</div>
                <Input className="w-48" type="number" placeholder="0.0" />
              </div>
              <p className="text-sm text-muted-foreground">
                The native token amount you want to transfer from arb:0xdef...def to
                arb:0xabc...abc(uniswap)
              </p>
            </details>
          </div>
        </div>
        <DialogFooter className="flex !flex-col items-center justify-center gap-2">
          <Button type="submit" className="w-full">
            execute
          </Button>
          <p className="text-sm text-muted-foreground">
            this transaction will execute the remote call on arbitrum
          </p>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default CrossChainExecutor;
