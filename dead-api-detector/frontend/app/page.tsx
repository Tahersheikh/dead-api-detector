/**
 * Dead API Detector — Main Dashboard Page
 *
 * Server component fetches initial data.
 * Client component (DashboardClient) handles interactivity.
 */
import { Suspense } from "react";
import { fetchApis, fetchCategories } from "@/lib/api";
import DashboardClient from "./DashboardClient";

export const revalidate = 60; // ISR: regenerate every 60 seconds

export default async function HomePage() {
  let apis       = await fetchApis().catch(() => []);
  let categories = await fetchCategories().catch(() => []);

  return (
    <main className="min-h-screen bg-gray-950">
      {/* ── Header ─────────────────────────────────────────── */}
      <header className="border-b border-gray-800 bg-gray-900/80 backdrop-blur-sm sticky top-0 z-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="text-2xl">📡</span>
            <div>
              <h1 className="text-xl font-bold text-white tracking-tight">Dead API Detector</h1>
              <p className="text-xs text-gray-500">Real-time public API health monitor</p>
            </div>
          </div>
          <span className="text-xs text-gray-600 hidden sm:block">
            Auto-refreshes hourly · Free tier
          </span>
        </div>
      </header>

      {/* ── Dashboard ──────────────────────────────────────── */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Suspense fallback={<div className="text-gray-400">Loading dashboard...</div>}>
          <DashboardClient initialApis={apis} initialCategories={categories} />
        </Suspense>
      </div>

      {/* ── Footer ─────────────────────────────────────────── */}
      <footer className="mt-16 border-t border-gray-800 py-6 text-center text-xs text-gray-600">
        <p>
          Dead API Detector · Checks {apis.length} public APIs every hour ·{" "}
          <a
            href="https://github.com/yourusername/dead-api-detector"
            className="underline hover:text-gray-400"
            target="_blank"
            rel="noopener noreferrer"
          >
            Open Source on GitHub
          </a>
        </p>
      </footer>
    </main>
  );
}
