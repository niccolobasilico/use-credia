import { redirect } from 'next/navigation';

import { auth } from '#/auth';

export default async function HomePage() {
  const session = await auth();

  if (!session?.user) {
    redirect('/login');
  }

  const role = session.user.role;

  if (role === 'ADMIN' || role === 'EMPLOYEE') {
    redirect('/admin/dashboard');
  }

  redirect('/client/dashboard');
}
