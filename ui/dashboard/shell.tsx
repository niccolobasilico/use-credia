import Link from 'next/link';
import clsx from 'clsx';

import { signOut } from '#/auth';
import { Badge } from '#/ui/badge';

interface DashboardLink {
  href: string;
  label: string;
  icon?: React.ReactNode;
  exact?: boolean;
}

interface DashboardShellProps {
  role: 'ADMIN' | 'EMPLOYEE' | 'CLIENT';
  userEmail: string;
  navLinks: DashboardLink[];
  activePath: string;
  children: React.ReactNode;
}

export async function DashboardShell({
  role,
  userEmail,
  navLinks,
  activePath,
  children,
}: DashboardShellProps) {
  const displayRole = role === 'ADMIN' ? 'Admin' : role === 'EMPLOYEE' ? 'Dipendente' : 'Cliente';

  async function handleLogout() {
    'use server';
    await signOut({ redirectTo: '/login' });
  }

  return (
    <div className="min-h-screen bg-gray-950 text-gray-100">
      <div className="flex min-h-screen flex-col lg:flex-row">
        <aside className="relative w-full max-w-full border-b border-white/5 bg-gradient-to-b from-[#667eea] via-[#6b63d9] to-[#764ba2] p-6 shadow-2xl lg:h-screen lg:w-72 lg:border-b-0 lg:border-r lg:border-white/10">
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="text-xs uppercase tracking-widest text-white/70">UseCredia</p>
              <p className="text-lg font-semibold text-white">Control Room</p>
            </div>
            <Badge className="border-white/30 bg-white/10 text-white/90">{displayRole}</Badge>
          </div>

          <nav className="mt-10 flex flex-col gap-1 text-sm">
            {navLinks.map((link) => {
              const isActive = link.exact ? activePath === link.href : activePath.startsWith(link.href);
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={clsx(
                    'flex items-center justify-between rounded-lg px-3 py-2 font-medium transition focus:outline-none focus-visible:ring-2 focus-visible:ring-white/60',
                    isActive
                      ? 'bg-white/15 text-white shadow-lg shadow-black/20'
                      : 'text-white/70 hover:bg-white/10 hover:text-white',
                  )}
                >
                  <span>{link.label}</span>
                  {link.icon ? <span className="text-white/70">{link.icon}</span> : null}
                </Link>
              );
            })}
          </nav>

          <form action={handleLogout} className="mt-10">
            <button
              type="submit"
              className="w-full rounded-lg border border-white/20 px-3 py-2 text-sm font-medium text-white/80 transition hover:border-white/40 hover:text-white"
            >
              Esci ({userEmail})
            </button>
          </form>
        </aside>

        <main className="flex-1 bg-gray-950">
          <div className="sticky top-0 z-10 border-b border-white/5 bg-gray-950/70 backdrop-blur">
            <div className="mx-auto flex w-full max-w-5xl items-center justify-between px-6 py-5">
              <div>
                <h1 className="text-xl font-semibold text-white">UseCredia Platform</h1>
                <p className="text-sm text-white/60">Monitoraggio pratiche, clienti e incassi</p>
              </div>
              <div className="flex items-center gap-3 text-xs text-white/50">
                <span>Supporto</span>
                <span>·</span>
                <span>policy interne</span>
              </div>
            </div>
          </div>

          <div className="mx-auto w-full max-w-5xl px-6 py-10">{children}</div>
        </main>
      </div>
    </div>
  );
}
