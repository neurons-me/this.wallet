import * as Ethereum from './types/ethereum.js';
import * as Bitcoin from './types/bitcoin.js';
import * as Stellar from './types/stellar.js';
function createHandler(type, options) {
  switch (type) {
    case 'ethereum':
      return new Ethereum.WalletHandler(options);
    case 'bitcoin':
      return new Bitcoin.WalletHandler(options);
    case 'stellar':
      return new Stellar.WalletHandler(options);
    default:
      throw new Error(`Unsupported wallet type: ${type}`);
  }
}

/**
 * Wallet class - Stateless representation of a blockchain wallet.
 * Behavior is determined by the wallet type (e.g., 'ethereum', 'bitcoin', 'stellar').
 * All private keys and cryptographic logic must be passed in or handled externally.
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
 */

export class wallet {
  constructor({ type = 'ethereum', privateKey = null, publicKey = null, address = null } = {}) {
    this.handler = createHandler(type, { privateKey, publicKey, address });
    this.type = type;
    this._promoteHandlerMethods();
    this.networks = {};
    this.currentNetwork = null;
  }

  _promoteHandlerMethods() {
    const handler = this.handler;
    const methodNames = Object.getOwnPropertyNames(Object.getPrototypeOf(handler)).filter(
      name => typeof handler[name] === 'function' && name !== 'constructor'
    );
    for (const name of methodNames) {
      this[name] = handler[name].bind(handler);
    }
  }

  export() {
    return {
      type: this.type,
      privateKey: this.privateKey,
      publicKey: this.publicKey,
      address: this.address,
      mnemonic: this.mnemonic || null,
      networks: this.networks || {},
      currentNetwork: this.currentNetwork || null
    };
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

  getTypeInfo() {
    return {
      type: this.type,
      address: this.address,
      currentNetwork: this.currentNetwork,
      availableNetworks: Object.keys(this.networks || {})
    };
  }

  get address() {
    return this.handler.address;
  }

  get publicKey() {
    return this.handler.publicKey;
  }

  get privateKey() {
    return this.handler.privateKey;
  }

  get mnemonic() {
    return this.handler.mnemonic;
  }

  static import(json) {
    const wallet = new Wallet(json);
    wallet.networks = json.networks || {};
    wallet.currentNetwork = json.currentNetwork || null;
    if (json.mnemonic && wallet.handler) {
      wallet.handler.mnemonic = json.mnemonic;
    }
    return wallet;
  }
}
export default wallet;