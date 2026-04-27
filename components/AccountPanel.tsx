"use client";

import { useState } from "react";
import { User, LogOut, AlertCircle, ExternalLink, ShieldCheck } from "lucide-react";
import { useWallet } from "@/lib/genlayer/wallet";
import { success, error, userRejected } from "@/lib/utils/toast";
import { AddressDisplay } from "./AddressDisplay";
import { Button } from "./ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./ui/dialog";
import { Alert, AlertDescription, AlertTitle } from "./ui/alert";

const METAMASK_INSTALL_URL = "https://metamask.io/download/";

export function AccountPanel() {
  const {
    address,
    isConnected,
    isMetaMaskInstalled,
    isOnCorrectNetwork,
    isLoading,
    connectWallet,
    disconnectWallet,
    switchWalletAccount,
  } = useWallet();

  // Updated to track verifications instead of betting points
  const totalVerifications = 0;

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [connectionError, setConnectionError] = useState("");
  const [isConnecting, setIsConnecting] = useState(false);
  const [isSwitching, setIsSwitching] = useState(false);

  const handleConnect = async () => {
    if (!isMetaMaskInstalled) return;

    try {
      setIsConnecting(true);
      setConnectionError("");
      await connectWallet();
      setIsModalOpen(false);
    } catch (err: any) {
      console.error("Failed to connect wallet:", err);
      setConnectionError(err.message || "Failed to connect to MetaMask");

      if (err.message?.includes("rejected")) {
        userRejected("Connection cancelled");
      } else {
        error("Failed to connect wallet", {
          description: err.message || "Check your MetaMask and try again."
        });
      }
    } finally {
      setIsConnecting(false);
    }
  };

  const handleDisconnect = () => {
    disconnectWallet();
    setIsModalOpen(false);
  };

  const handleSwitchAccount = async () => {
    try {
      setIsSwitching(true);
      setConnectionError("");
      await switchWalletAccount();
    } catch (err: any) {
      console.error("Failed to switch account:", err);
      if (!err.message?.includes("rejected")) {
        setConnectionError(err.message || "Failed to switch account");
        error("Failed to switch account", {
          description: err.message || "Please try again."
        });
      } else {
        userRejected("Account switch cancelled");
      }
    } finally {
      setIsSwitching(false);
    }
  };

  // Not connected state
  if (!isConnected) {
    return (
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogTrigger asChild>
          <Button variant="gradient" disabled={isLoading}>
            <ShieldCheck className="w-4 h-4 mr-2" />
            Sign In to Verify
          </Button>
        </DialogTrigger>
        <DialogContent className="brand-card border-2">
          <DialogHeader>
            <DialogTitle className="text-2xl font-display">
              Proof of Reality
            </DialogTitle>
            <DialogDescription>
              Connect your wallet to submit forensic claims to GenLayer.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 mt-4">
            {!isMetaMaskInstalled ? (
              <>
                <Alert variant="default" className="bg-accent/10 border-accent/20">
                  <AlertCircle className="h-4 w-4" />
                  <AlertTitle>MetaMask Required</AlertTitle>
                  <AlertDescription>
                    Install MetaMask to interact with the GenLayer intelligent contract layer.
                  </AlertDescription>
                </Alert>

                <Button
                  onClick={() => window.open(METAMASK_INSTALL_URL, "_blank")}
                  variant="gradient"
                  className="w-full h-14 text-lg"
                >
                  <ExternalLink className="w-5 h-5 mr-2" />
                  Install MetaMask
                </Button>
              </>
            ) : (
              <>
                <Button
                  onClick={handleConnect}
                  variant="gradient"
                  className="w-full h-14 text-lg font-display"
                  disabled={isConnecting}
                >
                  <User className="w-5 h-5 mr-2" />
                  {isConnecting ? "Authenticating..." : "Connect MetaMask"}
                </Button>

                {connectionError && (
                  <Alert variant="destructive">
                    <AlertCircle className="h-4 w-4" />
                    <AlertTitle>Connection Error</AlertTitle>
                    <AlertDescription>{connectionError}</AlertDescription>
                  </Alert>
                )}
              </>
            )}
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  // Connected state
  return (
    <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
      <div className="flex items-center gap-4">
        <div className="brand-card px-4 py-2 flex items-center gap-3">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-primary" />
            <AddressDisplay address={address} maxLength={12} />
          </div>
          <div className="h-4 w-px bg-white/10" />
          <div className="flex items-center gap-1">
            <span className="text-sm font-semibold text-primary">{totalVerifications}</span>
            <span className="text-xs text-muted-foreground">verifications</span>
          </div>
        </div>

        <DialogTrigger asChild>
          <Button variant="outline" size="sm">
            <User className="w-4 h-4" />
          </Button>
        </DialogTrigger>
      </div>

      <DialogContent className="brand-card border-2">
        <DialogHeader>
          <DialogTitle className="text-2xl font-display">
            Validator Identity
          </DialogTitle>
          <DialogDescription>
            Your connected forensic submission identity.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 mt-4">
          <div className="brand-card p-4 space-y-2">
            <p className="text-sm text-muted-foreground">Submission Address</p>
            <code className="text-xs font-mono break-all text-primary">{address}</code>
          </div>

          <div className="brand-card p-4 space-y-2">
            <p className="text-sm text-muted-foreground">Global Trust Metric</p>
            <p className="text-2xl font-bold text-primary">{totalVerifications} <span className="text-sm font-normal text-muted-foreground">Processed Claims</span></p>
          </div>

          <div className="brand-card p-4 space-y-2">
            <p className="text-sm text-muted-foreground">Network Protocol</p>
            <div className="flex items-center gap-2">
              <div className={`w-2 h-2 rounded-full ${isOnCorrectNetwork ? "bg-green-500 shadow-[0_0_8px_#22c55e]" : "bg-yellow-500 animate-pulse"}`} />
              <span className="text-sm">{isOnCorrectNetwork ? "GenLayer Mainnet" : "Wrong Network"}</span>
            </div>
          </div>

          <div className="mt-6 pt-4 border-t border-white/10 space-y-3">
            <Button onClick={handleSwitchAccount} variant="outline" className="w-full" disabled={isSwitching || isLoading}>
              <User className="w-4 h-4 mr-2" />
              Switch Identity
            </Button>

            <Button onClick={handleDisconnect} className="w-full text-destructive" variant="outline" disabled={isSwitching || isLoading}>
              <LogOut className="w-4 h-4 mr-2" />
              Terminate Session
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}