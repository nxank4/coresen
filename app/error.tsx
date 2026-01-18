"use client";

import { useEffect } from "react";
import Link from "next/link";

export default function Error({
  error,
  reset,
}: {
  error: Error;
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Error detected:", error);
  }, [error]);

  return (
    <section className="flex flex-col items-center justify-center min-h-[60vh] text-center">
      <div className="max-w-md mx-auto px-4">
        <h1 className="text-4xl md:text-5xl font-heading font-bold mb-4 text-neutral-900 dark:text-neutral-100 tracking-tight">
          Something went wrong
        </h1>
        <p className="text-lg mb-2 text-neutral-600 dark:text-neutral-400">
          An unexpected error occurred. Don&apos;t worry, it happens to the best of us.
        </p>
        <p className="text-sm mb-8 text-neutral-500 dark:text-neutral-500">
          Error: {error.message || "Unknown error"}
        </p>
        
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <button
            onClick={reset}
            className="px-6 py-3 bg-neutral-900 dark:bg-neutral-100 text-white dark:text-neutral-900 rounded-lg font-medium hover:opacity-90 transition-opacity focus:outline-none focus:ring-2 focus:ring-neutral-400 dark:focus:ring-neutral-600"
          >
            Try again
          </button>
          <Link
            href="/"
            className="px-6 py-3 border border-neutral-300 dark:border-neutral-700 text-neutral-900 dark:text-neutral-100 rounded-lg font-medium hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors focus:outline-none focus:ring-2 focus:ring-neutral-400 dark:focus:ring-neutral-600"
          >
            Go home
          </Link>
        </div>
      </div>
    </section>
  );
}
