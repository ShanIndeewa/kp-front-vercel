"use client";

import React from "react";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: "primary" | "secondary" | "ghost" | "gold";
    size?: "sm" | "md" | "lg";
    loading?: boolean;
}

const variantStyles: Record<string, React.CSSProperties> = {
    primary: {
        background: "linear-gradient(135deg, #9333ea, #06b6d4)",
        color: "#ffffff",
        boxShadow: "0 4px 15px rgba(147,51,234,0.25)",
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
        background: "linear-gradient(135deg, #f59e0b, #fbbf24)",
        color: "#111827",
        boxShadow: "0 4px 15px rgba(245,158,11,0.25)",
    },
};

const sizeStyles: Record<string, React.CSSProperties> = {
    sm: { padding: "6px 12px", fontSize: 12, gap: 6 },
    md: { padding: "10px 20px", fontSize: 14, gap: 8 },
    lg: { padding: "12px 28px", fontSize: 16, gap: 10 },
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
            className={className}
            disabled={disabled || loading}
            style={{
                position: "relative",
                display: "inline-flex", alignItems: "center", justifyContent: "center",
                fontWeight: 600, borderRadius: 12,
                transition: "all 0.3s", cursor: disabled || loading ? "not-allowed" : "pointer",
                userSelect: "none", outline: "none", border: "none",
                opacity: disabled || loading ? 0.5 : 1,
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
