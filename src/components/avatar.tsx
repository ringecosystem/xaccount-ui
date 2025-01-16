import Image from 'next/image';
import { blo } from 'blo';
import { cn } from '@/lib/utils';

interface AvatarProps {
  address: `0x${string}`;
  className?: string;
}
const Avatar = ({ address, className }: AvatarProps) => {
  return (
    <div className={cn('relative size-[46px] overflow-hidden rounded-full', className)}>
      <Image
        src={blo(address)}
        alt="avatar"
        className="object-contain"
        loading="lazy"
        width={46}
        height={46}
      />
    </div>
  );
};

export default Avatar;
