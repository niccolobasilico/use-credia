import 'next-auth';
import 'next-auth/jwt';

declare module 'next-auth' {
  interface Session {
    user: {
      id: string;
      email: string;
      role: 'ADMIN' | 'EMPLOYEE' | 'CLIENT';
      clientCompanyId: string | null;
      name?: string | null;
    };
  }

  interface User {
    id: string;
    email: string;
    role: 'ADMIN' | 'EMPLOYEE' | 'CLIENT';
    clientCompanyId?: string | null;
    displayName?: string | null;
    passwordHash?: string;
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    id?: string;
    role?: 'ADMIN' | 'EMPLOYEE' | 'CLIENT';
    clientCompanyId?: string | null;
  }
}
