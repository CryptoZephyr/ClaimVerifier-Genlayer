"use client";

import { useState } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "sonner";
import { WalletProvider } from "@/lib/genlayer/WalletProvider";

export function Providers({ children }: { children: React.ReactNode }) {
  // Maintaining a single instance of QueryClient for stability
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 5000, // Slightly increased for forensic data stability
            refetchOnWindowFocus: false,
          },
        },
      })
  );

  return (
    <QueryClientProvider client={queryClient}>
      <WalletProvider>
        {children}
      </WalletProvider>
      <Toaster
        position="bottom-right" // Moved to bottom-right to keep the top clear for image analysis UI
        theme="dark"
        richColors
        closeButton
        toastOptions={{
          style: {
            background: '#0D0D0D', // Deep forensic black
            border: '1px solid #9B6AF6', // GenLayer Purple accent
            color: '#FFFFFF',
            boxShadow: '0 12px 40px rgba(0, 0, 0, 0.9)',
            borderRadius: '12px',
          },
        }}
      />
    </QueryClientProvider>
  );
}