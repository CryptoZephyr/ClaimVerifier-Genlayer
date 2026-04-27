"use client";

import {
    History,
    ShieldCheck,
    ShieldAlert,
    ShieldQuestion,
    Clock,
    Fingerprint,
    Loader2
} from "lucide-react";
import { useClaimVerifier } from "@/lib/hooks/useClaimVerifier";
import { Badge } from "./ui/badge";

export function VerificationHistory() {
    const { history } = useClaimVerifier();
    const { data, isLoading } = history;

    if (isLoading) {
        return (
            <div className="brand-card p-12 flex flex-col items-center justify-center gap-4">
                <Loader2 className="w-8 h-8 animate-spin text-primary" />
                <p className="text-sm text-muted-foreground font-display uppercase tracking-widest">
                    Syncing Forensic Ledger...
                </p>
            </div>
        );
    }

    if (!data || data.length === 0) {
        return (
            <div className="brand-card p-12 text-center border-dashed border-2">
                <Fingerprint className="w-12 h-12 mx-auto text-muted-foreground opacity-20 mb-4" />
                <h3 className="text-lg font-display font-bold">No Claims Recorded</h3>
                <p className="text-sm text-muted-foreground">Submit an image to begin the verification process.</p>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center gap-2 mb-2">
                <History className="w-5 h-5 text-primary" />
                <h2 className="text-xl font-display font-bold">Forensic Audit Log</h2>
            </div>

            <div className="grid gap-4">
                {data.map((item, index) => (
                    <div
                        key={index}
                        className="brand-card p-5 group hover:border-primary/40 transition-all animate-fade-in"
                    >
                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                            {/* Claim Content */}
                            <div className="flex-1 space-y-2">
                                <div className="flex items-center gap-2">
                                    <VerdictIcon verdict={item.verdict} />
                                    <span className="text-[10px] font-mono text-muted-foreground uppercase tracking-tighter">
                                        Ref: {item.image_hash_hint || "GEN-ALPHA-01"}
                                    </span>
                                </div>
                                <p className="text-sm font-medium leading-relaxed italic">
                                    &quot;{item.claim}&quot;
                                </p>
                            </div>

                            {/* Verdict & Confidence Stats */}
                            <div className="flex items-center gap-6 md:border-l md:border-white/10 md:pl-6">
                                <div className="text-center">
                                    <p className="text-[10px] text-muted-foreground font-bold uppercase mb-1">Verdict</p>
                                    <VerdictBadge verdict={item.verdict} />
                                </div>

                                <div className="text-right min-w-[80px]">
                                    <p className="text-[10px] text-muted-foreground font-bold uppercase mb-1">Confidence</p>
                                    <div className="flex items-center justify-end gap-2">
                                        <span className="text-sm font-mono font-bold text-primary">
                                            {(parseFloat(item.confidence) * 100).toFixed(0)}%
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

function VerdictIcon({ verdict }: { verdict: string }) {
    const v = verdict?.toLowerCase();
    if (v === "true") return <ShieldCheck className="w-4 h-4 text-green-400" />;
    if (v === "false") return <ShieldAlert className="w-4 h-4 text-destructive" />;
    return <ShieldQuestion className="w-4 h-4 text-yellow-400" />;
}

function VerdictBadge({ verdict }: { verdict: string }) {
    const v = verdict?.toLowerCase();
    const styles = {
        true: "bg-green-500/10 text-green-400 border-green-500/30",
        false: "bg-destructive/10 text-destructive border-destructive/30",
        uncertain: "bg-yellow-500/10 text-yellow-400 border-yellow-500/30",
    };

    const currentStyle = styles[v as keyof typeof styles] || styles.uncertain;

    return (
        <Badge variant="outline" className={`${currentStyle} px-3 py-0.5 rounded-full font-display uppercase text-[10px] tracking-widest`}>
            {verdict || "Uncertain"}
        </Badge>
    );
}