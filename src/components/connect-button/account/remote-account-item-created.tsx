import { ChainConfig } from '@/types/chains';

interface RemoteAccountItemCreatedProps {
  toChain: ChainConfig;
}
const RemoteAccountItemCreated = ({ toChain }: RemoteAccountItemCreatedProps) => {
  return <div className="text-muted-foreground">Create on {toChain?.name}</div>;
};

export default RemoteAccountItemCreated;
