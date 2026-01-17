"use client";

import { useEffect } from "react";

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
    <div>
      <p>
        Uh-oh! Looks like the code tripped over itself. Maybe give it a good ol'
        refresh slap?
      </p>
      <button
        onClick={reset}
        style={{ marginTop: "10px", padding: "8px 16px" }}
      >
        Fix it, Captain!
      </button>
    </div>
  );
}
