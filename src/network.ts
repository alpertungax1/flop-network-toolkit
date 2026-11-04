import WebSocket from 'ws';

export interface NetworkHealth {
  chain: string;
  clientVersion: string;
  specName: string;
  specVersion: number;
  genesisHash: string;
  latencyMs: number;
  status: 'ONLINE' | 'OFFLINE';
  endpoint: string;
}

export interface NetworkConfig {
  network: string;
  rpcUrl: string;
  gatewayUrl: string;
  faucetUrl: string;
  explorerUrl: string;
}

export const DEVNET_CONFIG: NetworkConfig = {
  network: 'devnet',
  rpcUrl: 'wss://rpc.devnet.flop.network',
  gatewayUrl: 'https://api.flop.network',
  faucetUrl: 'https://faucet.flop.network',
  explorerUrl: 'https://explorer.devnet.flop.network'
};

export async function checkRpcHealth(rpcUrl = DEVNET_CONFIG.rpcUrl, timeoutMs = 7000): Promise<NetworkHealth> {
  const startTime = Date.now();

  return new Promise((resolve, reject) => {
    let ws: WebSocket;
    const timeout = setTimeout(() => {
      if (ws) ws.terminate();
      resolve({
        chain: 'Unknown',
        clientVersion: 'Unknown',
        specName: 'Unknown',
        specVersion: 0,
        genesisHash: 'Unknown',
        latencyMs: timeoutMs,
        status: 'OFFLINE',
        endpoint: rpcUrl
      });
    }, timeoutMs);

    try {
      ws = new WebSocket(rpcUrl);
    } catch (e) {
      clearTimeout(timeout);
      return resolve({
        chain: 'Unknown',
        clientVersion: 'Unknown',
        specName: 'Unknown',
        specVersion: 0,
        genesisHash: 'Unknown',
        latencyMs: -1,
        status: 'OFFLINE',
        endpoint: rpcUrl
      });
    }

    const pending = new Map<number, (res: any) => void>();
    let idCounter = 1;

    function rpcCall(method: string, params: any[] = []): Promise<any> {
      return new Promise((res) => {
        const id = idCounter++;
        pending.set(id, res);
        ws.send(JSON.stringify({ jsonrpc: '2.0', id, method, params }));
      });
    }

    ws.on('message', (data) => {
      try {
        const msg = JSON.parse(data.toString());
        if (msg.id && pending.has(msg.id)) {
          const cb = pending.get(msg.id)!;
          pending.delete(msg.id);
          cb(msg.result);
        }
      } catch {}
    });

    ws.on('open', async () => {
      try {
        const chainPromise = rpcCall('system_chain');
        const versionPromise = rpcCall('system_version');
        const genesisPromise = rpcCall('chain_getBlockHash', [0]);
        const runtimePromise = rpcCall('state_getRuntimeVersion');

        const [chain, clientVersion, genesisHash, runtime] = await Promise.all([
          chainPromise,
          versionPromise,
          genesisPromise,
          runtimePromise
        ]);

        const latencyMs = Date.now() - startTime;
        clearTimeout(timeout);
        ws.close();

        resolve({
          chain: chain || 'FLOP Devnet',
          clientVersion: clientVersion || 'Unknown',
          specName: runtime?.specName || 'tzkv-runtime',
          specVersion: runtime?.specVersion || 0,
          genesisHash: genesisHash || 'Unknown',
          latencyMs,
          status: 'ONLINE',
          endpoint: rpcUrl
        });
      } catch (err) {
        clearTimeout(timeout);
        ws.close();
        resolve({
          chain: 'Unknown',
          clientVersion: 'Unknown',
          specName: 'Unknown',
          specVersion: 0,
          genesisHash: 'Unknown',
          latencyMs: Date.now() - startTime,
          status: 'OFFLINE',
          endpoint: rpcUrl
        });
      }
    });

    ws.on('error', () => {
      clearTimeout(timeout);
      resolve({
        chain: 'Unknown',
        clientVersion: 'Unknown',
        specName: 'Unknown',
        specVersion: 0,
        genesisHash: 'Unknown',
        latencyMs: -1,
        status: 'OFFLINE',
        endpoint: rpcUrl
      });
    });
  });
}
