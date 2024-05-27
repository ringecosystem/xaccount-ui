'use client';
import Image from 'next/image';
import Link from 'next/link';
import { History } from 'lucide-react';

import ConnectButton from '@/components/connect-button';
import { ModeToggle } from '@/components/mode-toggle';
import { Button } from '@/components/ui/button';
import useHistoryLink from '@/hooks/useHistoryLink';
import { APP_NAME } from '@/config/site';
import { useAppAutoConnect } from '@/hooks/useAppAutoConnect';

const Header = () => {
  const historyLink = useHistoryLink();

  useAppAutoConnect();

  return (
    <header className="h-[var(--header)] w-full ">
      <div className="mx-auto  flex h-full w-full items-center justify-between px-6">
        <Link href="/" title={APP_NAME} className="hidden  md:inline-flex">
          <Image
            src="/images/common/logo-white.svg"
            alt={`${APP_NAME} logo`}
            priority
            width={156}
            height={30}
            className="hidden h-[30px] w-[156px] shrink-0 dark:inline"
          />
          <Image
            src="/images/common/logo-black.svg"
            alt={`${APP_NAME} logo`}
            priority
            width={156}
            height={30}
            className="inline h-[30px] w-[156px] shrink-0 dark:hidden"
          />
        </Link>
        <div className="flex  w-full items-center justify-between gap-2 md:w-auto">
          <ConnectButton />
          <div className="flex items-center gap-2">
            {!!historyLink && (
              <a
                href={historyLink}
                target="_blank"
                rel="noreferrer"
                title="History"
                className="flex h-[2rem] w-[2rem] items-center justify-center rounded-full"
              >
                <Button className="flex-shrink-0" variant="secondary" size="icon">
                  <History className="h-[1.2rem] w-[1.2rem]" />
                </Button>
              </a>
            )}
            <ModeToggle />
          </div>
        </div>
      </div>
    </header>
  );
};
export default Header;
