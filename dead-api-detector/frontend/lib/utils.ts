import { formatDistanceToNow, parseISO } from "date-fns";

/** Format a UTC ISO timestamp as "2 minutes ago" */
export function relativeTime(iso: string | null): string {
  if (!iso) return "Never";
  try {
    return formatDistanceToNow(parseISO(iso), { addSuffix: true });
  } catch {
    return "Unknown";
  }
}

/** Colour-code response time in milliseconds */
export function responseTimeColor(ms: number, status: string): string {
  if (status !== "up") return "text-gray-400";
  if (ms < 500)  return "text-emerald-400";
  if (ms < 2000) return "text-yellow-400";
  return "text-red-400";
}

/** Display response time label */
export function responseTimeLabel(ms: number, status: string): string {
  if (status !== "up") return "—";
  return `${ms.toLocaleString()}ms`;
}

/** Debounce helper */
export function debounce<T extends (...args: unknown[]) => void>(
  fn: T,
  delay: number
): (...args: Parameters<T>) => void {
  let timer: ReturnType<typeof setTimeout>;
  return (...args: Parameters<T>) => {
    clearTimeout(timer);
    timer = setTimeout(() => fn(...args), delay);
  };
}
