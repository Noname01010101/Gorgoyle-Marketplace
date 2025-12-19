"use client";

import { useState } from "react";
import { usePathname } from "next/navigation";

export default function PreReleaseWarning() {
  const [isVisible, setIsVisible] = useState(true);
  const pathname = usePathname();

  // Don't show warning on resume pages
  if (pathname?.startsWith("/resumee")) return null;

  if (!isVisible) return null;

  return (
    <div className="fixed top-0 left-0 right-0 z-[100] bg-yellow-50 border-b border-yellow-200">
      <div className="max-w-7xl mx-auto px-4 py-3 sm:px-6 lg:px-8">
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-start gap-3">
            <div className="flex-shrink-0 pt-0.5">
              <svg
                className="h-5 w-5 text-yellow-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                />
              </svg>
            </div>
            <div className="flex-1">
              <h3 className="text-sm font-semibold text-yellow-800">
                Pre-Release Version
              </h3>
              <div className="mt-1 text-sm text-yellow-700">
                <p>
                  This application is in pre-release. The database may not be
                  fully populated, and the API may experience delays due to
                  free-tier instance cold starts. Please allow a few seconds for
                  initial requests to complete.
                </p>
              </div>
            </div>
          </div>
          <button
            type="button"
            onClick={() => setIsVisible(false)}
            className="flex-shrink-0 inline-flex rounded-md bg-yellow-50 p-1.5 text-yellow-600 hover:bg-yellow-100 focus:outline-none focus:ring-2 focus:ring-yellow-600 focus:ring-offset-2 focus:ring-offset-yellow-50"
            aria-label="Dismiss warning"
          >
            <svg
              className="h-5 w-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}
