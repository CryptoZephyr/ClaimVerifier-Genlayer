"use client";

import { useState, useEffect, useRef } from "react";
import { Plus, Loader2, ShieldCheck, Image as ImageIcon, Upload, X } from "lucide-react";
import { useClaimVerifier } from "@/lib/hooks/useClaimVerifier";
import { useWallet } from "@/lib/genlayer/wallet";
import { success, error } from "@/lib/utils/toast";
import { Button } from "./ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "./ui/dialog";
import { Input } from "./ui/input";
import { Label } from "./ui/label";

export function VerifyClaimModal() {
  const { isConnected, address, isLoading } = useWallet();
  const { verifyClaim } = useClaimVerifier();
  const { mutate: submitClaim, status, isSuccess } = verifyClaim;
  const isVerifying = status === "pending";

  const [isOpen, setIsOpen] = useState(false);
  const [claim, setClaim] = useState("");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [errors, setErrors] = useState({
    claim: "",
    image: "",
  });

  // Handle image selection and conversion to preview
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) { // 2MB limit for contract calls
        setErrors({ ...errors, image: "Image must be under 2MB" });
        return;
      }
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => setImagePreview(reader.result as string);
      reader.readAsDataURL(file);
      setErrors({ ...errors, image: "" });
    }
  };

  const validateForm = (): boolean => {
    const newErrors = { claim: "", image: "" };
    if (!claim.trim()) newErrors.claim = "Forensic claim statement is required";
    if (!imageFile) newErrors.image = "Visual evidence is required";
    setErrors(newErrors);
    return !Object.values(newErrors).some((err) => err !== "");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!isConnected || !address) {
      error("Please connect your validator identity first");
      return;
    }

    if (!validateForm() || !imagePreview) return;

    // Remove the data:image/xxx;base64, prefix for the contract
    const base64Content = imagePreview.split(",")[1];

    submitClaim({
      claim,
      imageBase64: base64Content,
    });
  };

  const resetForm = () => {
    setClaim("");
    setImageFile(null);
    setImagePreview(null);
    setErrors({ claim: "", image: "" });
  };

  useEffect(() => {
    if (isSuccess) {
      success("Forensic analysis initiated on GenLayer");
      resetForm();
      setIsOpen(false);
    }
  }, [isSuccess]);

  return (
    <Dialog open={isOpen} onOpenChange={(v) => { if (!isVerifying) { setIsOpen(v); if (!v) resetForm(); } }}>
      <DialogTrigger asChild>
        <Button variant="gradient" disabled={!isConnected || !address || isLoading} className="shadow-lg shadow-primary/20">
          <Plus className="w-4 h-4 mr-2" />
          New Verification
        </Button>
      </DialogTrigger>

      <DialogContent className="brand-card border-2 sm:max-w-[550px] backdrop-blur-xl">
        <DialogHeader>
          <DialogTitle className="text-2xl font-display flex items-center gap-2">
            <ShieldCheck className="text-primary" />
            Verify Forensic Claim
          </DialogTitle>
          <DialogDescription className="font-body">
            Upload visual evidence and provide the claim statement for decentralized AI consensus.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6 mt-4">
          {/* Claim Statement */}
          <div className="space-y-2">
            <Label htmlFor="claim" className="text-sm font-semibold text-muted-foreground">CLAIM STATEMENT</Label>
            <textarea
              id="claim"
              placeholder="e.g., 'The shadow in this image is inconsistent with the light source at 4 PM in London.'"
              value={claim}
              onChange={(e) => setClaim(e.target.value)}
              className={`bg-background/50 border-white/10 min-h-[100px] rounded-lg p-3 resize-none ${errors.claim ? "border-destructive" : ""}`}
            />
            {errors.claim && <p className="text-xs text-destructive mt-1">{errors.claim}</p>}
          </div>

          {/* Image Upload Area */}
          <div className="space-y-2">
            <Label className="text-sm font-semibold text-muted-foreground">VISUAL EVIDENCE</Label>
            {!imagePreview ? (
              <div
                onClick={() => fileInputRef.current?.click()}
                className={`border-2 border-dashed rounded-xl p-8 flex flex-col items-center justify-center gap-3 cursor-pointer transition-all hover:bg-white/5 ${errors.image ? "border-destructive/50" : "border-white/10"}`}
              >
                <Upload className="w-10 h-10 text-muted-foreground opacity-50" />
                <p className="text-sm text-muted-foreground font-body text-center">
                  Click to upload forensic image<br />
                  <span className="text-xs opacity-50">(MAX 2MB)</span>
                </p>
                <input type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={handleImageChange} />
              </div>
            ) : (
              <div className="relative rounded-xl overflow-hidden border border-primary/30 group">
                <img src={imagePreview} alt="Preview" className="w-full h-48 object-cover" />
                <button
                  type="button"
                  onClick={() => { setImageFile(null); setImagePreview(null); }}
                  className="absolute top-2 right-2 p-1 bg-black/60 rounded-full hover:bg-black/80 transition-colors"
                >
                  <X className="w-4 h-4 text-white" />
                </button>
              </div>
            )}
            {errors.image && <p className="text-xs text-destructive mt-1">{errors.image}</p>}
          </div>

          {/* Submit Action */}
          <div className="flex gap-3 pt-4">
            <Button
              type="button"
              variant="secondary"
              className="flex-1 font-display"
              onClick={() => setIsOpen(false)}
              disabled={isVerifying}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="gradient"
              className="flex-1 font-display"
              disabled={isVerifying}
            >
              {isVerifying ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Analyzing...
                </>
              ) : (
                "Submit to GenLayer"
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}