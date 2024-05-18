import { useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';

import { getDapps } from '@/database/dapps';

/**
 * A hook to check if a URL's host is in the allowed list of hosts.
 *
 * @param {string} appUrl The URL to check.
 * @returns {boolean} Whether the URL's host is allowed.
 */
export function useAllowedHost(appUrl: string) {
  const {
    data: dapps,
    isError,
    isLoading
  } = useQuery({
    queryKey: ['dapps'],
    queryFn: getDapps
  });

  const allowUrls = useMemo(() => dapps?.map((dapp) => dapp.url) ?? [], [dapps]);

  const appHost = useMemo(() => {
    try {
      const url = new URL(decodeURIComponent(appUrl));
      return url.host;
    } catch {
      return '';
    }
  }, [appUrl]);

  const isAllowed = useMemo(() => {
    return allowUrls.some((url) => {
      try {
        return new URL(url).host === appHost;
      } catch {
        return false;
      }
    });
  }, [allowUrls, appHost]);

  return { isAllowed, isLoading, isError };
}
