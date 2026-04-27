"use client";

import { Navbar } from "@/components/Navbar";
import { VerifierPanel } from "@/components/VerifierPanel";
import { VerificationHistory } from "@/components/VerificationHistory";

export default function HomePage() {
  return (
    <div className="min-h-screen flex flex-col">
      {/* Navbar */}
      <Navbar />

      {/* Main Content */}
      <main className="flex-grow pt-20 pb-12 px-4 md:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">

          {/* Hero Section */}
          <div className="text-center mb-8 animate-fade-in">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-4">
              Claim Verifier
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto">
              AI-powered image forensics on GenLayer blockchain.
              <br />
              Upload an image, make a claim, get an explainable on-chain verdict.
            </p>
          </div>

          {/* Main Grid Layout */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8">
            {/* Left Column - Verifier Panel (67%) */}
            <div className="lg:col-span-8 animate-slide-up">
              <VerifierPanel />
            </div>

            {/* Right Column - Verification History (33%) */}
            <div className="lg:col-span-4 animate-slide-up" style={{ animationDelay: "100ms" }}>
              <VerificationHistory />
            </div>
          </div>

          {/* How it Works */}
          <div className="mt-8 glass-card p-6 md:p-8 animate-fade-in" style={{ animationDelay: "200ms" }}>
            <h2 className="text-2xl font-bold mb-4">How it Works</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="space-y-2">
                <div className="text-accent font-bold text-lg">1. Upload an Image</div>
                <p className="text-sm text-muted-foreground">
                  Connect your wallet and upload any image. Enter a plain-language
                  claim about it &mdash; e.g. &quot;this image is AI-generated.&quot;
                </p>
              </div>
              <div className="space-y-2">
                <div className="text-accent font-bold text-lg">2. On-Chain Analysis</div>
                <p className="text-sm text-muted-foreground">
                  GenLayer validators independently analyse visual signals &mdash; lighting,
                  texture, artifacts, noise, and coherence &mdash; and reach consensus.
                </p>
              </div>
              <div className="space-y-2">
                <div className="text-accent font-bold text-lg">3. Explainable Verdict</div>
                <p className="text-sm text-muted-foreground">
                  Get a verdict (true / false / uncertain), a confidence score, and
                  a human-readable breakdown of exactly why the image was judged that way.
                </p>
              </div>
            </div>
          </div>

        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-white/10 py-2">
        <div className="max-w-7xl mx-auto px-4 md:px-6 lg:px-8">
          <div className="flex items-center justify-center gap-6 text-sm text-muted-foreground">
            <a
              href="https://genlayer.com"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-accent transition-colors"
            >
              Powered by GenLayer
            </a>
            <a
              href="https://studio.genlayer.com"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-accent transition-colors"
            >
              Studio
            </a>
            <a
              href="https://docs.genlayer.com"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-accent transition-colors"
            >
              Docs
            </a>
            <a
              href="https://github.com/genlayerlabs/genlayer-project-boilerplate"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-accent transition-colors"
            >
              GitHub
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}
