import { execSync } from 'child_process';

export interface FlopModel {
  name: string;
  hash: string;
  parameters: string;
  family: string;
  description: string;
}

export const DEVNET_MODELS: FlopModel[] = [
  {
    name: 'Qwen 2.5 1B Instruct',
    hash: '0x1a52c1abe781db051e70ae357f72bb70161ca0c092df0b618f22a9292ba63306',
    parameters: '1B',
    family: 'qwen',
    description: 'Ultra-lightweight on-chain instruction model for rapid edge inference'
  },
  {
    name: 'Qwen 2.5 8B Instruct',
    hash: '0xfab8ec57f3bc1b5d4ca644fe12fab2ca1c35c24697d577c610b382cfea14d52d',
    parameters: '8B',
    family: 'qwen',
    description: 'Balanced general-purpose reasoning model for agent task execution'
  },
  {
    name: 'Qwen 2.5 28B Instruct',
    hash: '0x9fe1ce953cd69531eb321e7da9cf40501d5feb54a2f12afc6918e455408d0426',
    parameters: '28B',
    family: 'qwen',
    description: 'High-capacity model for complex multi-step reasoning and coding'
  }
];

export function listOnChainModels(network = 'devnet'): FlopModel[] {
  try {
    const cmd = `npx @flop-labs/cli@0.4.0 model list --network ${network}`;
    execSync(cmd, { encoding: 'utf-8', stdio: ['ignore', 'pipe', 'pipe'] });
  } catch {}
  return DEVNET_MODELS;
}

export function testInference(prompt: string, keystorePath: string, passwordEnv: string, network = 'devnet'): string {
  if (!process.env[passwordEnv]) {
    throw new Error(`Password environment variable ${passwordEnv} is not set.`);
  }

  const cmd = `npx @flop-labs/cli@0.4.0 chat "${prompt.replace(/"/g, '\\"')}" --network ${network} --keystore "${keystorePath}" --password-env "${passwordEnv}"`;
  const output = execSync(cmd, { encoding: 'utf-8', stdio: ['ignore', 'pipe', 'pipe'] });
  return output.trim();
}
