import { headers } from 'next/headers';

import { auth } from '#/auth';
import { DashboardShell } from '#/ui/dashboard/shell';

const clientLinks = [
  { href: '/client/dashboard', label: 'Panoramica', exact: true },
];

const resolveActivePath = () => {
  const headersList = headers();
  return (
    headersList.get('x-invoke-path') ??
    headersList.get('next-url') ??
    headersList.get('referer') ??
    '/client/dashboard'
  );
};

export default async function ClientLayout({ children }: { children: React.ReactNode }) {
  const session = await auth();

  if (!session?.user) {
    return null;
  }

  const activePath = resolveActivePath();

  return (
    <DashboardShell
      role={session.user.role}
      userEmail={session.user.email}
      navLinks={clientLinks}
      activePath={activePath.startsWith('/client') ? activePath : '/client/dashboard'}
    >
      {children}
    </DashboardShell>
  );
}
