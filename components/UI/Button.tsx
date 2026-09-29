"use client";

import { motion } from "framer-motion";
import Link from "next/link";

interface ButtonProps {
  variant?: "primary" | "secondary" | "ghost" | "gold";
  size?: "sm" | "md" | "lg";
  href?: string;
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
  type?: "button" | "submit" | "reset";
  disabled?: boolean;
  external?: boolean;
  "aria-label"?: string;
}

const variantClasses = {
  primary:
    "bg-brand-red text-brand-black border border-brand-red hover:bg-brand-red-bright hover:border-brand-red-bright",
  secondary:
    "bg-transparent text-brand-white border border-brand-red/70 hover:bg-brand-red/10 hover:border-brand-red",
  ghost:
    "bg-transparent text-brand-muted border border-transparent hover:text-brand-white hover:border-brand-border",
  gold: "bg-brand-gold text-brand-black border border-brand-gold hover:bg-brand-gold-bright hover:border-brand-gold-bright font-bold",
};

const sizeClasses = {
  sm: "px-4 py-2 text-xs tracking-widest",
  md: "px-6 py-3 text-xs tracking-widest",
  lg: "px-8 py-4 text-sm tracking-widest",
};

const MotionLink = motion(Link);

export default function Button({
  variant = "primary",
  size = "md",
  href,
  children,
  className = "",
  onClick,
  type = "button",
  disabled = false,
  external = false,
  "aria-label": ariaLabel,
}: ButtonProps) {
  const classes = `
    inline-flex items-center justify-center rounded-full
    font-sans uppercase font-semibold
    transition-all duration-200 ease-out
    cursor-pointer select-none
    ${variantClasses[variant]}
    ${sizeClasses[size]}
    ${disabled ? "opacity-40 pointer-events-none" : ""}
    ${className}
  `;

  const motionProps = {
    whileHover: { scale: 1.02 },
    whileTap: { scale: 0.98 },
    transition: { type: "spring", stiffness: 400, damping: 25 },
  };

  if (href) {
    if (external || href.startsWith("http") || href.startsWith("mailto")) {
      return (
        <motion.a
          href={href}
          onClick={onClick}
          className={classes}
          target={external ? "_blank" : undefined}
          rel={external ? "noopener noreferrer" : undefined}
          aria-label={ariaLabel}
          {...motionProps}
        >
          {children}
        </motion.a>
      );
    }
    return (
      <MotionLink href={href} onClick={onClick} className={classes} aria-label={ariaLabel} {...motionProps}>
        {children}
      </MotionLink>
    );
  }

  return (
    <motion.button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={classes}
      aria-label={ariaLabel}
      {...motionProps}
    >
      {children}
    </motion.button>
  );
}
