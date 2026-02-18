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
    glow = false,
    noPadding = false,
    style,
    ...props
}: GlassCardProps) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            className={`glass-card ${glow ? "animate-pulse-glow" : ""} ${className}`}
            style={{ ...(noPadding ? {} : { padding: 24 }), ...style }}
            {...props}
        >
            {children}
        </motion.div>
    );
}
