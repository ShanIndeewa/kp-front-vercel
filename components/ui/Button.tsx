"use client";

import React from "react";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: "primary" | "secondary" | "ghost" | "gold";
    size?: "sm" | "md" | "lg";
    loading?: boolean;
}

const variantStyles: Record<string, React.CSSProperties> = {
    primary: {
        background: "var(--accent-purple)",
        color: "#ffffff",
    },
    secondary: {
        background: "var(--bg-tertiary)",
        color: "var(--text-primary)",
        border: "1px solid var(--border-glass)",
    },
    ghost: {
        background: "transparent",
        color: "var(--text-secondary)",
        border: "none",
    },
    gold: {
        background: "var(--accent-gold)",
        color: "#111827",
        boxShadow: "0 0 15px var(--accent-gold-glow)",
    },
};

const sizeStyles: Record<string, React.CSSProperties> = {
    sm: { padding: "8px 20px", fontSize: 12, gap: 6 },
    md: { padding: "12px 28px", fontSize: 13, gap: 8 },
    lg: { padding: "14px 36px", fontSize: 15, gap: 10 },
};

export default function Button({
    children,
    variant = "primary",
    size = "md",
    loading = false,
    className = "",
    disabled,
    style,
    ...props
}: ButtonProps) {
    return (
        <button
            className={`${className} rounded-button`}
            disabled={disabled || loading}
            style={{
                position: "relative",
                display: "inline-flex", alignItems: "center", justifyContent: "center",
                fontWeight: 800, borderRadius: 999,
                transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)", 
                cursor: disabled || loading ? "not-allowed" : "pointer",
                userSelect: "none", outline: "none", border: "none",
                opacity: disabled || loading ? 0.5 : 1,
                fontFamily: "var(--font-sans)",
                letterSpacing: "1px",
                textTransform: "uppercase",
                ...variantStyles[variant],
                ...sizeStyles[size],
                ...style,
            }}
            {...props}
        >

            {loading && (
                <svg
                    style={{ animation: "spin 1s linear infinite", width: 16, height: 16 }}
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                >
                    <circle style={{ opacity: 0.25 }} cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path style={{ opacity: 0.75 }} fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                </svg>
            )}
            {children}
        </button>
    );
}
