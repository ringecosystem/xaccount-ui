import * as React from 'react';
import { Info, Trash } from 'lucide-react';

import IframeComponent from '@/components/frame-component';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { CardContent } from '@/components/ui/card';

import AppItemWrapper from './app-item-wrapper';

import type { DappInfo } from '@/database/dapps';

type AppItemProps = React.PropsWithChildren<{
  item?: DappInfo;
  onDeleteClick?: () => void;
  onPreviewClick?: () => void;
}> &
  React.HTMLAttributes<HTMLDivElement>;

export default function AppItem({ item, onDeleteClick, onPreviewClick, ...props }: AppItemProps) {
  return (
    <AppItemWrapper {...props}>
      <CardContent className="h-full w-full px-4 py-5">
        <div className="relative flex flex-col gap-4 pt-2">
          <div className="absolute -right-2 -top-2 flex cursor-pointer items-center">
            <Tooltip>
              <TooltipTrigger asChild>
                <span
                  className="inline-flex rounded-full p-2 text-muted-foreground transition-colors hover:bg-muted-foreground/20 "
                  onClick={(e) => {
                    e.stopPropagation();
                    onPreviewClick?.();
                  }}
                >
                  <Info size={16} strokeWidth={1} absoluteStrokeWidth color="currentColor" />
                </span>
              </TooltipTrigger>
              <TooltipContent>Show more information about this app</TooltipContent>
            </Tooltip>
            <Tooltip>
              <TooltipTrigger asChild>
                <span
                  className="inline-flex rounded-full p-2 text-muted-foreground transition-colors hover:bg-muted-foreground/20"
                  onClick={(e) => {
                    e.stopPropagation();
                    onDeleteClick?.();
                  }}
                >
                  <Trash size={16} strokeWidth={1} absoluteStrokeWidth color="currentColor" />
                </span>
              </TooltipTrigger>
              <TooltipContent>Delete this app</TooltipContent>
            </Tooltip>
          </div>

          <header className="flex justify-between gap-8">
            <IframeComponent imageSrc={item?.icon || ''} width={32} height={32} />
          </header>

          <div className="flex flex-col gap-3">
            <div className="line-clamp-1 h-full w-full font-bold" title={item?.name}>
              {item?.name}
            </div>
            <p className="-mt-1 mb-0 line-clamp-4 text-sm text-muted-foreground">
              {item?.description}
            </p>
          </div>
        </div>
      </CardContent>
    </AppItemWrapper>
  );
}
