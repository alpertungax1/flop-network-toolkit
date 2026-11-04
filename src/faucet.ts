import { Wallet } from 'ethers';
import WebSocket from 'ws';

export interface FaucetFundResponse {
  success: boolean;
  amount?: number;
  tier?: string;
  txHash?: string;
  error?: string;
  retryAfterSeconds?: number;
}

export function buildSiweMessage(fundingAddr: string, evmAddr: string, domain = 'faucet.flop.network', uri = 'https://faucet.flop.network'): string {
  const now = new Date().toISOString();
  return [
    `${domain} wants you to sign in with your Ethereum account:`,
    evmAddr,
    '',
    'Bind this Ethereum human identity to the FLOP dev recipient address:',
    fundingAddr,
    '',
    `URI: ${uri}`,
    'Version: 1',
    'Chain ID: 1',
    `Issued At: ${now}`
  ].join('\n');
}

export async function requestQuickFund(recipientAddress: string, faucetUrl = 'https://faucet.flop.network'): Promise<FaucetFundResponse> {
  const res = await fetch(`${faucetUrl}/fund`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ address: recipientAddress })
  });

  const retryHeader = res.headers.get('Retry-After');
  const retryAfterSeconds = retryHeader ? parseInt(retryHeader, 10) : undefined;
  const json: any = await res.json().catch(() => ({}));

  return {
    success: res.ok && json.success,
    amount: json.amount,
    tier: json.tier,
    txHash: json.txHash,
    error: json.error || (!res.ok ? `HTTP ${res.status} ${res.statusText}` : undefined),
    retryAfterSeconds
  };
}

export async function requestVerifiedHumanFund(
  recipientAddress: string,
  evmPrivateKey: string,
  faucetUrl = 'https://faucet.flop.network'
): Promise<FaucetFundResponse> {
  const wallet = new Wallet(evmPrivateKey);
  const evmAddress = await wallet.getAddress();
  const domain = new URL(faucetUrl).host;
  const uri = new URL(faucetUrl).origin;

  const siweMessage = buildSiweMessage(recipientAddress, evmAddress, domain, uri);
  const siweSignature = await wallet.signMessage(siweMessage);

  const body = {
    address: recipientAddress,
    tier: 'linked',
    siweMessage,
    siweSignature
  };

  const res = await fetch(`${faucetUrl}/fund`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body)
  });

  const retryHeader = res.headers.get('Retry-After');
  const retryAfterSeconds = retryHeader ? parseInt(retryHeader, 10) : undefined;
  const json: any = await res.json().catch(() => ({}));

  return {
    success: res.ok && json.success,
    amount: json.amount,
    tier: json.tier,
    txHash: json.txHash,
    error: json.error || (!res.ok ? `HTTP ${res.status} ${res.statusText}` : undefined),
    retryAfterSeconds
  };
}

export async function checkFaucetStatus(faucetUrl = 'https://faucet.flop.network'): Promise<any> {
  const res = await fetch(`${faucetUrl}/health`);
  return res.json();
}
