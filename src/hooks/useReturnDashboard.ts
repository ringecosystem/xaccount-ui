'use client';
import { useRouter, usePathname } from 'next/navigation';
import { useCallback } from 'react';

const useReturnDashboard = () => {
  const router = useRouter();
  const pathname = usePathname();

  const returnDashboard = useCallback(() => {
    if (pathname === '/dapp') {
      router.push('/');
    }
  }, [pathname, router]);

  return returnDashboard;
};
export default useReturnDashboard;
