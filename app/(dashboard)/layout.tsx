"use client";

import { useState } from "react";
import Sidebar from "@/components/layout/Sidebar";
import Header from "@/components/layout/Header";
import MobileNavigation from "@/components/layout/MobileNavigation";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <div className="flex min-h-screen bg-[var(--background)]">
      <Sidebar />

      <div className="flex min-w-0 flex-1 flex-col">
        <Header
          onMenuClick={() => setMobileMenuOpen(true)}
        />

        <main className="flex-1 p-4 sm:p-6 lg:p-8">
          {children}
        </main>
      </div>

      <MobileNavigation
        open={mobileMenuOpen}
        onClose={() => setMobileMenuOpen(false)}
      />
    </div>
  );
}