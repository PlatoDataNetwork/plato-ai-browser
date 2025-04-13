import { PublicKey, Transaction } from '@solana/web3.js';

export interface WalletMessage {
  type: 'REQUEST_WALLET_PUBLIC_KEY' | 'SIGN_TRANSACTION' | 'SIGN_MESSAGE';
  payload?: any;
}

export interface WalletResponse {
  type: string;
  data?: any;
  error?: string;
}

export const handleWalletMessage = async (
  message: WalletMessage,
  publicKey: PublicKey | null,
  signTransaction?: (transaction: Transaction) => Promise<Transaction>,
  signMessage?: (message: Uint8Array) => Promise<Uint8Array>
): Promise<WalletResponse> => {
  switch (message.type) {
    case 'REQUEST_WALLET_PUBLIC_KEY':
      return {
        type: 'WALLET_PUBLIC_KEY',
        data: publicKey?.toBase58(),
      };
    case 'SIGN_TRANSACTION':
      if (!signTransaction || !publicKey) {
        return { type: 'ERROR', error: 'Wallet not connected' };
      }
      try {
        const transaction = Transaction.from(message.payload);
        const signedTx = await signTransaction(transaction);
        return { type: 'SIGNED_TRANSACTION', data: signedTx.serialize() };
      } catch (error) {
        return { type: 'ERROR', error: 'Failed to sign transaction' };
      }
    case 'SIGN_MESSAGE':
      if (!signMessage || !publicKey) {
        return { type: 'ERROR', error: 'Wallet not connected' };
      }
      try {
        const signedMessage = await signMessage(message.payload);
        return { type: 'SIGNED_MESSAGE', data: signedMessage };
      } catch (error) {
        return { type: 'ERROR', error: 'Failed to sign message' };
      }
    default:
      return { type: 'ERROR', error: 'Unknown message type' };
  }
};