import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';

export interface KeyGenerationOptions {
  name?: string;
  type?: 'ed25519' | 'sr25519';
  outPath: string;
  passwordEnv: string;
}

export interface KeystoreMetadata {
  address: string;
  encoded: string;
  encoding: {
    content: string[];
    type: string[];
    version: string;
  };
  meta: {
    name?: string;
    genesisHash?: string;
    whenCreated?: number;
  };
}

export function generateKeystore(options: KeyGenerationOptions): { address: string; outPath: string } {
  const { name = 'flop-key', type = 'ed25519', outPath, passwordEnv } = options;

  if (!process.env[passwordEnv]) {
    throw new Error(`Environment variable ${passwordEnv} must be set for keystore encryption.`);
  }

  const resolvedOut = path.resolve(outPath);
  const outDir = path.dirname(resolvedOut);
  if (!fs.existsSync(outDir)) {
    fs.mkdirSync(outDir, { recursive: true });
  }

  const cmd = `npx @flop-labs/cli@0.4.0 keys generate --name "${name}" --type ${type} --out "${resolvedOut}" --password-env "${passwordEnv}" --json`;
  const output = execSync(cmd, { encoding: 'utf-8', stdio: ['ignore', 'pipe', 'pipe'] });
  
  try {
    const parsed = JSON.parse(output);
    return {
      address: parsed.address || 'Generated',
      outPath: resolvedOut
    };
  } catch {
    // If not clean JSON, read keystore
    const data = JSON.parse(fs.readFileSync(resolvedOut, 'utf-8'));
    return {
      address: data.address,
      outPath: resolvedOut
    };
  }
}

export function inspectKeystore(filePath: string): KeystoreMetadata {
  const resolved = path.resolve(filePath);
  if (!fs.existsSync(resolved)) {
    throw new Error(`Keystore file not found at: ${resolved}`);
  }
  const raw = fs.readFileSync(resolved, 'utf-8');
  return JSON.parse(raw) as KeystoreMetadata;
}

export function importKeyToKeystore(secretEnv: string, passwordEnv: string, outPath: string, name = 'imported-key', type = 'ed25519'): { address: string; outPath: string } {
  if (!process.env[secretEnv]) {
    throw new Error(`Environment variable ${secretEnv} containing seed/secret is not set.`);
  }
  if (!process.env[passwordEnv]) {
    throw new Error(`Environment variable ${passwordEnv} containing password is not set.`);
  }

  const resolvedOut = path.resolve(outPath);
  const outDir = path.dirname(resolvedOut);
  if (!fs.existsSync(outDir)) {
    fs.mkdirSync(outDir, { recursive: true });
  }

  const cmd = `npx @flop-labs/cli@0.4.0 keys import --name "${name}" --type ${type} --secret-env "${secretEnv}" --password-env "${passwordEnv}" --out "${resolvedOut}" --json`;
  execSync(cmd, { encoding: 'utf-8', stdio: ['ignore', 'pipe', 'pipe'] });

  const data = JSON.parse(fs.readFileSync(resolvedOut, 'utf-8'));
  return {
    address: data.address,
    outPath: resolvedOut
  };
}
