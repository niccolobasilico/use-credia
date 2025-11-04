import QualificaWizard from './qualifica-wizard';

export const revalidate = 0;

export default function QualificaPage() {
  return (
    <div className="space-y-6">
      <header className="space-y-2">
        <h1 className="text-xl font-semibold text-white">Procedura Qualifica Finanziabilità</h1>
        <p className="text-sm text-white/50">
          Completa i passaggi guidati per valutare redditività, rischi, documentazione e generare il dossier stampabile.
        </p>
      </header>

      <QualificaWizard />
    </div>
  );
}
