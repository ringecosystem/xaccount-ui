import { useEffect, type MutableRefObject, type ReactElement } from 'react';
import { AlertCircle } from 'lucide-react';

import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { useAllowedHost } from '@/hooks/useAllowedHost';
type SafeAppIFrameProps = {
  appUrl: string;
  title?: string;
  iframeRef?: MutableRefObject<HTMLIFrameElement | null>;
  onLoad?: () => void;
};

const IFRAME_SANDBOX_ALLOWED_FEATURES =
  'allow-scripts allow-same-origin allow-popups allow-popups-to-escape-sandbox allow-forms allow-downloads allow-orientation-lock';

const SafeAppIframe = ({ appUrl, iframeRef, onLoad, title }: SafeAppIFrameProps): ReactElement => {
  const { isAllowed } = useAllowedHost(appUrl);

  useEffect(() => {
    if (!isAllowed) {
      onLoad?.();
    }
  }, [isAllowed, onLoad]);

  if (isAllowed) {
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
