import { useConnect, useReconnect } from 'wagmi';
import { useEffect } from 'react';
import { Connector } from 'wagmi';

interface AppConnector extends Connector {
  rkDetails?: {
    installed: boolean;
    isRainbowKitConnector: boolean;
  };
}

function useAppAutoConnect() {
  const { connect, connectors } = useConnect();
  const { reconnect } = useReconnect();

  useEffect(() => {
    if (window.self !== window.top) {
      const appConnector = connectors.find(
        (connector: AppConnector) =>
          connector.id === 'safe' &&
          connector.rkDetails?.installed &&
          connector.rkDetails?.isRainbowKitConnector
      ) as AppConnector;

      if (appConnector) {
        connect({ connector: appConnector });
        return;
      }
    }
    reconnect();
  }, [connect, connectors, reconnect]);
}

export { useAppAutoConnect };
