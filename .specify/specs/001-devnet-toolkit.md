# Feature Specification: Flop Network Devnet Toolkit

**Feature ID:** `SPEC-001`  
**Status:** Approved  
**Created:** 2026-11-04  
**Target Project:** `flop-network-toolkit`

---

## 1. Executive Summary
Flop Network is a Substrate L1 blockchain tailored for decentralized AI agent execution, model registry, and Proof of Useful Inference (PoUI). Engaging with the testnet currently requires juggling two ecosystems: EVM for EIP-4361 (SIWE) "Verified Human" proof, and Substrate (SS58/Ed25519) for token storage, agent operation, and model invocation.

The **Flop Network Devnet Toolkit** (`flop-network-toolkit`) provides an all-in-one developer suite and CLI tool that streamlines:
1. Network and RPC node diagnostics.
2. Generation and encryption of Substrate Ed25519 keystores.
3. Automated "Verified Human" faucet claims (both headless with EVM private keys and browser-automated via Chrome DevTools Protocol).
4. Direct testing of on-chain inference and model registry.

---

## 2. Core Requirements

### Requirement 1: Network Health & Profile Discovery
- Discover network metadata from `wss://rpc.devnet.flop.network` and `https://api.flop.network`.
- Display genesis hash (`0x99c172...`), spec version (`tzkv-runtime` 1014003), and active miner count.

### Requirement 2: Key Management & Keystore Generation
- Generate new random Ed25519 Substrate keypairs (SS58 format `5...`) with accompanying BIP-39 mnemonic.
- Import existing seeds or hex keys.
- Export password-protected Polkadot JSON keystores.
- Derive W3C compliant DIDs (`did:key:...`).

### Requirement 3: Dual-Mode Faucet Claiming
- **Mode 1: Quick Fund (Anonymous)**: 25 FLOP via direct faucet API request.
- **Mode 2: Verified Human (EVM SIWE)**:
  - Generate standards-compliant EIP-4361 SIWE message binding EVM address to recipient Substrate SS58 address.
  - Sign message using headless EVM signer (`ethers.Wallet`) or via Chrome CDP browser extension (Rabby/MetaMask).
  - Submit proof payload (`{ address, siweSignature, siweMessage }`) to `https://faucet.flop.network/verify/evm`.
  - Handle `503 Grant pending` retry cycle with exponential backoff and countdown timer.

### Requirement 4: On-Chain Model & Inference Testing
- Query registered models on devnet (1B, 8B, 28B hashes).
- Invoke gateway chat/inference test via `@flop-labs/cli` wrapper.

### Requirement 5: Developer Experience & Git Repository Readiness
- Ready-to-publish NPM structure (`package.json`, TypeScript build, `bin/flop-kit.js`).
- `.env.example` preconfigured with devnet endpoints.
- Comprehensive `README.md` in English and Turkish with step-by-step setup guides.
- GitHub Actions CI workflow for linting and build validation.

---

## 3. CLI Command Specifications

```bash
# Network diagnostics
flop-kit health

# Key management
flop-kit key generate --keystore ./my_keystore.json --password-env PASS
flop-kit key import --secret-env SEED --keystore ./my_keystore.json --password-env PASS

# Balance checking
flop-kit balance <ss58_address>

# Faucet claim
flop-kit faucet quick <ss58_address>
flop-kit faucet human <ss58_address> --evm-key-env EVM_PRIVATE_KEY
flop-kit faucet human <ss58_address> --browser-cdp http://127.0.0.1:9222

# Inference testing
flop-kit models
flop-kit test-inference --keystore ./my_keystore.json --password-env PASS --prompt "Hello Flop!"
```
