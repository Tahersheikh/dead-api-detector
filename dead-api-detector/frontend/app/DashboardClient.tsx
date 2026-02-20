"use client";

/**
 * DashboardClient
 * Handles all client-side interactivity:
 *  - Category filter (synced to URL query params)
 *  - Search with 300ms debounce (synced to URL)
 *  - "Check Now" button with polling until fresh data arrives
 *  - Optimistic updates after check completes
 */
import { useState, useEffect, useCallback, useRef, useMemo } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { ApiRecord } from "@/lib/types";
import { fetchApis, triggerCheckAll } from "@/lib/api";
import { debounce } from "@/lib/utils";
import FilterBar from "@/components/FilterBar";
import ApiTable  from "@/components/ApiTable";
import StatsBar  from "@/components/StatsBar";

interface Props {
  initialApis:       ApiRecord[];
  initialCategories: string[];
}

const POLL_INTERVAL_MS   = 2_000;
const POLL_TIMEOUT_MS    = 90_000;
const SEARCH_DEBOUNCE_MS = 300;

export default function DashboardClient({ initialApis, initialCategories }: Props) {
  const router       = useRouter();
  const searchParams = useSearchParams();

  // ── State ────────────────────────────────────────────────────────────────
  const [apis,             setApis]            = useState<ApiRecord[]>(initialApis);
  const [category,         setCategory]        = useState(searchParams.get("category") ?? "");
  const [search,           setSearch]          = useState(searchParams.get("search")   ?? "");
  const [checking,         setChecking]        = useState(false);
  const [error,            setError]           = useState<string | null>(null);
  const [lastCheckTime,    setLastCheckTime]   = useState<Date | null>(null);

  const pollTimerRef    = useRef<ReturnType<typeof setInterval> | null>(null);
  const pollDeadlineRef = useRef<number>(0);

  // ── URL sync ─────────────────────────────────────────────────────────────
  const pushParams = useCallback(
    (cat: string, srch: string) => {
      const params = new URLSearchParams();
      if (cat)  params.set("category", cat);
      if (srch) params.set("search",   srch);
      const qs = params.toString();
      router.replace(qs ? `/?${qs}` : "/", { scroll: false });
    },
    [router]
  );

  // ── Filtered API list (client-side for instant feedback) ─────────────────
  const filteredApis = useMemo(() => {
    let list = apis;
    if (category) list = list.filter((a) => a.category === category);
    if (search)   list = list.filter((a) => a.name.toLowerCase().includes(search.toLowerCase()));
    return list;
  }, [apis, category, search]);

  // ── Debounced search handler ──────────────────────────────────────────────
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const debouncedPushParams = useCallback(
    debounce((cat: string, srch: string) => pushParams(cat, srch), SEARCH_DEBOUNCE_MS),
    [pushParams]
  );

  const handleCategoryChange = (cat: string) => {
    setCategory(cat);
    pushParams(cat, search);
  };

  const handleSearchChange = (srch: string) => {
    setSearch(srch);
    debouncedPushParams(category, srch);
  };

  // ── Polling: fetch fresh data until last_checked > checkStartTime ─────────
  const stopPolling = useCallback(() => {
    if (pollTimerRef.current) {
      clearInterval(pollTimerRef.current);
      pollTimerRef.current = null;
    }
  }, []);

  const startPolling = useCallback(
    (checkStartTime: Date) => {
      pollDeadlineRef.current = Date.now() + POLL_TIMEOUT_MS;

      pollTimerRef.current = setInterval(async () => {
        if (Date.now() > pollDeadlineRef.current) {
          stopPolling();
          setChecking(false);
          setError("Health check timed out. Please try again.");
          return;
        }

        try {
          const fresh = await fetchApis();
          const anyUpdated = fresh.some(
            (a) => a.last_checked && new Date(a.last_checked) > checkStartTime
          );

          if (anyUpdated) {
            setApis(fresh);
            setChecking(false);
            stopPolling();
          }
        } catch {
          // Network blip — keep polling
        }
      }, POLL_INTERVAL_MS);
    },
    [stopPolling]
  );

  // ── "Check Now" handler ───────────────────────────────────────────────────
  const handleCheckNow = useCallback(async () => {
    if (checking) return;
    setChecking(true);
    setError(null);
    const checkStartTime = new Date();
    setLastCheckTime(checkStartTime);

    try {
      // Fire off check-all (non-blocking — backend does the work)
      triggerCheckAll().catch(() => {});
      // Start polling for results
      startPolling(checkStartTime);
    } catch (err) {
      setChecking(false);
      setError("Failed to start health check. Is the backend running?");
    }
  }, [checking, startPolling]);

  // Cleanup on unmount
  useEffect(() => () => stopPolling(), [stopPolling]);

  // ── Render ────────────────────────────────────────────────────────────────
  return (
    <div className="space-y-6">
      {/* Stats summary */}
      <StatsBar apis={apis} />

      {/* Error banner */}
      {error && (
        <div
          role="alert"
          className="flex items-start gap-3 p-4 rounded-lg bg-red-950 border border-red-800 text-red-300 text-sm"
        >
          <span className="text-lg shrink-0">⚠️</span>
          <span>{error}</span>
          <button
            onClick={() => setError(null)}
            className="ml-auto text-red-400 hover:text-red-200 font-bold"
            aria-label="Dismiss error"
          >
            ✕
          </button>
        </div>
      )}

      {/* Controls */}
      <FilterBar
        categories={initialCategories}
        selectedCategory={category}
        search={search}
        checking={checking}
        onCategoryChange={handleCategoryChange}
        onSearchChange={handleSearchChange}
        onCheckNow={handleCheckNow}
      />

      {/* Result count */}
      <p className="text-xs text-gray-500">
        Showing <span className="text-gray-300 font-medium">{filteredApis.length}</span> of{" "}
        <span className="text-gray-300 font-medium">{apis.length}</span> APIs
        {checking && (
          <span className="ml-3 text-blue-400 animate-pulse">
            ⚡ Running health checks…
          </span>
        )}
      </p>

      {/* Main table */}
      <ApiTable apis={filteredApis} checking={checking} />
    </div>
  );
}
