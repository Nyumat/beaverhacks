'use client';

import SidebarNav from '@/components/sidebar-nav';
import ProtectedLayout from '../layouts/ProtectecLayout';

export default function SynthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <ProtectedLayout>{children}</ProtectedLayout>;
}
