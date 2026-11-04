# Flop Network Toolkit Constitution

## Core Principles

### I. Zero Secret Leakage (Security-First)
No private keys, raw seed phrases, mnemonics, or credentials may ever be committed to git, logged to stdout/stderr in plain text, or exposed in error stack traces. All wallet key operations must use encrypted Polkadot JSON keystores or environment variable overrides (`FLOP_KEYSTORE_PASS`, `FLOP_IMPORT_SEED`). `.gitignore` must strictly ignore all `.env*` files, keystores, and profile directories.

### II. Dual-Stack Interoperability (EVM + Substrate)
Flop Network requires bridging EVM human identity (EIP-4361 / SIWE) with Substrate SS58 addresses. The toolkit must support:
- Headless SIWE signature generation via standard private keys (ethers / viem).
- Browser wallet CDP automation (Rabby / MetaMask) for users who keep keys in hardware/extension wallets.
- Substrate Ed25519/Sr25519 key management and Polkadot JSON format.

### III. CLI & Programmatic Library Dual Interface
Every feature must be accessible via both:
1. CLI subcommands (`flop-kit <command>` with `--json` and human-readable output options).
2. Clean, type-safe programmatic exports (Node.js / ES Modules).

### IV. Resilient Network & Faucet Handling
The Flop Devnet faucet and RPC endpoints use rate-limiting and queueing (`503 Grant Pending` with `retryAfterSeconds: 60`). The toolkit must handle queue states gracefully, providing clear status reports rather than treating queueing as a fatal error.

### V. Simplicity & Minimal Surface Area
Do not reinvent Substrate or EVM primitives when official, vetted libraries (`@polkadot/util-crypto`, `@polkadot/keyring`, `ethers`, `@flop-labs/cli`) exist. Wrap and orchestrate them into clean, 1-command workflows.

## Technology Stack & Standards
- **Runtime**: Node.js (>= 18) / TypeScript / ESM.
- **Crypto Libraries**: `ethers` (v6) for EVM / SIWE, `@polkadot/keyring` and `@polkadot/util-crypto` for Substrate SS58/Ed25519.
- **Flop Protocol Tools**: `@flop-labs/cli` integration.
- **Testing**: `node:test` or `vitest` for deterministic unit tests.

## Governance
This Constitution defines the architectural baseline for `flop-network-toolkit`. Any feature additions or pull requests must adhere to the zero-leakage security rule and the dual-stack interface standard.

**Version**: 1.0.0 | **Ratified**: 2026-11-04 | **Status**: Active
