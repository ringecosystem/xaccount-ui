import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle
} from '@/components/ui/alert-dialog';
import { Button } from '@/components/ui/button';

interface AppDeleteConfirmProps {
  title: string;
  open: boolean;
  confirmLoading?: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: () => void;
}
export function AppDeleteConfirm({
  title,
  open,
  confirmLoading,
  onOpenChange,
  onConfirm
}: AppDeleteConfirmProps) {
  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Confirm removal</AlertDialogTitle>
          <AlertDialogDescription>
            Are you sure you want to remove the {title} app?
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel onClick={() => onOpenChange(false)}>Cancel</AlertDialogCancel>
          <Button onClick={onConfirm} isLoading={confirmLoading}>
            Remove
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
