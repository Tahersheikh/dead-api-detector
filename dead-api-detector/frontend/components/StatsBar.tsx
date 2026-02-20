"use client";

import { ApiRecord } from "@/lib/types";

interface Props {
  apis: ApiRecord[];
}

export default function StatsBar({ apis }: Props) {
  const total   = apis.length;
  const up      = apis.filter((a) => a.status === "up").length;
  const down    = apis.filter((a) => a.status === "down").length;
  const unknown = apis.filter((a) => a.status === "unknown").length;
  const pct     = total > 0 ? Math.round((up / total) * 100) : 0;

  const statClass = "flex flex-col items-center px-5 py-3 rounded-xl bg-gray-900 border border-gray-800";

  return (
    <div className="flex flex-wrap gap-3 justify-center sm:justify-start">
      <div className={statClass}>
        <span className="text-2xl font-bold text-white">{total}</span>
        <span className="text-xs text-gray-400 mt-0.5">Total APIs</span>
      </div>
      <div className={statClass}>
        <span className="text-2xl font-bold text-emerald-400">{up}</span>
        <span className="text-xs text-gray-400 mt-0.5">Up</span>
      </div>
      <div className={statClass}>
        <span className="text-2xl font-bold text-red-400">{down}</span>
        <span className="text-xs text-gray-400 mt-0.5">Down</span>
      </div>
      {unknown > 0 && (
        <div className={statClass}>
          <span className="text-2xl font-bold text-gray-400">{unknown}</span>
          <span className="text-xs text-gray-400 mt-0.5">Unknown</span>
        </div>
      )}
      {total > 0 && (
        <div className={statClass}>
          <span className={`text-2xl font-bold ${pct >= 90 ? "text-emerald-400" : pct >= 70 ? "text-yellow-400" : "text-red-400"}`}>
            {pct}%
          </span>
          <span className="text-xs text-gray-400 mt-0.5">Uptime</span>
        </div>
      )}
    </div>
  );
}
