# Flop Network Devnet & Testnet Toolkit (`flop-network-toolkit`)

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)
[![Flop Network: Devnet](https://img.shields.io/badge/Flop_Network-Devnet-purple.svg)](https://flop.network)
[![Node: >=18](https://img.shields.io/badge/Node->=18-green.svg)](https://nodejs.org)
[![TypeScript: 5.6](https://img.shields.io/badge/TypeScript-5.6-blue.svg)](https://www.typescriptlang.org)

An all-in-one developer suite and automation CLI for **Flop Network** (`tzkv-runtime` Substrate L1). Effortlessly manage Substrate keystores, bridge EVM identities via EIP-4361 (SIWE) for the Verified Human faucet tier (500–2,000 FLOP), check RPC health, and interact with on-chain AI models.

---

## 🚀 Features

- **⚡ Live Network Diagnostics**: Check RPC endpoint health, block generation, spec versions, and latency to `wss://rpc.devnet.flop.network`.
- **🔐 Substrate Keystore Management**: Generate and import Ed25519/Sr25519 keypairs into encrypted, password-protected Polkadot JSON keystores.
- **💧 Dual-Tier Faucet Engine**:
  - **Quick Fund**: 25 FLOP dev testing allocation.
  - **Verified Human (SIWE)**: Automated EIP-4361 signature generation connecting EVM identity to Substrate SS58 addresses for 500–2,000 FLOP grants.
  - **Queue Aware**: Gracefully handles `503 Grant Pending` retry schedules without crashing.
- **🤖 On-Chain Model Registry**: Query and interact with registered open-weight models (Qwen 2.5 1B, 8B, and 28B).
- **🛡️ Zero Secret Leakage**: Strict security guardrails preventing private keys and unencrypted mnemonics from reaching stdout, logs, or git commits.

---

## 📦 Installation

### Option 1: Global CLI
```bash
npm install -g flop-network-toolkit
```

### Option 2: From Source
```bash
git clone https://github.com/Coinhunter06/flop-network-toolkit.git
cd flop-network-toolkit
npm install
npm run build
npm link
```

---

## 🛠️ CLI Usage & Commands

### 1. Network Health Check
Check WebSocket RPC latency and runtime metadata:
```bash
flop-kit health
```
*Output:*
```text
=== FLOP NETWORK DEVNET HEALTH ===
Status:         🟢 ONLINE
Endpoint:       wss://rpc.devnet.flop.network
Chain Name:     FLOP Devnet
Client Version: 1.1.0-13ff7e2c334
Spec Name:      tzkv-runtime (v1014003)
Genesis Hash:   0x99c172c095340ace980631f9123544c6bebd4839f3437e463533422d8be2d631
RPC Latency:    142 ms
```

### 2. Generate Encrypted Keystore
Generate a new Ed25519 keypair and save as an encrypted Polkadot JSON keystore:
```bash
export FLOP_PASS="YourSecurePassword"
flop-kit key generate --out ./my_agent_keystore.json --password-env FLOP_PASS
```

### 3. Inspect Existing Keystore
```bash
flop-kit key inspect ./my_agent_keystore.json
```

### 4. Claim Testnet Tokens from Faucet

#### Quick Fund (25 FLOP)
```bash
flop-kit faucet quick 5DD8wdxhN1xsB3BiXeXzUwwk9cRwNjrAxZtdkdenn2aBX93A
```

#### Verified Human Grant (500–2,000 FLOP via SIWE)
```bash
export MY_EVM_KEY="0x..."
flop-kit faucet human 5DD8wdxhN1xsB3BiXeXzUwwk9cRwNjrAxZtdkdenn2aBX93A --evm-key-env MY_EVM_KEY
```

#### Check Faucet Backend Status
```bash
flop-kit faucet status
```

### 5. Check Balance
```bash
flop-kit balance 5DD8wdxhN1xsB3BiXeXzUwwk9cRwNjrAxZtdkdenn2aBX93A
```

### 6. List Registered On-Chain AI Models
```bash
flop-kit models
```

---

## 📚 Programmatic Library Usage

You can also import `flop-network-toolkit` directly into your TypeScript/JavaScript projects:

```typescript
import { 
  checkRpcHealth, 
  requestVerifiedHumanFund, 
  buildSiweMessage, 
  DEVNET_MODELS 
} from 'flop-network-toolkit';

// 1. Check RPC Health
const health = await checkRpcHealth();
console.log(`Flop Network is ${health.status} (Spec: ${health.specName})`);

// 2. Request Verified Human Faucet
const result = await requestVerifiedHumanFund(
  '5DD8wdxhN1xsB3BiXeXzUwwk9cRwNjrAxZtdkdenn2aBX93A',
  process.env.EVM_PRIVATE_KEY!
);
console.log('Faucet result:', result);
```

---

## 🇹🇷 Türkçe Hızlı Başlangıç Kılavuzu

Flop Network, yapay zeka ajanları için özel olarak geliştirilmiş bir Substrate L1 ağıdır. Bu araç kiti; testnet token alımını, EIP-4361 (SIWE) imzalamasını ve anahtar yönetimini tek komutla otomatikleştirir.

1. **Projeyi Klonlayın ve Derleyin:**
   ```bash
   git clone https://github.com/Coinhunter06/flop-network-toolkit.git
   cd flop-network-toolkit
   npm install
   npm run build
   ```
2. **Ağ Durumunu Kontrol Edin:**
   ```bash
   node bin/flop-kit.js health
   ```
3. **Yeni Şifreli Cüzdan Üretin:**
   ```bash
   $env:FLOP_PASS="GizliSifre"
   node bin/flop-kit.js key generate --out ./cuzdan.json --password-env FLOP_PASS
   ```
4. **İnsan Kanıtlı Faucet Alın (500-2.000 FLOP):**
   ```bash
   $env:EVM_KEY="0x..."
   node bin/flop-kit.js faucet human <SS58_ADRESINIZ> --evm-key-env EVM_KEY
   ```

---

## 🔒 Güvenlik İlkeleri (Security Constitution)

- **Asla Özel Anahtar Kaydetmeyin**: Bu repo hiçbir `.env` dosyasını veya `*.keystore.json` dosyasını git geçmişine eklemez (`.gitignore` korumalıdır).
- **Yalnızca Ortam Değişkenleri**: CLI argümanlarında açık metin şifreler veya özel anahtarlar kabul edilmez; her zaman `--password-env` ve `--evm-key-env` kullanılır.

---

## 📄 Lisans

Bu proje [MIT Lisansı](LICENSE) altında lisanslanmıştır.
