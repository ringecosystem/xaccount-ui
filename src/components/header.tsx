'use client';
import Image from 'next/image';
import Link from 'next/link';
import { History } from 'lucide-react';

import ConnectButton from '@/components/connect-button';
import { ModeToggle } from '@/components/mode-toggle';
import { Button } from '@/components/ui/button';
import useHistoryLink from '@/hooks/useHistoryLink';

const Header = () => {
  const historyLink = useHistoryLink();

  return (
    <header className="h-[var(--header)] w-full ">
      <div className="mx-auto  flex h-full w-full items-center justify-between px-6">
        <Link href="/" title="darwinia" className="hidden mix-blend-exclusion md:inline-flex">
          <Image
            src={'/images/common/logo.png'}
            alt="darwinia logo"
            priority
            width={154}
            height={18}
            className="h-[18px] w-[154px] shrink-0"
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
