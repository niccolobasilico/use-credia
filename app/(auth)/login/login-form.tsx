'use client';

import { useState, useTransition } from 'react';
import { signIn } from 'next-auth/react';

export function LoginForm() {
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = (formData: FormData) => {
    const email = formData.get('email')?.toString() ?? '';
    const password = formData.get('password')?.toString() ?? '';

    setError(null);

    startTransition(async () => {
      const result = await signIn('credentials', {
        email,
        password,
        redirect: false,
      });

      if (result?.error) {
        setError('Credenziali non valide o account non abilitato.');
        return;
      }

      window.location.href = '/';
    });
  };

  return (
    <form
      action={handleSubmit}
      className="space-y-6 text-sm"
    >
      <div className="space-y-2">
        <label htmlFor="email" className="text-xs uppercase tracking-widest text-white/50">
          Email
        </label>
        <input
          id="email"
          name="email"
          type="email"
          required
          className="w-full rounded-xl border border-white/10 bg-gray-900/60 px-4 py-3 text-sm text-white placeholder:text-white/40 focus:border-[#667eea] focus:outline-none"
          placeholder="nome@azienda.it"
          autoComplete="email"
        />
      </div>
      <div className="space-y-2">
        <label htmlFor="password" className="text-xs uppercase tracking-widest text-white/50">
          Password
        </label>
        <input
          id="password"
          name="password"
          type="password"
          required
          className="w-full rounded-xl border border-white/10 bg-gray-900/60 px-4 py-3 text-sm text-white placeholder:text-white/40 focus:border-[#667eea] focus:outline-none"
          placeholder="••••••••"
          autoComplete="current-password"
        />
      </div>
      {error ? (
        <p className="rounded-xl border border-rose-500/40 bg-rose-500/10 px-4 py-3 text-xs text-rose-100">{error}</p>
      ) : (
        <p className="text-xs text-white/40">Le sessioni sono protette tramite JWT e autorizzazioni di ruolo.</p>
      )}
      <button
        type="submit"
        disabled={isPending}
        className="w-full rounded-xl bg-gradient-to-r from-[#667eea] to-[#764ba2] px-4 py-3 text-sm font-semibold text-white shadow-lg shadow-[#667eea]/30 transition hover:from-[#6c7cf0] hover:to-[#8053b1] disabled:opacity-60"
      >
        {isPending ? 'Accesso in corso…' : 'Accedi'}
      </button>
    </form>
  );
}
