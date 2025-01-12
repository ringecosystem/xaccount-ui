import { Core } from '@walletconnect/core';
import { WalletKit, IWalletKit } from '@reown/walletkit';
import { SessionTypes, ProposalTypes } from '@walletconnect/types';
import { JsonRpcProvider, isAddress } from 'ethers';
import { getSdkError, parseUri } from '@walletconnect/utils';
interface WalletConnectConfig {
  projectId: string;
  metadata: {
    name: string;
    description: string;
    url: string;
    icons: string[];
  };
}

interface Transaction {
  id: number;
  from: string;
  to: string;
  data: string;
  value: string;
}

interface TransactionParams {
  from: string;
  to: string;
  data: string;
  value?: string;
  gas?: string;
  gasPrice?: string;
  nonce?: string;
}

export class WalletConnectManager {
  private core: InstanceType<typeof Core>;
  private web3wallet: IWalletKit | null = null;
  private currentSession: SessionTypes.Struct | null = null;
  private provider: JsonRpcProvider;
  private currentAddress: string = '';
  private isConnected: boolean = false;
  private transactions: Transaction[] = [];
  private onTransactionCallback?: (transaction: Transaction) => void;
  private connectionStatusCallback?: (info: {
    isConnected: boolean;
    dappInfo?: {
      name: string;
      url: string;
      icon: string;
      description: string;
    };
  }) => void;

  // Store references to event handlers
  private boundHandleSessionProposal: (args: {
    id: number;
    params: ProposalTypes.Struct;
  }) => Promise<void>;
  private boundHandleSessionRequest: (event: {
    topic: string;
    params: { request: { method: string; params: any[] } };
    id: number;
  }) => Promise<void>;
  private boundHandleSessionDelete: () => void;

  constructor(config: WalletConnectConfig, rpcUrl: string) {
    this.core = new Core({
      projectId: config.projectId
    });
    this.provider = new JsonRpcProvider(rpcUrl);

    this.boundHandleSessionProposal = async (args) => {
      try {
        console.log('Received session proposal:', args);
        await this.handleSessionProposal(args.params);
      } catch (error) {
        console.error('Failed to handle session proposal:', error);
      }
    };

    this.boundHandleSessionRequest = async (event) => {
      console.log('session_request event', event);

      const { topic, params, id } = event;
      const { request } = params;

      console.log('Received transaction request:', {
        topic,
        id,
        method: request.method,
        params: request.params
      });

      if (request.method === 'eth_sendTransaction') {
        try {
          await this.handleTransaction(id, request.params[0]);

          // Respond with simulation result
          await this.web3wallet?.respondSessionRequest({
            topic,
            response: {
              jsonrpc: '2.0',
              id,
              error: {
                code: 0,
                message: 'Transaction simulated successfully'
              }
            }
          });
        } catch (error) {
          console.error('Transaction handling failed:', error);
          // Respond with error
          await this.web3wallet?.respondSessionRequest({
            topic,
            response: {
              jsonrpc: '2.0',
              id,
              error: {
                code: -32000,
                message: 'Transaction simulation failed'
              }
            }
          });
        }
      }
    };

    this.boundHandleSessionDelete = () => {
      console.log('Session deleted');
      this.currentSession = null;
      this.isConnected = false;
    };
  }

  /**
   * Initialize wallet and set up event listeners
   */
  public async initializeWallet(onlyIfActiveSessions?: boolean): Promise<void> {
    try {
      this.web3wallet = await WalletKit.init({
        core: this.core,
        metadata: {
          name: 'Impersonator',
          description: 'Login to dapps as any address',
          url: 'www.impersonator.xyz',
          icons: ['https://www.impersonator.xyz/favicon.ico']
        }
      });

      if (onlyIfActiveSessions) {
        const sessions = this.web3wallet.getActiveSessions();
        const sessionsArray = Object.values(sessions);
        if (sessionsArray.length > 0) {
          const session = sessionsArray[0];
          const address = session.namespaces['eip155'].accounts[0].split(':')[2];
          this.currentSession = session;
          this.currentAddress = address;
          this.isConnected = true;
        }
      }

      this.setupEventListeners();
    } catch (error) {
      console.error('Failed to initialize wallet:', error);
      throw error;
    }
  }

