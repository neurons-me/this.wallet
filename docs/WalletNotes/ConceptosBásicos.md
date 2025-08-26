# 🧱 1. Blockchain

Una blockchain es una red descentralizada con su propio mecanismo de consenso y reglas. Algunos ejemplos:
	•	Ethereum (EVM-based)
	•	Bitcoin
	•	Solana
	•	Binance Smart Chain (una bifurcación de Ethereum)

# 🌐 2. Network

Cada blockchain puede tener varias redes:
**Blockhain:** Ethereum; **Network:** Mainnet.                                                                                           **Blockchain:** Ethereum; **Network:** Goerli, Sepolia.                                                                                      **Blockchain:** Binance Smart Chain; **Network:** Mainnet.
**Blockchain:** Binance Smart Chain; **Network:** Testnet
**Blockchain:** Bitcoin; **Network:** Mainnet
**Blockchain:** Bitcoin; **Network:** Testne

En otras palabras:
	•	Una network es una instancia de una blockchain.
	•	Las wallets deben estar configuradas para operar en una red específica.

# 💰 3. Criptomonedas

Cada blockchain tiene su token nativo:
**Ethereum:** ETH
**Binance Smart Chain:** BNB
**Bitcoin:** BTC
**Solana:** SOL

Además, algunas blockchains (como Ethereum y BSC) permiten tokens adicionales como ERC20 / BEP20 (ej. USDT, DAI, CAKE…).

# 👜 4. Wallet Type

En **this.wallet**:

```js
new Wallet({ type: 'ethereum' })
```

Esto realmente debería significar:

```js
new Wallet({
  blockchain: 'ethereum',
  network: 'mainnet', // o 'sepolia', 'goerli', etc.
  crypto: 'ETH'
});

Y podrías soportar más, como:

new Wallet({
  blockchain: 'binance-smart-chain',
  network: 'mainnet',
  crypto: 'BNB'
});
```


⸻

**⚙️ ¿Qué significa esto para this.wallet?**
 1. La clase **Wallet** necesita ser más expresiva:

    ```js
    constructor({ blockchain = 'ethereum', network = 'mainnet' } = {}) {
      this.blockchain = blockchain;
      this.network = network;
      this.address = this.generateAddress();
      ...
    }
    ```

2.	Métodos como .send() deben saber en qué red están operando.
3.	Firmas y transacciones usan librerías diferentes:
•	ethers para EVM-based
•	bitcoinjs-lib para Bitcoin
•	stellar-sdk, etc.

### 🔮 Resumen visual

**Wallet**
 ├─ **Blockchain:** Ethereum
 │   ├─ **Network:** Mainnet / Goerli / Sepolia
 │   └─ **Crypto:** ETH / ERC20 Tokens
 ├─ **Blockchain:** BSC
 │   ├─ **Network:** Mainnet / Testnet
 │   └─ **Crypto:** BNB / BEP20 Tokens
 └─ **Blockchain:** Bitcoin
     ├─ **Network:** Mainnet / Testnet
     └─ **Crypto:** BTC
