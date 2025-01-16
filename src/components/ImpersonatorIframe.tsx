import { useEffect } from 'react';
import { useImpersonatorIframe } from '@/contexts/ImpersonatorIframeContext';
const IFRAME_SANDBOX_ALLOWED_FEATURES =
  'allow-scripts allow-same-origin allow-popups allow-popups-to-escape-sandbox allow-forms allow-downloads allow-orientation-lock';

interface Props {
  width: number | string;
  height: number | string;
  targetChainId?: string;
  src: string;
  address: string;
  rpcUrl: string;
  onLoad?: () => void;
  onError?: () => void;
}

export const ImpersonatorIframe = ({
  width,
  height,
  src,
  address,
  rpcUrl,
  onLoad,
  onError,
  targetChainId
}: Props) => {
  const { iframeRef, setAddress, setAppUrl, setRpcUrl, setTargetChainId, isReady } =
    useImpersonatorIframe();

  useEffect(() => {
    if (src && address && setAddress) {
      setAppUrl(src);
      setAddress(address);
      setRpcUrl(rpcUrl);
      setTargetChainId(targetChainId);
    }
  }, [src, setAppUrl, address, setAddress, rpcUrl, setRpcUrl, targetChainId, setTargetChainId]);

  return isReady ? (
    <iframe
      width={width}
      height={height}
      ref={iframeRef}
      id={`iframe-${src}`}
      className="rounded-[10px] border border-[#666] bg-[#141414]"
      onLoad={onLoad}
      onError={onError}
      src={src}
      sandbox={IFRAME_SANDBOX_ALLOWED_FEATURES}
    />
  ) : null;
};
