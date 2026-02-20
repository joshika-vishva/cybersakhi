import React from 'react';
import { cn } from "@/lib/utils";

export default function GlassCard({ children, className, hover = true, ...props }) {
  return (
    <div 
      className={cn(
        "bg-white/80 backdrop-blur-xl rounded-2xl border border-white/20 shadow-xl",
        hover && "transition-all duration-300 hover:shadow-2xl hover:bg-white/90",
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}