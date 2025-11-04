import { isSupabaseConfigured } from '#/lib/config';
import { demoClients, demoHistory, demoPractices } from '#/lib/mock-data';
import { getSupabaseAdminClient } from '#/lib/supabase/admin';
import {
  PRACTICE_STATUSES,
  type PracticeStatus,
} from '#/lib/constants/practices';
import type { ClientCompanyRecord } from '#/lib/types/client';
import type { PracticeHistoryRecord, PracticeRecord } from '#/lib/types/practice';

const sumAmounts = (practices: PracticeRecord[], predicate: (practice: PracticeRecord) => boolean) =>
  practices.filter(predicate).reduce((acc, practice) => acc + practice.amount, 0);

const countByStatus = (practices: PracticeRecord[]) =>
  PRACTICE_STATUSES.map((status) => ({
    status,
    count: practices.filter((practice) => practice.status === status).length,
    amount: sumAmounts(practices, (practice) => practice.status === status),
  }));

const incassoBreakdown = (practices: PracticeRecord[]) => ({
  yes: sumAmounts(practices, (practice) => practice.incassata),
  no: sumAmounts(practices, (practice) => !practice.incassata),
});

const mapSupabasePractice = (record: any): PracticeRecord => ({
  id: record.id,
  clientCompanyId: record.client_company_id,
  clientCompanyName: record.client_company?.name ?? record.client_company_name ?? '—',
  customerName: record.customer_name ?? 'Cliente',
  assignedEmployeeId: record.assigned_employee_id ?? null,
  assignedEmployeeName:
    record.assigned_employee?.display_name ?? record.assigned_employee_name ?? null,
  amount: record.amount ?? 0,
  type: record.type ?? '—',
  status: record.status as PracticeStatus,
  incassata: Boolean(record.incassata),
  createdAt: record.created_at,
  updatedAt: record.updated_at,
  expectedPayoutDate: record.expected_payout_date,
  liquidatedAt: record.liquidated_at,
});

const mapSupabaseHistory = (record: any): PracticeHistoryRecord => ({
  id: record.id,
  practiceId: record.practice_id,
  status: record.status as PracticeStatus,
  incassata: Boolean(record.incassata),
  note: record.note,
  createdAt: record.created_at,
  userId: record.user_id,
  userName: record.user?.display_name ?? record.user_name ?? null,
});

const mapSupabaseClient = (record: any): ClientCompanyRecord => ({
  id: record.id,
  name: record.name,
  vatNumber: record.vat_number,
  taxCode: record.tax_code,
  email: record.email,
  phone: record.phone,
  address: record.address,
  city: record.city,
  province: record.province,
  postalCode: record.postal_code,
  contactName: record.contact_name,
  createdAt: record.created_at,
  updatedAt: record.updated_at,
});

export interface AdminDashboardData {
  summary: {
    totalPractices: number;
    totalClients: number;
    liquidatedVolume: number;
    pendingVolume: number;
    incassoYes: number;
    incassoNo: number;
  };
  statusBreakdown: { status: PracticeStatus; count: number; amount: number }[];
  incassoBreakdown: { yes: number; no: number };
  practices: PracticeRecord[];
  recentHistory: PracticeHistoryRecord[];
  clients: ClientCompanyRecord[];
}

