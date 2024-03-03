"use client";

import SidebarNav from "@/components/sidebar-nav";

export default function ProtectedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex h-screen flex-row gap-3 p-3">
      <aside className="sticky top-0 max-h-screen w-60 rounded-lg  border border-neutral-800 p-5 max-md:hidden ">
        <SidebarNav />
      </aside>
      <main className="relative max-h-screen flex-1  overflow-auto  rounded-lg border border-neutral-800 pb-5">
        {children}
      </main>
    </div>
  );
}
