import Image from 'next/image';
import Link from 'next/link';

import ConnectButton from '@/components/connect-button';
import { ModeToggle } from '@/components/mode-toggle';

const Header = () => {
  return (
    <header className="mb-10 h-14 w-full ">
      <div className="mx-auto  flex h-full w-full items-center justify-between px-8">
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
        <div className="flex  items-center gap-2">
          <ConnectButton />
          <ModeToggle />
        </div>
      </div>
    </header>
  );
};
export default Header;
