import * as React from "react";
import { useMemo, useState } from "react";
import { QueryClient, QueryClientProvider } from "react-query";
import { Metaplex, keypairIdentity, sol } from "@metaplex-foundation/js";
import {
  Connection,
  clusterApiUrl,
  Keypair,
  LAMPORTS_PER_SOL,
} from "@solana/web3.js";
import { ReactQueryDevtools } from "react-query/devtools";
import { Message, MessageType } from "./models/message";
import WalletNftList from "./components/WalletNftList";
import vscode from "./constants/vscode";
import "./app.css";

// TODO: think about 'devnet'. If we're relying on Helius too much, how do we handle 'devnet' environment
// TODO: should we create our own backend for storing (caching/indexing) data
// TODO: where do we store local (environment) data like Helius API key, private keys etc.?
// TODO: skeleton loading (and image optimization!)
// TODO: https://twitter.com/heliuslabs/status/1659604948412252165
// TODO: vsc manifest -> https://code.visualstudio.com/api/references/extension-manifest
// NB: https://github.com/waku-org/js-waku/issues/358
// TODO: https://docs.helius.xyz/solana-rpc-nodes/digital-asset-standard-api/get-assets-by-owner <- use this or metaplex rpc calls to get NFT holdings
// TODO: save external message fetching info and use it in command palette "sign from API: <setting name>"
// example: `GET localhost:3005/auth/request-password`, body:{}, params: { address: "my-address" }, name: "local-backend"

function convertStringToKeypair(privateKeyString: string) {
  const privateKeyArray = Uint8Array.from(JSON.parse(privateKeyString));
  const keypair = Keypair.fromSecretKey(privateKeyArray);
  return keypair;
}

function App() {
  const [queryClient] = useState(() => new QueryClient());
  const [privateKey, setPrivateKey] = useState("");
  const keypair = useMemo(() => {
    try {
      return convertStringToKeypair(privateKey);
    } catch {
      return null;
    }
  }, [privateKey]);
  const publicKey = useMemo(() => keypair?.publicKey, [keypair]);
  const address = useMemo(() => keypair?.publicKey.toBase58(), [keypair]);
  const metaplex = useMemo(() => {
    if (!keypair) return;
    const endpoint = clusterApiUrl("devnet");
    const connection = new Connection(endpoint, "confirmed");
    return new Metaplex(connection).use(keypairIdentity(keypair));
  }, [keypair]);

  const isWalletConnected = !!metaplex && !!publicKey && !!keypair;

  return (
    <QueryClientProvider client={queryClient}>
      <div className="wallet-form">
        <p>
          Copy paste a private key here to airdrop SOL to it, check the balance
          or display public key (address). If your wallet has NFTs inside, they
          will be displayed below. Feel free to copy a private key from one of
          your keypair.json files or use dummy keypair from below.
        </p>
        <button
          onClick={() => {
            setPrivateKey(
              "[237,255,242,197,44,255,78,206,211,72,250,28,154,148,237,85,226,12,27,25,232,108,58,61,240,99,25,206,147,255,72,87,161,60,212,253,197,101,227,126,39,82,3,178,80,108,242,93,199,230,101,140,209,245,156,142,225,83,232,44,108,25,96,95]"
            );
          }}
        >
          copy dummy key
        </button>
        <label>
          Private Key:&nbsp;
          <input
            name="private-key"
            type="text"
            placeholder="private key"
            value={privateKey}
            onChange={(e) => setPrivateKey(e.target.value)}
          />
        </label>
        <br />
        <button
          type="button"
          disabled={!isWalletConnected}
          onClick={() => {
            vscode.postMessage<Message>({
              type: MessageType.PublicKey,
              payload: `address: ${address}`,
            });
          }}
        >
          `solana address`
        </button>
        <br />
        <button
          type="button"
          disabled={!isWalletConnected}
          onClick={async () => {
            if (!isWalletConnected) return;

            const balance = await metaplex.rpc().getBalance(publicKey);

            vscode.postMessage<Message>({
              type: MessageType.PublicKey,
              payload: `balance: ${
                balance.basisPoints.toNumber() / LAMPORTS_PER_SOL
              } $SOL`,
            });
          }}
        >
          `solana balance`
        </button>
        <button
          type="button"
          disabled={!isWalletConnected}
          onClick={async () => {
            try {
              if (!isWalletConnected) return;

              await metaplex.rpc().airdrop(publicKey, sol(2));
              vscode.postMessage<Message>({
                type: MessageType.PublicKey,
                payload: `Successfully airdropped 2 $SOL`,
              });
            } catch (e) {
              vscode.postMessage<Message>({
                type: MessageType.PublicKey,
                payload: `Failed to airdrop 2 $SOL: ${e}`,
              });
            }
          }}
        >
          `solana airdrop`
        </button>
      </div>
      <main>{address && <WalletNftList address={address} />}</main>

      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  );
}

export default App;
