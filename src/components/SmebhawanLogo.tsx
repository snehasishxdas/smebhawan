import React from "react";

interface SmebhawanLogoProps {
  variant?: "full" | "icon";
  size?: "sm" | "md" | "lg" | "xl";
  lightText?: boolean;
  className?: string;
}

export default function SmebhawanLogo({
  variant = "full",
  size = "md",
  lightText = false,
  className = "",
}: SmebhawanLogoProps) {
  // Determine sizing parameters
  const iconSizes = {
    sm: "h-8 w-8",
    md: "h-11 w-11",
    lg: "h-20 w-20",
    xl: "h-32 w-32",
  };

  const textSizes = {
    sm: "text-lg",
    md: "text-2xl",
    lg: "text-4xl",
    xl: "text-6xl",
  };

  const subtitleSizes = {
    sm: "text-[7px] tracking-[0.15em]",
    md: "text-[9px] tracking-[0.25em]",
    lg: "text-xs tracking-[0.3em]",
    xl: "text-sm tracking-[0.35em]",
  };

  const textClass = lightText ? "text-white" : "text-slate-850";
  const mutedTextClass = lightText ? "text-slate-300" : "text-slate-500";
  const lineClass = lightText ? "border-slate-700" : "border-slate-300";

  return (
    <div className={`flex items-center ${variant === "full" ? "space-x-3.5" : ""} ${className}`} id="smebhawan_svg_logo">
      {/* Precision Inline SVG Logo Mark */}
      <svg
        viewBox="0 0 100 100"
        className={`${iconSizes[size]} shrink-0 transition-all duration-300`}
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Outer archway (Dark Slate / Charcoal) */}
        <path
          d="M24 82V48C24 33 34 20 50 16C66 20 76 33 76 48V82H66V48C66 38 59 30 50 27C41 30 34 38 34 48V82H24Z"
          fill={lightText ? "#f1f5f9" : "#1e293b"}
        />
        {/* Inner nested archway (Terracota / Rust Brown) */}
        <path
          d="M38 82V52C38 44 43 37 50 34C57 37 62 44 62 52V82H52V52C52 50 49 46 50 44C51 46 48 50 48 52V82H38Z"
          fill="#b45309"
        />
      </svg>

      {variant === "full" && (
        <div className="flex flex-col justify-center select-none">
          {/* Main wordmark */}
          <span className={`font-sans font-normal tracking-tight leading-none ${textSizes[size]} ${textClass}`}>
            smebhawan
          </span>
          
          {/* Horizontal Divider Line */}
          <div className={`w-full border-t my-1.5 ${lineClass}`} />
          
          {/* Tagline / Subtitle */}
          <span className={`font-sans font-medium uppercase leading-none ${subtitleSizes[size]} ${mutedTextClass}`}>
            Building Together
          </span>
        </div>
      )}
    </div>
  );
}
