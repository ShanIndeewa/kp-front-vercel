"use client";

import { motion, type HTMLMotionProps } from "framer-motion";
import React from "react";

interface GlassCardProps extends HTMLMotionProps<"div"> {
    children: React.ReactNode;
    className?: string;
    glow?: boolean;
    noPadding?: boolean;
}

export default function GlassCard({
    children,
    className = "",
    noPadding = false,
    glow,
    style,
    ...props
}: GlassCardProps) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className={`glass-panel rounded-premium ${className}`}
            style={{
                ...(noPadding ? {} : { padding: 32 }),
                borderRadius: 16,
                ...(glow ? { boxShadow: "0 0 30px var(--accent-gold-glow)", borderColor: "var(--border-gold)" } : {}),
                ...style
            }}
            {...props}
        >
            {children}
        </motion.div>
    );
}

