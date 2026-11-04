#!/usr/bin/env node

import { Command } from 'commander';
import dotenv from 'dotenv';
import { checkRpcHealth, DEVNET_CONFIG } from './network.js';
import { generateKeystore, importKeyToKeystore, inspectKeystore } from './keys.js';
import { requestQuickFund, requestVerifiedHumanFund, checkFaucetStatus } from './faucet.js';
import { DEVNET_MODELS, listOnChainModels } from './models.js';
import { execSync } from 'child_process';

dotenv.config();

const program = new Command();

program
  .name('flop-kit')
  .description('All-in-one developer toolkit for Flop Network Devnet & Testnet')
  .version('1.0.0');

// 1. Health Command
program
  .command('health')
  .description('Check live RPC and Gateway health for Flop Network')
  .option('--rpc <url>', 'Override RPC URL', DEVNET_CONFIG.rpcUrl)
  .option('--json', 'Output results in JSON format')
  .action(async (options) => {
    try {
      const health = await checkRpcHealth(options.rpc);
      if (options.json) {
        console.log(JSON.stringify(health, null, 2));
      } else {
        console.log('\n=== FLOP NETWORK DEVNET HEALTH ===');
        console.log(`Status:         ${health.status === 'ONLINE' ? '🟢 ONLINE' : '🔴 OFFLINE'}`);
        console.log(`Endpoint:       ${health.endpoint}`);
        console.log(`Chain Name:     ${health.chain}`);
        console.log(`Client Version: ${health.clientVersion}`);
        console.log(`Spec Name:      ${health.specName} (v${health.specVersion})`);
        console.log(`Genesis Hash:   ${health.genesisHash}`);
        console.log(`RPC Latency:    ${health.latencyMs} ms\n`);
      }
    } catch (err: any) {
      console.error('Health check failed:', err.message);
      process.exit(1);
    }
  });

// 2. Key Commands
const keyCmd = program.command('key').description('Substrate key and Polkadot keystore operations');

keyCmd
  .command('generate')
  .description('Generate a new Ed25519 keypair and encrypted Polkadot JSON keystore')
  .requiredOption('--out <path>', 'Path to save keystore file')
  .requiredOption('--password-env <name>', 'Name of environment variable containing the encryption password')
  .option('--name <name>', 'Metadata name for the keystore', 'flop-agent')
  .option('--type <type>', 'Key type (ed25519 | sr25519)', 'ed25519')
  .action((options) => {
    try {
      console.log(`Generating ${options.type} keypair...`);
      const res = generateKeystore({
        name: options.name,
        type: options.type as any,
        outPath: options.out,
        passwordEnv: options.passwordEnv
      });
      console.log('✅ Keystore generated successfully!');
      console.log(`Address:  ${res.address}`);
      console.log(`Location: ${res.outPath}`);
    } catch (err: any) {
      console.error('Key generation failed:', err.message);
      process.exit(1);
    }
  });

keyCmd
  .command('import')
  .description('Import an existing raw seed into an encrypted Polkadot JSON keystore')
  .requiredOption('--secret-env <name>', 'Environment variable containing seed or hex secret')
  .requiredOption('--password-env <name>', 'Environment variable containing encryption password')
  .requiredOption('--out <path>', 'Path to save keystore file')
  .option('--name <name>', 'Keystore name', 'imported-key')
  .action((options) => {
    try {
      const res = importKeyToKeystore(options.secretEnv, options.passwordEnv, options.out, options.name);
      console.log('✅ Key imported successfully!');
      console.log(`Address:  ${res.address}`);
      console.log(`Location: ${res.outPath}`);
    } catch (err: any) {
      console.error('Key import failed:', err.message);
      process.exit(1);
    }
  });

keyCmd
  .command('inspect')
  .description('Inspect metadata of an existing Polkadot JSON keystore')
  .argument('<path>', 'Path to keystore JSON')
  .action((path) => {
    try {
      const meta = inspectKeystore(path);
      console.log('\n=== KEYSTORE METADATA ===');
      console.log(`Address:  ${meta.address}`);
      console.log(`Name:     ${meta.meta?.name || 'Unnamed'}`);
      console.log(`Type:     ${meta.encoding?.content?.join(', ') || 'Unknown'}`);
      console.log(`Created:  ${meta.meta?.whenCreated ? new Date(meta.meta.whenCreated).toISOString() : 'Unknown'}\n`);
    } catch (err: any) {
      console.error('Inspection failed:', err.message);
      process.exit(1);
    }
  });

