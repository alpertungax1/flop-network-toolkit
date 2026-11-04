# Task Checklist: Flop Network Devnet Toolkit

**Feature:** `SPEC-001`  
**Target Directory:** `C:\Users\ozugu\.gemini\antigravity\scratch\flop-network-toolkit`

- [ ] **Task 1: Repository Scaffolding**
  - [ ] Initialize `package.json` with dependencies (`ethers`, `@polkadot/keyring`, `@polkadot/util-crypto`, `commander`, `dotenv`, `ws`).
  - [ ] Configure `tsconfig.json` for modern ESM build.
  - [ ] Configure `.gitignore` (ignore node_modules, dist, *.keystore.json, .env*).
  - [ ] Create `.env.example` with Flop Devnet defaults.
  - [ ] Add MIT License.

- [ ] **Task 2: Network & Diagnostics Module (`src/network.ts`)**
  - [ ] Implement RPC health check against `wss://rpc.devnet.flop.network`.
  - [ ] Fetch chain metadata, runtime version, genesis hash, and miner counts.

- [ ] **Task 3: Key Management & Keystore Module (`src/keys.ts`)**
  - [ ] Implement Ed25519 keypair generation and mnemonic derivation.
  - [ ] Implement Polkadot JSON keystore encryption and decryption.
  - [ ] Derive W3C DID identifiers (`did:key:...`).

- [ ] **Task 4: Faucet Automation Module (`src/faucet.ts`)**
  - [ ] Quick fund (25 FLOP) client.
  - [ ] EIP-4361 SIWE message builder matching Flop Network faucet format.
  - [ ] Headless EVM signer (`ethers.Wallet`) for SIWE proof submission.
  - [ ] Browser CDP integration helper for extension signing.
  - [ ] Exponential backoff retry handler for `503 Grant pending` status.

- [ ] **Task 5: Model Registry & Inference Module (`src/models.ts`)**
  - [ ] Devnet model hashes catalog (1B, 8B, 28B).
  - [ ] Runner wrapper around `@flop-labs/cli` for gateway chat and PoUI verification.

- [ ] **Task 6: Unified CLI Entrypoint (`src/cli.ts` / `bin/flop-kit.js`)**
  - [ ] Command tree: `health`, `key`, `balance`, `faucet`, `models`, `test-agent`.
  - [ ] Both human-readable colored tables and `--json` outputs.

- [ ] **Task 7: Documentation & GitHub Infrastructure**
  - [ ] Production-grade `README.md` with architectural diagram, quickstart, and examples.
  - [ ] GitHub Actions CI workflow (`.github/workflows/ci.yml`).
  - [ ] Initialize Git repository (`git init`, initial commit).

- [ ] **Task 8: Build & End-to-End Verification**
  - [ ] Compile TypeScript.
  - [ ] Run test commands against live Flop Devnet.
