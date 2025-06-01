export {}; 

declare global {
  interface EthereumProvider {
    isMetaMask?: boolean;
    request: (...args: any[]) => Promise<any>;
  }

  interface EthereumMultiProvider extends EthereumProvider {
    providers?: EthereumProvider[];
  }

  interface Window {
    ethereum?: EthereumMultiProvider;
    solana?: any;
  }
}
