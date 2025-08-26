//this.wallet/npm/src/types/ethereum.js
//by suiGn - neurons.me

export const defaultNetworks = {
  mainnet: {
    chainId: 1,
    name: 'Ethereum Mainnet',
    rpcUrl: 'https://rpc.ankr.com/eth',
    explorer: 'https://etherscan.io',
    symbol: 'ETH',
    requiresApiKey: false
  },
  bnb: {
    chainId: 56,
    name: 'BNB Smart Chain',
    rpcUrl: 'https://bsc-dataseed.binance.org/',
    explorer: 'https://bscscan.com',
    symbol: 'BNB',
    requiresApiKey: false
  },
  bnbTestnet: {
    chainId: 97,
    name: 'BNB Testnet',
    rpcUrl: 'https://data-seed-prebsc-1-s1.binance.org:8545/',
    explorer: 'https://testnet.bscscan.com',
    symbol: 'tBNB',
    requiresApiKey: false
  },
  goerli: {
    chainId: 5,
    name: 'Goerli Testnet',
    rpcUrl: 'https://rpc.ankr.com/eth_goerli',
    explorer: 'https://goerli.etherscan.io',
    symbol: 'GoerliETH',
    requiresApiKey: false
  },
  infuraMainnet: {
    chainId: 1,
    name: 'Infura ETH',
    rpcUrlTemplate: 'https://mainnet.infura.io/v3/{INFURA_KEY}',
    explorer: 'https://etherscan.io',
    symbol: 'ETH',
    requiresApiKey: true,
    provider: 'infura'
  },
  alchemyMainnet: {
    chainId: 1,
    name: 'Alchemy ETH',
    rpcUrlTemplate: 'https://eth-mainnet.g.alchemy.com/v2/{ALCHEMY_KEY}',
    explorer: 'https://etherscan.io',
    symbol: 'ETH',
    requiresApiKey: true,
    provider: 'alchemy'
  }
};
/**
 * @module this.wallet.types.ethereum
 * @description
 * Ethereum wallet type implementation.
 * Provides methods for generating addresses, signing messages, and verifying signatures.
 * Uses ethers.js for cryptographic operations.
 * Features: Stateless representation of an Ethereum wallet.
 * - GenerateAddress: Generates a new address for the wallet.
 * - Sign: Signs a message with the wallet's private key.
 * - GetBalance: Retrieves the balance of the wallet.
 * - Send: Sends a specified amount to a given address.
 * - AddNetwork: Adds a network configuration for the wallet.
 * - SetNetwork: Sets the current network for the wallet.
 * - VerifySignature: Verifies a signature against a message and address.
 * - Export: Exports the wallet's data in a JSON format.
 * - Import: Imports a wallet from JSON data.
 * - GetTypeInfo: Returns information about the wallet type and networks. 
 **/
import { Wallet, verifyMessage } from 'ethers';

export class WalletHandler {
  constructor(data = null) {
    if (typeof data === 'string') {
      // Just a privateKey
      this.wallet = new Wallet(data);
      this.mnemonic = null;
    } else if (data && typeof data.mnemonic === 'string') {
      // From mnemonic
      this.wallet = Wallet.fromPhrase(data.mnemonic);
      this.mnemonic = data.mnemonic;
    } else if (data && typeof data.privateKey === 'string') {
      // Full object import with privateKey
      this.wallet = new Wallet(data.privateKey);
      this.mnemonic = data.mnemonic || null;
    } else {
      // Generate new wallet and use mnemonic for recoverability
      const randomWallet = Wallet.createRandom();
      this.wallet = Wallet.fromPhrase(randomWallet.mnemonic.phrase);
      this.mnemonic = randomWallet.mnemonic.phrase;
    }

    // Use provided networks or fallback to defaultNetworks
    this.networks = data?.networks || { ...defaultNetworks };
    this.currentNetwork = data?.currentNetwork || null;

    this.address = this.wallet.address;
    this.privateKey = this.wallet.privateKey;
    this.publicKey = this.wallet.publicKey || null;
  }

  getAddress() {
    return this.wallet.address;
  }

  getPrivateKey() {
    return this.wallet.privateKey;
  }

  sign(message) {
    return this.wallet.signMessage(message);
  }

  verifySignature(message, signature) {
    return verifyMessage(message, signature) === this.wallet.address;
  }

  addNetwork(name, config) {
    if (!this.networks) this.networks = {};
    this.networks[name] = config;
  }

  setNetwork(name) {
    if (!this.networks || !this.networks[name]) {
      throw new Error(`Network ${name} is not defined`);
    }
    this.currentNetwork = name;
  }

  export() {
    return {
      type: 'ethereum',
      privateKey: this.wallet.privateKey,
      mnemonic: this.mnemonic || null,
      address: this.wallet.address,
      networks: this.networks || {},
      currentNetwork: this.currentNetwork || null
    };
  }

  static import(data) {
    return new WalletHandler(data);
  }

  getTypeInfo() {
    return {
      type: 'ethereum',
      address: this.wallet.address,
      currentNetwork: this.currentNetwork,
      availableNetworks: Object.keys(this.networks || {})
    };
  }
}