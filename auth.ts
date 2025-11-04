import NextAuth from 'next-auth';
import Credentials from 'next-auth/providers/credentials';
import { z } from 'zod';

import { getUserByEmail, verifyUserPassword } from '#/lib/services/users';

const credentialsSchema = z.object({
  email: z.string().email({ message: 'Email non valida' }),
  password: z.string().min(1, { message: 'Inserire la password' }),
});

export const {
  handlers: { GET, POST },
  auth,
  signIn,
  signOut,
} = NextAuth({
  session: { strategy: 'jwt' },
  pages: { signIn: '/login' },
  providers: [
    Credentials({
      id: 'credentials',
      name: 'Credenziali',
      async authorize(credentials) {
        const parsed = credentialsSchema.safeParse(credentials);

        if (!parsed.success) {
          return null;
        }

        const { email, password } = parsed.data;
        const user = await getUserByEmail(email);

        if (!user) {
          return null;
        }

        const passwordValid = await verifyUserPassword(user, password);

        if (!passwordValid) {
          return null;
        }

        return {
          id: user.id,
          email: user.email,
          role: user.role,
          clientCompanyId: user.clientCompanyId ?? null,
          name: user.displayName ?? user.email,
        };
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id as string;
        token.role = (user as { role?: string }).role ?? 'CLIENT';
        token.clientCompanyId = (user as { clientCompanyId?: string | null }).clientCompanyId ?? null;
      }

      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string;
        session.user.role = (token.role as string | undefined) ?? 'CLIENT';
        session.user.clientCompanyId = (token.clientCompanyId as string | null | undefined) ?? null;
      }

      return session;
    },
  },
});
