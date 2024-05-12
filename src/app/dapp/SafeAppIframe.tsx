import { useQuery } from '@tanstack/react-query';
import { useEffect, useMemo, type MutableRefObject, type ReactElement } from 'react';
import { AlertCircle } from 'lucide-react';

import { getAllItems } from '@/database/dapps-repository';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
type SafeAppIFrameProps = {
  appUrl: string;
  title?: string;
  iframeRef?: MutableRefObject<HTMLIFrameElement | null>;
  onLoad?: () => void;
};

const IFRAME_SANDBOX_ALLOWED_FEATURES =
  'allow-scripts allow-same-origin allow-popups allow-popups-to-escape-sandbox allow-forms allow-downloads allow-orientation-lock';

const SafeAppIframe = ({ appUrl, iframeRef, onLoad, title }: SafeAppIFrameProps): ReactElement => {
  const decodedAppUrl = decodeURIComponent(appUrl);
  const { data: dapps } = useQuery({
    queryKey: ['dapps'],
    queryFn: getAllItems
  });
  const allowUrls = useMemo(() => dapps?.map((dapp) => dapp.url) || [], [dapps]);

  useEffect(() => {
    if (!allowUrls.includes(decodedAppUrl)) {
      onLoad?.();
    }
  }, [allowUrls, decodedAppUrl, onLoad]);

  if (allowUrls.includes(decodedAppUrl)) {
    return (
      <iframe
        className=" block h-full w-full overflow-auto border-none"
        id={`iframe-${appUrl}`}
        ref={iframeRef}
        src={appUrl}
        title={title}
        onLoad={onLoad}
        sandbox={IFRAME_SANDBOX_ALLOWED_FEATURES}
      />
    );
  }
  return (
    <div className=" flex h-screen w-full items-center justify-center px-4 md:px-0">
      <Alert className="-mt-[var(--header)] w-full md:max-w-[600px]">
        <AlertCircle className="size-5" />
        <AlertTitle>Oops!</AlertTitle>
        <AlertDescription>
          It looks like this app isn&apos;t on your Safe&apos;s approved list. To start using it,
          please add it to your list of trusted apps.
        </AlertDescription>
      </Alert>
    </div>
  );
};

export default SafeAppIframe;
