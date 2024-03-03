"use client";

import ProtectedLayout from "../layouts/ProtectecLayout";

export default function Layout({ children }: { children: React.ReactNode }) {
  return <ProtectedLayout>{children}</ProtectedLayout>;
}