  /**
   * Pair using URI
   */
  public async pair(uri: string): Promise<void> {
    if (!this.web3wallet) {
      throw new Error('Wallet not initialized');
    }

    try {
      const { version } = parseUri(uri);
      if (version !== 2) {
        throw new Error('Unsupported WalletConnect version');
      }

      await this.web3wallet.core.pairing.pair({ uri });
    } catch (error) {
      console.error('Pairing failed:', error);
      throw error;
    }
  }

  /**
   * Handle session proposal
   */
  private async handleSessionProposal(proposal: ProposalTypes.Struct): Promise<void> {
    if (!this.web3wallet) return;

    try {
      console.log('Processing session proposal:', proposal);

      const { requiredNamespaces, optionalNamespaces } = proposal;
      const namespaceKey = 'eip155';

      const namespace = requiredNamespaces[namespaceKey] || optionalNamespaces?.[namespaceKey];

      if (!namespace) {
        throw new Error('No namespace configuration found');
      }

      const chains = namespace.chains || [];
      const methods = namespace.methods || [];
      const events = namespace.events || [];

      if (!this.currentAddress) {
        throw new Error('No address set');
      }

      const accounts: string[] = chains.map((chain: string) => `${chain}:${this.currentAddress}`);

      console.log('Approving session with configuration:', {
        chains,
        accounts,
        methods,
        events
      });

      const session = await this.web3wallet.approveSession({
        id: proposal.id,
        namespaces: {
          [namespaceKey]: {
            accounts,
            chains,
            methods,
            events
          }
        }
      });

      console.log('Session approved:', session);

      this.currentSession = session;
      this.isConnected = true;
      this.emitConnectionStatus();
    } catch (error) {
      console.error('Failed to handle session proposal:', error);
      if (this.web3wallet) {
        await this.web3wallet.rejectSession({
          id: proposal.id,
          reason: getSdkError('USER_REJECTED')
        });
      }
      throw error;
    }
  }

  /**
   * Set up event listeners
   */
  private setupEventListeners(): void {
    if (!this.web3wallet) return;

    this.web3wallet.on('session_proposal', this.boundHandleSessionProposal);
    this.web3wallet.on('session_request', this.boundHandleSessionRequest);
    this.web3wallet.on('session_delete', this.boundHandleSessionDelete);
  }

  /**
   * Handle transaction request
   */
  private async handleTransaction(id: number, params: TransactionParams): Promise<void> {
    console.log('Processing transaction:', { id, params });

    const transaction: Transaction = {
      id,
      from: this.currentAddress,
      to: params.to,
      data: params.data,
      value: params.value || '0'
    };

    console.log('Processed transaction:', transaction);

    this.transactions.push(transaction);
    this.onTransactionCallback?.(transaction);
  }

  /**
   * Set transaction callback
   */
  public setTransactionCallback(callback: (transaction: Transaction) => void): void {
    this.onTransactionCallback = callback;
  }

  /**
   * Update session state (address or chain ID change)
   */
  public async updateSession(params: { address?: string; chainId?: string }) {
    try {
      // Initialize wallet if not already initialized
      if (!this.web3wallet) {
        await this.initializeWallet();
      }

      // Check if we have an active session after initialization
      if (!this.currentSession) {
        throw new Error('No active session found');
      }

      const namespace = 'eip155';
      const accounts = params.address
        ? [`${this.currentSession?.namespaces[namespace]?.chains?.[0] || '1'}:${params.address}`]
        : this.currentSession.namespaces[namespace].accounts;
      const chains = params.chainId
        ? [params.chainId]
        : this.currentSession.namespaces[namespace].chains;

      await this.web3wallet!.updateSession({
        topic: this.currentSession.topic,
        namespaces: {
          [namespace]: {
            accounts,
            chains,
            methods: this.currentSession.namespaces[namespace].methods,
            events: this.currentSession.namespaces[namespace].events
          }
        }
      });
    } catch (error) {
      console.error('Failed to update session:', error);
      throw error;
    }
  }