// 3. Balance Command
program
  .command('balance')
  .description('Check FLOP token balance for an SS58 address')
  .argument('<address>', 'Recipient SS58 address')
  .option('--network <network>', 'Network profile', 'devnet')
  .action((address, options) => {
    try {
      const cmd = `npx @flop-labs/cli@0.4.0 balance ${address} --network ${options.network}`;
      const out = execSync(cmd, { encoding: 'utf-8' });
      console.log(out);
    } catch (err: any) {
      console.error('Balance query failed:', err.message);
      process.exit(1);
    }
  });

// 4. Faucet Commands
const faucetCmd = program.command('faucet').description('Claim test FLOP tokens from the devnet faucet');

faucetCmd
  .command('quick')
  .description('Claim 25 FLOP via unverified quick fund')
  .argument('<address>', 'Recipient SS58 address')
  .option('--faucet <url>', 'Faucet URL', DEVNET_CONFIG.faucetUrl)
  .action(async (address, options) => {
    try {
      console.log(`Requesting quick fund for ${address}...`);
      const res = await requestQuickFund(address, options.faucet);
      if (res.success) {
        console.log(`✅ Funded ${res.amount || 25} FLOP! TxHash: ${res.txHash || 'Included'}`);
      } else {
        console.log(`Status: ${res.error || 'Pending'}`);
        if (res.retryAfterSeconds) {
          console.log(`⏳ Faucet queue busy. Retry after ${res.retryAfterSeconds} seconds.`);
        }
      }
    } catch (err: any) {
      console.error('Quick faucet request failed:', err.message);
      process.exit(1);
    }
  });

faucetCmd
  .command('human')
  .description('Claim 500-2,000 FLOP via EIP-4361 (SIWE) Verified Human proof')
  .argument('<address>', 'Recipient SS58 address')
  .requiredOption('--evm-key-env <name>', 'Environment variable containing EVM signer private key')
  .option('--faucet <url>', 'Faucet URL', DEVNET_CONFIG.faucetUrl)
  .action(async (address, options) => {
    try {
      const pKey = process.env[options.evmKeyEnv];
      if (!pKey) {
        throw new Error(`Environment variable ${options.evmKeyEnv} is not defined.`);
      }
      console.log(`Generating SIWE signature and claiming verified grant for ${address}...`);
      const res = await requestVerifiedHumanFund(address, pKey, options.faucet);
      if (res.success) {
        console.log(`🎉 Success! Funded ${res.amount} FLOP (Tier: ${res.tier}). Tx: ${res.txHash}`);
      } else {
        console.log(`Notice: ${res.error || 'Queue response'}`);
        if (res.retryAfterSeconds) {
          console.log(`⏳ Verified human grant queued (Grant pending). Faucet will process in ~${res.retryAfterSeconds} seconds.`);
        }
      }
    } catch (err: any) {
      console.error('Verified human claim failed:', err.message);
      process.exit(1);
    }
  });

faucetCmd
  .command('status')
  .description('Check faucet health and server readiness')
  .action(async () => {
    try {
      const status = await checkFaucetStatus();
      console.log('Faucet Health:', status);
    } catch (err: any) {
      console.error('Faucet status query failed:', err.message);
    }
  });

// 5. Models Command
program
  .command('models')
  .description('List registered AI models on Flop Network Devnet')
  .action(() => {
    console.log('\n=== FLOP NETWORK DEVNET REGISTERED MODELS ===\n');
    DEVNET_MODELS.forEach((m) => {
      console.log(`🤖 ${m.name} (${m.parameters})`);
      console.log(`   Hash:        ${m.hash}`);
      console.log(`   Family:      ${m.family}`);
      console.log(`   Description: ${m.description}\n`);
    });
  });

program.parse(process.argv);