export const getAdminDashboardData = async (): Promise<AdminDashboardData> => {
  if (!isSupabaseConfigured()) {
    const summaryPractices = demoPractices;

    return {
      summary: {
        totalPractices: summaryPractices.length,
        totalClients: demoClients.length,
        liquidatedVolume: sumAmounts(summaryPractices, (practice) => practice.status === 'LIQUIDATA'),
        pendingVolume: sumAmounts(summaryPractices, (practice) => practice.status !== 'LIQUIDATA'),
        incassoYes: incassoBreakdown(summaryPractices).yes,
        incassoNo: incassoBreakdown(summaryPractices).no,
      },
      statusBreakdown: countByStatus(summaryPractices),
      incassoBreakdown: incassoBreakdown(summaryPractices),
      practices: summaryPractices,
      recentHistory: demoHistory,
      clients: demoClients,
    };
  }

  const supabase = getSupabaseAdminClient();

  const [{ data: practicesData, error: practicesError }, { data: clientsData, error: clientsError }, { data: historyData, error: historyError }] =
    await Promise.all([
      supabase
        .from('practices')
        .select(
          'id, customer_name, client_company_id, client_company:client_companies(name), assigned_employee_id, assigned_employee:users(display_name), amount, type, status, incassata, created_at, updated_at, expected_payout_date, liquidated_at',
        ),
      supabase.from('client_companies').select('*'),
      supabase
        .from('practice_status_history')
        .select('id, practice_id, status, incassata, note, created_at, user_id, user:users(display_name)')
        .order('created_at', { ascending: false })
        .limit(20),
    ]);

  if (practicesError) {
    throw new Error(`Errore nel recupero delle pratiche: ${practicesError.message}`);
  }

  if (clientsError) {
    throw new Error(`Errore nel recupero dei clienti: ${clientsError.message}`);
  }

  if (historyError) {
    throw new Error(`Errore nel recupero dello storico pratiche: ${historyError.message}`);
  }

  const practices = (practicesData ?? []).map(mapSupabasePractice);
  const clients = (clientsData ?? []).map(mapSupabaseClient);
  const recentHistory = (historyData ?? []).map(mapSupabaseHistory);

  const breakdown = incassoBreakdown(practices);

  return {
    summary: {
      totalPractices: practices.length,
      totalClients: clients.length,
      liquidatedVolume: sumAmounts(practices, (practice) => practice.status === 'LIQUIDATA'),
      pendingVolume: sumAmounts(practices, (practice) => practice.status !== 'LIQUIDATA'),
      incassoYes: breakdown.yes,
      incassoNo: breakdown.no,
    },
    statusBreakdown: countByStatus(practices),
    incassoBreakdown: breakdown,
    practices,
    recentHistory,
    clients,
  };
};

export interface ClientDashboardData {
  summary: {
    totalPractices: number;
    incassoYes: number;
    incassoNo: number;
  };
  statusBreakdown: { status: PracticeStatus; count: number }[];
  practices: PracticeRecord[];
}

export const getClientDashboardData = async (
  clientCompanyId: string,
): Promise<ClientDashboardData> => {
  if (!clientCompanyId) {
    throw new Error('clientCompanyId richiesto per il dashboard cliente');
  }

  if (!isSupabaseConfigured()) {
    const clientPractices = demoPractices.filter(
      (practice) => practice.clientCompanyId === clientCompanyId,
    );
    const statusBreakdown = PRACTICE_STATUSES.map((status) => ({
      status,
      count: clientPractices.filter((practice) => practice.status === status).length,
    }));

    return {
      summary: {
        totalPractices: clientPractices.length,
        incassoYes: incassoBreakdown(clientPractices).yes,
        incassoNo: incassoBreakdown(clientPractices).no,
      },
      statusBreakdown,
      practices: clientPractices,
    };
  }

  const supabase = getSupabaseAdminClient();

  const { data, error } = await supabase
    .from('practices')
    .select(
      'id, customer_name, client_company_id, client_company:client_companies(name), assigned_employee_id, assigned_employee:users(display_name), amount, type, status, incassata, created_at, updated_at, expected_payout_date, liquidated_at',
    )
    .eq('client_company_id', clientCompanyId);

  if (error) {
    throw new Error(`Errore nel recupero delle pratiche cliente: ${error.message}`);
  }

  const practices = (data ?? []).map(mapSupabasePractice);

  const statusBreakdown = PRACTICE_STATUSES.map((status) => ({
    status,
    count: practices.filter((practice) => practice.status === status).length,
  }));

  const breakdown = incassoBreakdown(practices);

  return {
    summary: {
      totalPractices: practices.length,
      incassoYes: breakdown.yes,
      incassoNo: breakdown.no,
    },
    statusBreakdown,
    practices,
  };
};
