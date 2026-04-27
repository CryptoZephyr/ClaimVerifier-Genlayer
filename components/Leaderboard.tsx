"use client";

import { ShieldCheck, Activity, Loader2, AlertCircle, Fingerprint, Database } from "lucide-react";
import { useClaimVerifier } from "@/lib/hooks/useClaimVerifier";
import { useWallet } from "@/lib/genlayer/wallet";

export function Leaderboard() {
  const contract = useClaimVerifier();
  // Instead of a leaderboard of people, we show the protocol's global throughput
  const totalCount = 0;
  const isLoading = false;
  const { isConnected } = useWallet();

  if (isLoading) {
    return (
      <div className="brand-card p-6 border-primary/20">
        <h2 className="text-xl font-display font-bold mb-4 flex items-center gap-2">
          <Activity className="w-5 h-5 text-primary" />
          Network Activity
        </h2>
        <div className="flex items-center justify-center py-8">
          <Loader2 className="w-6 h-6 animate-spin text-primary" />
        </div>
      </div>
    );
  }

  if (!contract) {
    return (
      <div className="brand-card p-6">
        <h2 className="text-xl font-display font-bold mb-4 flex items-center gap-2 text-muted-foreground">
          <Activity className="w-5 h-5" />
          Network Activity
        </h2>
        <div className="text-center py-8 space-y-3">
          <AlertCircle className="w-12 h-12 mx-auto text-yellow-400 opacity-60" />
          <p className="text-sm text-muted-foreground font-body">Protocol configuration missing.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="brand-card p-6 animate-fade-in overflow-hidden relative">
      {/* Background Decorative Icon */}
      <Database className="absolute -right-4 -bottom-4 w-24 h-24 text-primary opacity-5 rotate-12" />

      <h2 className="text-xl font-display font-bold mb-6 flex items-center gap-2">
        <Activity className="w-5 h-5 text-primary" />
        Protocol Status
      </h2>

      <div className="space-y-4 relative z-10">
        {/* Global Stats Card */}
        <div className="bg-white/5 border border-white/10 rounded-xl p-5 transition-all hover:bg-white/10">
          <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest mb-1">
            Total Consensuses Reached
          </p>
          <div className="flex items-baseline gap-2">
            <span className="text-4xl font-display font-bold text-primary">
              {totalCount ?? 0}
            </span>
            <span className="text-sm text-muted-foreground font-body">Verifications</span>
          </div>
        </div>

        {/* Network Health Item */}
        <div className="flex items-center justify-between p-3 rounded-lg bg-white/5 border border-transparent">
          <div className="flex items-center gap-3">
            <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse shadow-[0_0_8px_#22c55e]" />
            <span className="text-sm font-medium">Validator Nodes</span>
          </div>
          <span className="text-xs font-mono text-primary font-bold uppercase">Active</span>
        </div>

        {/* Security Item */}
        <div className="flex items-center justify-between p-3 rounded-lg bg-white/5 border border-transparent">
          <div className="flex items-center gap-3 text-muted-foreground">
            <ShieldCheck className="w-4 h-4" />
            <span className="text-sm">Protocol Security</span>
          </div>
          <span className="text-xs font-mono text-green-400 font-bold uppercase">Optimistic</span>
        </div>
      </div>

      {!isConnected && (
        <div className="mt-6 p-3 rounded-lg bg-primary/10 border border-primary/20">
          <p className="text-[11px] text-center text-primary font-medium leading-tight">
            Connect your wallet to contribute to the global Proof of Reality ledger.
          </p>
        </div>
      )}

      <div className="mt-6 pt-4 border-t border-white/10">
        <p className="text-[10px] text-center text-muted-foreground font-body uppercase tracking-widest opacity-60">
          GenLayer Intelligent Contract Layer
        </p>
      </div>
    </div>
  );
}