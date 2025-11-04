import type { PracticeStatus } from '#/lib/constants/practices';

export interface PracticeRecord {
  id: string;
  clientCompanyId: string;
  clientCompanyName: string;
  customerName: string;
  assignedEmployeeId: string | null;
  assignedEmployeeName?: string | null;
  amount: number;
  type: string;
  status: PracticeStatus;
  incassata: boolean;
  createdAt: string;
  updatedAt?: string | null;
  expectedPayoutDate?: string | null;
  liquidatedAt?: string | null;
}

export interface PracticeHistoryRecord {
  id: string;
  practiceId: string;
  status: PracticeStatus;
  incassata: boolean;
  note?: string | null;
  createdAt: string;
  userId: string;
  userName?: string | null;
}
