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

    // 绑定事件处理函数
    this.boundHandleSessionProposal = async (args) => {
      try {
        console.log('Received session proposal:', args);
        await this.handleSessionProposal(args.params);
      } catch (error) {
        console.error('Failed to handle session proposal:', error);
      }
    };

    this.boundHandleSessionRequest = async (event) => {
      const { topic, params, id } = event;
      const { request } = params;

      if (request.method === 'eth_sendTransaction') {
        await this.handleTransaction(id, request.params[0]);
        await this.web3wallet?.respondSessionRequest({
          topic,
          response: {
            jsonrpc: '2.0',
            id,
            error: {
              code: 0,
              message: 'Transaction simulated'
            }
          }
        });
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

      // 直接尝试配对，让 WalletConnect 处理错误
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
      const requiredNamespace = requiredNamespaces[namespaceKey];
      const optionalNamespace = optionalNamespaces?.[namespaceKey];

      let chains: string[] = requiredNamespace?.chains || [];
      if (optionalNamespace?.chains) {
        chains = Array.from(new Set([...chains, ...optionalNamespace.chains]));
      }

      if (!this.currentAddress) {
        throw new Error('No address set');
      }

      const accounts: string[] = chains.map((chain: string) => `${chain}:${this.currentAddress}`);

      console.log('Approving session with accounts:', accounts);

      const session = await this.web3wallet.approveSession({
        id: proposal.id,
        namespaces: {
          [namespaceKey]: {
            accounts,
            chains,
            methods: requiredNamespace?.methods || [],
            events: requiredNamespace?.events || []
          }
        }
      });

      console.log('Session approved:', session);

      this.currentSession = session;
      this.isConnected = true;
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
    const transaction: Transaction = {
      id,
      from: this.currentAddress,
      to: params.to,
      data: params.data,
      value: params.value ? parseInt(params.value, 16).toString() : '0'
    };

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
  public async updateSession(params: { chainId?: string; address?: string }): Promise<void> {
    if (!this.web3wallet || !this.currentSession) return;

    const { chainId, address } = params;
    if (address) {
      this.currentAddress = address;
    }

    await this.web3wallet.emitSessionEvent({
      topic: this.currentSession.topic,
      event: {
        name: address ? 'accountsChanged' : 'chainChanged',
        data: [address || chainId]
      },
      chainId: chainId || this.currentSession.namespaces['eip155']?.chains?.[0] || ''
    });
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
    const { isValid, resolvedAddress } = await this.validateAddress(address);
    if (!isValid) {
      throw new Error('Invalid address');
    }
    this.currentAddress = resolvedAddress;

    // If connected, notify dApp of address change
    if (this.isConnected) {
      await this.updateSession({ address: resolvedAddress });
    }
  }

  /**
   * Validate and resolve address
   */
  private async validateAddress(address: string): Promise<{
    isValid: boolean;
    resolvedAddress: string;
  }> {
    try {
      // Try to resolve ENS name
      const resolvedAddress = await this.provider.resolveName(address);
      if (resolvedAddress) {
        return { isValid: true, resolvedAddress };
      }

      // Validate if it's a valid Ethereum address
      const isValid = isAddress(address);
      return { isValid, resolvedAddress: address };
    } catch (error) {
      console.error('Address validation failed:', error);
      return { isValid: false, resolvedAddress: '' };
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
      // 断开当前会话
      if (this.currentSession) {
        await this.disconnect();
      }

      // 移除所有事件监听器
      if (this.web3wallet) {
        this.web3wallet.removeListener('session_proposal', this.boundHandleSessionProposal);
        this.web3wallet.removeListener('session_request', this.boundHandleSessionRequest);
        this.web3wallet.removeListener('session_delete', this.boundHandleSessionDelete);
      }

      // 清理状态
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
}
