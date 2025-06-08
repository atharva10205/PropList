export {};

declare global {
  interface EthereumProvider {
    isMetaMask?: boolean;
    request: (...args: unknown[]) => Promise<unknown>; // changed from any
  }

  interface EthereumMultiProvider extends EthereumProvider {
    providers?: EthereumProvider[];
  }

  interface Window {
    ethereum?: EthereumMultiProvider;
    solana?: Record<string, unknown>; // safer than `any`
  }
}
