"use client";

interface Props {
  status: "up" | "down" | "unknown";
  checking?: boolean;
}

export default function StatusBadge({ status, checking }: Props) {
  if (checking) {
    return (
      <span className="flex items-center gap-2">
        <span className="relative flex h-3 w-3">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-gray-400 opacity-75" />
          <span className="relative inline-flex rounded-full h-3 w-3 bg-gray-400" />
        </span>
        <span className="text-gray-400 text-sm">Checking…</span>
      </span>
    );
  }

  const map = {
    up:      { dot: "bg-emerald-400", label: "Up",      text: "text-emerald-400" },
    down:    { dot: "bg-red-500",     label: "Down",    text: "text-red-400"     },
    unknown: { dot: "bg-gray-500",    label: "Unknown", text: "text-gray-400"    },
  };

  const { dot, label, text } = map[status] ?? map.unknown;

  return (
    <span className="flex items-center gap-2">
      <span className={`inline-block h-3 w-3 rounded-full ${dot} shadow-lg`} aria-label={label} />
      <span className={`text-sm font-medium ${text}`}>{label}</span>
    </span>
  );
}
