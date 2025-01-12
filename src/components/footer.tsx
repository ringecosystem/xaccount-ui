import Image from 'next/image';
import { socialConfig } from '@/config/social';

const currentYear = new Date().getUTCFullYear();

export const Footer = () => {
  return (
    <footer className="mx-auto flex h-[var(--footer)] w-full items-center justify-between px-[40px]">
      <span className="text-sm font-semibold leading-[150%] text-[#F6F1E8]">
        {currentYear} powered by RingDAO
      </span>
      <div className="flex items-center gap-[20px]">
        {socialConfig.map(({ url, name, assetPath, size }) => (
          <a
            key={name}
            href={url}
            target="_blank"
            rel="noopener noreferrer"
            className="flex size-[24px] items-center justify-center transition-opacity hover:opacity-80"
          >
            <Image
              src={assetPath}
              alt={`${name} icon`}
              loading="lazy"
              width={size.x}
              height={size.y}
            />
          </a>
        ))}
      </div>
    </footer>
  );
};
