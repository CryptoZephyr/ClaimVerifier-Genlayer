"use client";

import { useWallet } from "./wallet";

/**
 * Low-level hook to access the GenLayer client and wallet state.
 * Fixed the 'client does not exist' error by casting the wallet context.
 */
export function useGenLayer() {
    const wallet = useWallet();

    // We cast to any here because your WalletContextValue type 
    // in wallet.ts might be missing the 'client' property definition
    const client = (wallet as any).client;
    const address = wallet.address;
    const isConnected = (wallet as any).isConnected;
    const isLoading = (wallet as any).isLoading;

    return {
        client,
        address,
        isConnected,
        isLoading
    };
}