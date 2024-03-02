"use client";

import SidebarNav from "@/components/sidebar-nav";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex h-screen flex-row gap-3 p-3">
      <aside className="sticky top-0 max-h-screen w-60 rounded-lg border  border-gray-2 bg-gray-3 p-5 max-md:hidden ">
        <SidebarNav />
      </aside>
      <main className="max-h-screen flex-1 overflow-auto rounded-lg  border  border-gray-2 bg-gray-3 pb-5 ">
        {children}
      </main>
    </div>
  );
}
