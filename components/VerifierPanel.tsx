"use client";

import { useState } from "react";
import { History, ShieldCheck, Zap, Globe, Fingerprint, Loader2 } from "lucide-react";
import { VerificationsTable } from "./BetsTable";
import { useClaimVerifier } from "@/lib/hooks/useClaimVerifier";

export function VerifierPanel() {
    const { totalVerifications } = useClaimVerifier();
    const totalVerificationsCount = totalVerifications.data || 0;

    const [status, setStatus] = useState<"idle" | "scanning" | "success">("idle");

    const simulateUpload = () => {
        setStatus("scanning");

        // Simulate a 3-second "AI Analysis" period
        setTimeout(() => {
            setStatus("success");
        }, 3000);
    };

    return (
        <div className="space-y-6 animate-fade-in">
            {/* Header Stats Bar */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="brand-card p-4 flex items-center gap-4 border-l-4 border-l-primary">
                    <div className="p-2 rounded-lg bg-primary/10">
                        <ShieldCheck className="w-6 h-6 text-primary" />
                    </div>
                    <div>
                        <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Protocol Status</p>
                        <p className="text-lg font-display font-bold">Active Shield</p>
                    </div>
                </div>

                <div className="brand-card p-4 flex items-center gap-4 border-l-4 border-l-pink">
                    <div className="p-2 rounded-lg bg-pink/10">
                        <Zap className={`${status === "success" ? "animate-pulse text-pink" : "text-pink/50"} w-6 h-6`} />
                    </div>
                    <div>
                        <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Total Consensus</p>
                        <p className="text-lg font-display font-bold">
                            {status === "success" ? totalVerificationsCount + 1 : totalVerificationsCount} Verified
                        </p>
                    </div>
                </div>

                <div className="brand-card p-4 flex items-center gap-4 border-l-4 border-l-blue">
                    <div className="p-2 rounded-lg bg-blue/10">
                        <Globe className="w-6 h-6 text-blue" />
                    </div>
                    <div>
                        <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Network</p>
                        <p className="text-lg font-display font-bold">GenLayer Mainnet</p>
                    </div>
                </div>
            </div>

            {/* FINGERPRINT / SCANNER AREA */}
            <div className="brand-card p-8 flex flex-col items-center justify-center text-center space-y-4 border-dashed border-2 border-primary/20">
                {status === "idle" && (
                    <>
                        <Fingerprint className="w-16 h-16 text-primary/40" />
                        <div>
                            <h3 className="text-xl font-bold">Ready for Forensic Analysis</h3>
                            <p className="text-sm text-muted-foreground">Submit an image to begin the verification process.</p>
                        </div>

                        {/* THE FILE INPUT CHANGE */}
                        <input
                            type="file"
                            id="image-upload"
                            className="hidden"
                            accept="image/*"
                            onChange={simulateUpload}
                        />
                        <label
                            htmlFor="image-upload"
                            className="btn-primary cursor-pointer px-6 py-2"
                        >
                            Select Image
                        </label>
                    </>
                )}

                {status === "scanning" && (
                    <>
                        <Loader2 className="w-16 h-16 text-pink animate-spin" />
                        <div>
                            <h3 className="text-xl font-bold text-pink">Analyzing Metadata...</h3>
                            <p className="text-sm text-muted-foreground">Checking pixels for AI artifacts and deepfake signatures.</p>
                        </div>
                    </>
                )}

                {status === "success" && (
                    <>
                        <div className="relative">
                            <Fingerprint className="w-16 h-16 text-green-500 animate-pulse" />
                            <ShieldCheck className="w-6 h-6 text-green-500 absolute -bottom-1 -right-1 bg-background rounded-full" />
                        </div>
                        <div>
                            <h3 className="text-xl font-bold text-green-500">Verification Complete</h3>
                            <p className="text-sm text-muted-foreground">Image verified authentic via GenLayer Consensus.</p>
                        </div>
                        <button
                            onClick={() => setStatus("idle")}
                            className="text-xs uppercase tracking-widest text-primary hover:underline"
                        >
                            Scan Another
                        </button>
                    </>
                )}
            </div>

            {/* Verification Ledger Table */}
            <div className="space-y-4">
                <div className="flex items-center justify-between px-2">
                    <div className="flex items-center gap-2">
                        <History className="w-5 h-5 text-primary" />
                        <h2 className="text-xl font-display font-bold">Verification Ledger</h2>
                    </div>
                </div>
                <VerificationsTable />
            </div>
        </div>
    );
}