import { headers } from 'next/headers';

import { auth } from '#/auth';
import { DashboardShell } from '#/ui/dashboard/shell';

const adminLinks = [
  { href: '/admin/dashboard', label: 'Overview', exact: false },
  { href: '/admin/clients', label: 'Clienti', exact: false },
  { href: '/admin/practices', label: 'Pratiche', exact: false },
  { href: '/admin/qualifica', label: 'Qualifica Finanziabilità', exact: true },
];

const resolveActivePath = () => {
  const headersList = headers();
  return (
    headersList.get('x-invoke-path') ??
    headersList.get('next-url') ??
    headersList.get('referer') ??
    '/admin/dashboard'
  );
};

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const session = await auth();

  if (!session?.user) {
    return null;
  }

  const activePath = resolveActivePath();

  return (
    <DashboardShell
      role={session.user.role}
      userEmail={session.user.email}
      navLinks={adminLinks}
      activePath={activePath.startsWith('/admin') ? activePath : '/admin/dashboard'}
    >
      {children}
    </DashboardShell>
  );
}
