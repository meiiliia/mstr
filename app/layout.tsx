import type { Metadata } from "next";
import "./globals.css";

import ThemeProvider from "@/components/providers/ThemeProvider";

export const metadata: Metadata = {
  title: "MFC Monitoring",
  description: "Sistem monitoring Microbial Fuel Cell",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id" suppressHydrationWarning>
      <body>
        <ThemeProvider>
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}