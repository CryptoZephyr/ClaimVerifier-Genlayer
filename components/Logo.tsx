/**
 * GenLayer Logo Component (Verifier Edition)
 * Per Brand Guidelines 2025
 */

import React from 'react';

export type LogoVariant = 'full' | 'mark' | 'wordmark' | 'verifier';
export type LogoSize = 'sm' | 'md' | 'lg';
export type LogoTheme = 'light' | 'dark';

interface LogoProps {
  variant?: LogoVariant;
  size?: LogoSize;
  theme?: LogoTheme;
  className?: string;
}

const sizeMap = {
  sm: { mark: 'w-5 h-5', text: 'text-base' },
  md: { mark: 'w-6 h-6', text: 'text-xl' },
  lg: { mark: 'w-8 h-8', text: 'text-2xl' },
};

export function Logo({
  variant = 'full',
  size = 'md',
  theme = 'dark',
  className = '',
}: LogoProps) {
  const colorClass = theme === 'dark' ? 'text-foreground' : 'text-background';
  const { mark: markSize, text: textSize } = sizeMap[size];

  // GenLayer Strong Mark
  const StrongMark = () => (
    <svg
      className={`${markSize} ${colorClass} transition-colors`}
      viewBox="0 0 97.76 91.93"
      xmlns="http://www.w3.org/2000/svg"
      aria-label="GenLayer Logo"
    >
      <path
        fill="currentColor"
        d="M44.26 32.35L27.72 67.12L43.29 74.9L0 91.93L44.26 0L44.26 32.35ZM53.5 32.35L70.04 67.12L54.47 74.9L97.76 91.93L53.5 0L53.5 32.35ZM48.64 43.78L58.33 62.94L48.64 67.69L39.47 62.92L48.64 43.78Z"
      />
    </svg>
  );

  const Wordmark = () => (
    <span
      className={`${textSize} font-bold ${colorClass} font-display transition-colors`}
      style={{ letterSpacing: '-0.02em' }}
    >
      GenLayer
    </span>
  );

  const VerifierTag = () => (
    <span className="ml-2 px-1.5 py-0.5 rounded bg-primary/20 border border-primary/30 text-[10px] font-bold uppercase tracking-widest text-primary">
      Claim Verifier
    </span>
  );

  if (variant === 'mark') {
    return (
      <div className={`inline-flex items-center ${className}`}>
        <StrongMark />
      </div>
    );
  }

  if (variant === 'wordmark') {
    return (
      <div className={`inline-flex items-center ${className}`}>
        <Wordmark />
      </div>
    );
  }

  if (variant === 'verifier') {
    return (
      <div className={`inline-flex items-center gap-2 ${className}`}>
        <StrongMark />
        <div className="flex flex-col leading-none">
          <Wordmark />
          <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground mt-1">
            Proof of Reality
          </span>
        </div>
      </div>
    );
  }

  // Full logo (default): Strong Mark + Wordmark + Tag
  return (
    <div className={`inline-flex items-center gap-2 ${className}`}>
      <StrongMark />
      <Wordmark />
      <VerifierTag />
    </div>
  );
}

export function LogoVerifier(props: Omit<LogoProps, 'variant'>) {
  return <Logo {...props} variant="verifier" />;
}
