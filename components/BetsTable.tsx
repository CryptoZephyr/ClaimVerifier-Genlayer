"use client";

import { Loader2, ShieldCheck, Search, AlertCircle, Fingerprint } from "lucide-react";
import { useClaimVerifier } from "@/lib/hooks/useClaimVerifier";
import { useWallet } from "@/lib/genlayer/wallet";
import { AddressDisplay } from "./AddressDisplay";
import { Badge } from "./ui/badge";

type VerificationEntry = {
  claim: string;
  image_hash_hint: string;
  verdict?: string;
  confidence?: string;
  submitter?: string;
};

export function VerificationsTable() {
  const { contract, history } = useClaimVerifier();
  const historyData = history.data;
  const isLoading = history.isLoading;
  const isError = history.isError;
  const { address } = useWallet();

  if (isLoading) {
    return (
      <div className="brand-card p-8 flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
          <p className="text-sm text-muted-foreground font-body">Accessing GenLayer Ledger...</p>
        </div>
      </div>
    );
  }

  if (!contract) {
    return (
      <div className="brand-card p-12 text-center space-y-4">
        <AlertCircle className="w-16 h-16 mx-auto text-yellow-400 opacity-60" />
        <h3 className="text-xl font-display font-bold">Protocol Offline</h3>
        <p className="text-sm text-muted-foreground">Contract address missing in configuration.</p>
      </div>
    );
  }

  if (isError || !historyData || historyData.length === 0) {
    return (
      <div className="brand-card p-12 text-center space-y-3">
        <Fingerprint className="w-16 h-16 mx-auto text-muted-foreground opacity-30" />
        <h3 className="text-xl font-display font-bold">Archive Empty</h3>
        <p className="text-muted-foreground font-body">No forensic claims have been processed yet.</p>
      </div>
    );
  }

  return (
    <div className="brand-card p-6 overflow-hidden backdrop-blur-sm">
      <div className="flex items-center gap-2 mb-6">
        <Search className="w-5 h-5 text-primary" />
        <h2 className="text-lg font-display font-bold uppercase tracking-tight">Forensic History</h2>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-white/10">
              <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">Claim Statement</th>
              <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">Verdict</th>
              <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">Confidence</th>
              <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">Submitter</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {historyData.map((entry: VerificationEntry, idx: number) => (
              <VerificationRow key={idx} entry={entry} currentAddress={address} />
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function VerificationRow({ entry, currentAddress }: { entry: any, currentAddress: string | null }) {
  const isSubmitter = currentAddress?.toLowerCase() === entry.submitter?.toLowerCase();

  const getVerdictStyle = (verdict: string) => {
    switch (verdict?.toLowerCase()) {
      case 'true': return "bg-green-500/20 text-green-400 border-green-500/30";
      case 'false': return "bg-destructive/20 text-destructive border-destructive/30";
      default: return "bg-yellow-500/20 text-yellow-400 border-yellow-500/30";
    }
  };

  return (
    <tr className="group hover:bg-white/5 transition-colors animate-fade-in">
      <td className="px-4 py-4">
        <p className="text-sm font-medium line-clamp-1 max-w-xs">{entry.claim}</p>
        <span className="text-[10px] font-mono text-muted-foreground uppercase">Hint: {entry.image_hash_hint}</span>
      </td>
      <td className="px-4 py-4">
        <Badge variant="outline" className={getVerdictStyle(entry.verdict)}>
          {entry.verdict?.toUpperCase() || 'UNCERTAIN'}
        </Badge>
      </td>
      <td className="px-4 py-4">
        <div className="flex items-center gap-2">
          <div className="w-16 h-1.5 bg-white/10 rounded-full overflow-hidden">
            <div
              className="h-full bg-primary"
              style={{ width: `${(parseFloat(entry.confidence) || 0) * 100}%` }}
            />
          </div>
          <span className="text-xs font-mono">{(parseFloat(entry.confidence) * 100).toFixed(0)}%</span>
        </div>
      </td>
      <td className="px-4 py-4">
        <div className="flex items-center gap-2">
          <AddressDisplay address={entry.submitter} maxLength={8} />
          {isSubmitter && (
            <Badge variant="secondary" className="text-[10px] h-4 px-1">YOU</Badge>
          )}
        </div>
      </td>
    </tr>
  );
}