# Task Checklist: Flop Network Devnet Toolkit

**Feature:** `SPEC-001`  
**Target Directory:** `C:\Users\ozugu\.gemini\antigravity\scratch\flop-network-toolkit`

- [x] **Task 1: Repository Scaffolding**
  - [x] Initialize `package.json` with dependencies (`ethers`, `commander`, `dotenv`, `ws`).
  - [x] Configure `tsconfig.json` for modern ESM build.
  - [x] Configure `.gitignore` (ignore node_modules, dist, *.keystore.json, .env*).
  - [x] Create `.env.example` with Flop Devnet defaults.
  - [x] Add MIT License.

- [x] **Task 2: Network & Diagnostics Module (`src/network.ts`)**
  - [x] Implement RPC health check against `wss://rpc.devnet.flop.network`.
  - [x] Fetch chain metadata, runtime version, genesis hash, and latency.

- [x] **Task 3: Key Management & Keystore Module (`src/keys.ts`)**
  - [x] Implement Ed25519/Sr25519 keypair generation.
  - [x] Implement Polkadot JSON keystore encryption and metadata inspection.
  - [x] Support secret import via environment variables.

- [x] **Task 4: Faucet Automation Module (`src/faucet.ts`)**
  - [x] Quick fund (25 FLOP) client.
  - [x] EIP-4361 SIWE message builder matching Flop Network faucet format.
  - [x] Headless EVM signer (`ethers.Wallet`) for SIWE proof submission.
  - [x] Retry header and queue handler (`503 Grant pending`).

- [x] **Task 5: Model Registry & Inference Module (`src/models.ts`)**
  - [x] Devnet model hashes catalog (1B, 8B, 28B).
  - [x] Runner wrapper for inference verification.

- [x] **Task 6: Unified CLI Entrypoint (`src/cli.ts` / `bin/flop-kit.js`)**
  - [x] Command tree: `health`, `key`, `balance`, `faucet`, `models`.
  - [x] Both human-readable formatted output and `--json`.

- [x] **Task 7: Documentation & GitHub Infrastructure**
  - [x] Production-grade `README.md` in English and Turkish.
  - [x] GitHub Actions CI workflow (`.github/workflows/ci.yml`).
  - [x] Initialize Git repository with clean initial commit.

- [x] **Task 8: Build & End-to-End Verification**
  - [x] Compile TypeScript with 0 errors.
  - [x] Run test commands against live Flop Devnet (`health`, `faucet status`, `models`, `key inspect`).