  /**
   * Disconnect
   */
  public async disconnect(): Promise<void> {
    if (this.web3wallet && this.currentSession) {
      try {
        await this.web3wallet.disconnectSession({
          topic: this.currentSession.topic,
          reason: getSdkError('USER_DISCONNECTED')
        });
      } catch (error) {
        console.error('Failed to disconnect:', error);
      }
    }
    this.currentSession = null;
    this.isConnected = false;
    this.emitConnectionStatus();
  }

  /**
   * Get transaction history
   */
  public getTransactionHistory(): Transaction[] {
    return this.transactions;
  }

  /**
   * Set current address
   */
  public async setAddress(address: string): Promise<void> {
    try {
      const isValid = await this.validateAddress(address);
      if (!isValid) {
        throw new Error('Invalid address');
      }

      if (!isAddress(address)) {
        try {
          const resolvedAddress = await this.provider.resolveName(address);
          if (resolvedAddress) {
            address = resolvedAddress;
          }
        } catch (error) {
          if (!(error instanceof Error && error.message.includes('network does not support ENS'))) {
            throw error;
          }
        }
      }

      this.currentAddress = address;
    } catch (error) {
      console.error('Failed to set address:', error);
      throw error;
    }
  }

  /**
   * Validate and resolve address
   */
  private async validateAddress(address: string): Promise<boolean> {
    try {
      if (isAddress(address)) {
        return true;
      }

      try {
        const resolvedAddress = await this.provider.resolveName(address);
        return resolvedAddress !== null;
      } catch (error) {
        if (error instanceof Error && error.message.includes('network does not support ENS')) {
          return isAddress(address);
        }
        throw error;
      }
    } catch (error) {
      console.error('Address validation failed:', error);
      return false;
    }
  }

  /**
   * Get current connection info
   */
  public getConnectionInfo(): {
    isConnected: boolean;
    currentAddress: string;
    dappInfo?: {
      name: string;
      url: string;
      icon: string;
      description: string;
    };
  } {
    return {
      isConnected: this.isConnected,
      currentAddress: this.currentAddress,
      dappInfo: this.currentSession
        ? {
            name: this.currentSession.peer.metadata.name,
            url: this.currentSession.peer.metadata.url,
            icon: this.currentSession.peer.metadata.icons[0],
            description: this.currentSession.peer.metadata.description
          }
        : undefined
    };
  }

  /**
   * Get current session
   */
  public getCurrentSession() {
    return this.currentSession;
  }

  /**
   * Destroy instance and clean up resources
   */
  public async destroy(): Promise<void> {
    try {
      if (this.currentSession) {
        await this.disconnect();
      }

      if (this.web3wallet) {
        this.web3wallet.removeListener('session_proposal', this.boundHandleSessionProposal);
        this.web3wallet.removeListener('session_request', this.boundHandleSessionRequest);
        this.web3wallet.removeListener('session_delete', this.boundHandleSessionDelete);
      }

      this.web3wallet = null;
      this.currentSession = null;
      this.currentAddress = '';
      this.isConnected = false;
      this.transactions = [];
      this.onTransactionCallback = undefined;
    } catch (error) {
      console.error('Failed to destroy WalletConnectManager:', error);
      throw error;
    }
  }

  public onConnectionStatusChange(callback: typeof this.connectionStatusCallback) {
    this.connectionStatusCallback = callback;
  }

  private emitConnectionStatus() {
    if (this.connectionStatusCallback) {
      this.connectionStatusCallback(this.getConnectionInfo());
    }
  }
}
