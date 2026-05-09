import Link from "next/link";
import { cn } from "@/lib/utils";
import type { ReactNode } from "react";

interface ButtonProps {
  children: ReactNode;
  variant?: "primary" | "ghost" | "dark" | "danger";
  size?: "sm" | "md" | "lg";
  href?: string;
  onClick?: () => void;
  disabled?: boolean;
  type?: "button" | "submit" | "reset";
  className?: string;
  target?: string;
  rel?: string;
  id?: string;
}

const VARIANTS: Record<string, string> = {
  primary:
    "bg-linear-to-r from-gold-primary to-gold-deep text-[#0D1A0D] font-semibold hover:-translate-y-0.5 hover:shadow-[0_8px_24px_rgba(201,168,76,0.35)] active:translate-y-0",
  ghost:
    "border border-gold-primary/60 text-gold-primary hover:bg-gold-primary/10 hover:border-gold-primary",
  dark:
    "bg-forest text-cream border border-gold-primary/20 hover:border-gold-primary/50 hover:bg-forest/80",
  danger:
    "bg-red-500/10 border border-red-500/30 text-red-400 hover:bg-red-500/20",
};

const SIZES: Record<string, string> = {
  sm: "px-4 py-2 text-[11px] tracking-[0.08em] rounded-xl",
  md: "px-6 py-3 text-[12px] tracking-[0.06em] rounded-xl",
  lg: "px-8 py-4 text-[13px] tracking-[0.05em] rounded-2xl",
};

export function Button({
  children,
  variant = "primary",
  size = "md",
  href,
  onClick,
  disabled,
  type = "button",
  className,
  target,
  rel,
  id,
}: ButtonProps) {
  const base = cn(
    "inline-flex items-center gap-2 font-cinzel uppercase transition-all duration-200 cursor-pointer select-none",
    VARIANTS[variant],
    SIZES[size],
    disabled && "opacity-40 cursor-not-allowed pointer-events-none",
    className
  );

  if (href) {
    return (
      <Link href={href} className={base} target={target} rel={rel} id={id}>
        {children}
      </Link>
    );
  }
  return (
    <button type={type} onClick={onClick} disabled={disabled} className={base} id={id}>
      {children}
    </button>
  );
}
