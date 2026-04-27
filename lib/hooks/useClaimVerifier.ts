"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useGenLayer } from "@/lib/genlayer/useGenLayer";

const CONTRACT = process.env.NEXT_PUBLIC_CLAIM_VERIFIER_ADDRESS || "";

export function useClaimVerifier() {
    const queryClient = useQueryClient();
    const { client } = useGenLayer();

    const verifyClaim = useMutation({
        mutationFn: async ({ claim, imageBase64 }: { claim: string; imageBase64: string }) => {
            if (!client) throw new Error("GenLayer client not initialized");
            return await client.callContract({
                address: CONTRACT,
                method: "verify_claim",
                args: [claim, imageBase64],
            });
        },
        onSuccess: () => queryClient.invalidateQueries({ queryKey: ["claims"] }),
    });

    const history = useQuery({
        queryKey: ["claims"],
        queryFn: async () => {
            if (!client) return [];
            const data = await client.readContract({
                address: CONTRACT,
                method: "get_verdict_history"
            });
            return (data as any[]) || [];
        },
        enabled: !!client,
    });

    const totalVerifications = useQuery({
        queryKey: ["stats"],
        queryFn: async () => {
            if (!client) return 0;
            const count = await client.readContract({
                address: CONTRACT,
                method: "get_total_verifications"
            });
            return Number(count) || 0;
        },
        enabled: !!client,
    });

    return {
        verifyClaim,
        history,
        totalVerifications,
        contract: CONTRACT
    };
}