export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-gray-950 via-[#221b47] to-[#0f172a] p-6">
      <div className="w-full max-w-md rounded-3xl border border-white/10 bg-gray-950/80 p-8 shadow-2xl shadow-[#667eea]/20">
        <div className="mb-8 text-center">
          <p className="text-xs uppercase tracking-widest text-white/40">UseCredia</p>
          <h1 className="mt-2 text-2xl font-semibold text-white">Portale crediti</h1>
          <p className="mt-2 text-sm text-white/60">
            Accedi con le credenziali fornite dal team amministratore.
          </p>
        </div>
        {children}
      </div>
    </div>
  );
}
