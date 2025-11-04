export const PRACTICE_STATUSES = ['IN_ATTESA', 'APPROVATA', 'RIFIUTATA', 'LIQUIDATA'] as const;

export type PracticeStatus = (typeof PRACTICE_STATUSES)[number];

export const PRACTICE_STATUS_LABELS: Record<PracticeStatus, string> = {
  IN_ATTESA: 'In attesa',
  APPROVATA: 'Approvata',
  RIFIUTATA: 'Rifiutata',
  LIQUIDATA: 'Liquidata',
};

export const PRACTICE_STATUS_BADGES: Record<PracticeStatus, string> = {
  IN_ATTESA: 'border-yellow-500/60 bg-yellow-500/10 text-yellow-200',
  APPROVATA: 'border-emerald-500/60 bg-emerald-500/10 text-emerald-200',
  RIFIUTATA: 'border-rose-500/60 bg-rose-500/10 text-rose-200',
  LIQUIDATA: 'border-emerald-500 bg-emerald-500 text-gray-950',
};

export const PRACTICE_INCASSO_BADGES: Record<boolean, string> = {
  true: 'border-emerald-500/50 bg-emerald-500/10 text-emerald-200',
  false: 'border-yellow-400/60 bg-yellow-400/10 text-yellow-200',
};

export const PRACTICE_INCASSO_LABELS: Record<boolean, string> = {
  true: 'Sì',
  false: 'No',
};
