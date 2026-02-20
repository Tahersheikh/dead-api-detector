import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title:       "Dead API Detector — Public API Health Monitor",
  description: "Monitor public API health and uptime in real-time. See which APIs are up, down, and their response times.",
  keywords:    ["API monitor", "API health", "uptime", "public APIs"],
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
