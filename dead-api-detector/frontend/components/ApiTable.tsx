"use client";

import { ApiRecord } from "@/lib/types";
import { relativeTime, responseTimeColor, responseTimeLabel } from "@/lib/utils";
import StatusBadge from "./StatusBadge";

interface Props {
  apis:      ApiRecord[];
  checking:  boolean;
}

export default function ApiTable({ apis, checking }: Props) {
  if (apis.length === 0) {
    return (
      <div className="text-center py-20 text-gray-500">
        <p className="text-5xl mb-4">🔍</p>
        <p className="text-lg">No APIs match your search.</p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto rounded-xl border border-gray-800 shadow-xl">
      <table className="w-full text-sm text-left">
        <thead>
          <tr className="bg-gray-900 border-b border-gray-800 text-gray-400 uppercase text-xs tracking-wider">
            <th className="px-5 py-3">Status</th>
            <th className="px-5 py-3">API Name</th>
            <th className="px-5 py-3 hidden md:table-cell">Category</th>
            <th className="px-5 py-3 hidden sm:table-cell">Response Time</th>
            <th className="px-5 py-3 hidden lg:table-cell">URL</th>
            <th className="px-5 py-3 hidden lg:table-cell">Last Checked</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-800/50">
          {apis.map((api) => (
            <tr
              key={api.id}
              className="bg-gray-950 hover:bg-gray-900 transition-colors duration-150"
            >
              <td className="px-5 py-4">
                <StatusBadge status={api.status} checking={checking} />
              </td>
              <td className="px-5 py-4 font-medium text-white">{api.name}</td>
              <td className="px-5 py-4 hidden md:table-cell">
                <span className="inline-block px-2 py-0.5 rounded-full text-xs bg-gray-800 text-gray-300 border border-gray-700">
                  {api.category}
                </span>
              </td>
              <td className={`px-5 py-4 font-mono hidden sm:table-cell ${responseTimeColor(api.response_time_ms, api.status)}`}>
                {responseTimeLabel(api.response_time_ms, api.status)}
              </td>
              <td className="px-5 py-4 hidden lg:table-cell max-w-xs">
                <a
                  href={api.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-400 hover:text-blue-300 underline underline-offset-2 truncate block"
                  title={api.url}
                >
                  {new URL(api.url).hostname}
                </a>
              </td>
              <td className="px-5 py-4 hidden lg:table-cell text-gray-500" title={api.last_checked ?? ""}>
                {relativeTime(api.last_checked)}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
