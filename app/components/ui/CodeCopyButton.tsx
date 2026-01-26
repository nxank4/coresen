"use client";

import React, { useState } from "react";
import { Copy, Check } from "lucide-react";

interface CodeCopyButtonProps {
  code: string;
  className?: string;
}

export function CodeCopyButton({ code, className = "" }: CodeCopyButtonProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      setTimeout(() => {
        setCopied(false);
      }, 2000);
    } catch (err) {
      console.error("Failed to copy code:", err);
    }
  };

  return (
    <button
      onClick={handleCopy}
      className={`p-1.5 rounded hover:bg-neutral-200 dark:hover:bg-neutral-700 transition-colors duration-200 opacity-70 hover:opacity-100 ${className}`}
      aria-label={copied ? "Copied!" : "Copy code"}
      title={copied ? "Copied!" : "Copy code"}
    >
      {copied ? (
        <Check size={16} className="text-green-600 dark:text-green-400" />
      ) : (
        <Copy size={16} className="text-neutral-600 dark:text-neutral-400" />
      )}
    </button>
  );
}
