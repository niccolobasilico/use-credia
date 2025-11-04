import { PRACTICE_STATUSES, type PracticeStatus } from '#/lib/constants/practices';
import type { ClientCompanyRecord } from '#/lib/types/client';
import type { PracticeHistoryRecord, PracticeRecord } from '#/lib/types/practice';

const now = new Date();

const addDays = (date: Date, days: number) => {
  const copy = new Date(date);
  copy.setDate(copy.getDate() + days);
  return copy.toISOString();
};

export const demoClients: ClientCompanyRecord[] = [
  {
    id: '01J000CLIENTA',
    name: 'Credia Tech Srl',
    vatNumber: 'IT12345678901',
    email: 'amministrazione@crediatech.test',
    phone: '+39 02 1234567',
    address: 'Via Innovazione 12',
    city: 'Milano',
    province: 'MI',
    postalCode: '20100',
    contactName: 'Giulia Riva',
    createdAt: addDays(now, -120),
  },
  {
    id: '01J000CLIENTB',
    name: 'Studio Ferri Associati',
    vatNumber: 'IT98765432109',
    email: 'contabilita@studioferri.test',
    phone: '+39 051 7654321',
    address: 'Via Indipendenza 45',
    city: 'Bologna',
    province: 'BO',
    postalCode: '40100',
    contactName: 'Marco Ferri',
    createdAt: addDays(now, -240),
  },
  {
    id: '01J000CLIENTC',
    name: 'Retail Solutions SPA',
    vatNumber: 'IT19283746509',
    email: 'finanza@retailsolutions.test',
    phone: '+39 06 9023456',
    address: 'Viale Europa 88',
    city: 'Roma',
    province: 'RM',
    postalCode: '00100',
    contactName: 'Sara Greco',
    createdAt: addDays(now, -300),
  },
];

const sampleStatus = (status: PracticeStatus, offset: number): PracticeHistoryRecord => ({
  id: `HIST-${status}-${offset}`,
  practiceId: 'PLACEHOLDER',
  status,
  incassata: status === 'LIQUIDATA',
  note: `Aggiornamento ${status.toLowerCase()}`,
  createdAt: addDays(now, offset),
  userId: '01JADMIN',
  userName: 'Admin Demo',
});

export const demoPractices: PracticeRecord[] = [
  {
    id: '01JPRAC001',
    clientCompanyId: demoClients[0]!.id,
    clientCompanyName: demoClients[0]!.name,
    customerName: 'Francesco De Luca',
    assignedEmployeeId: '01JEMP001',
    assignedEmployeeName: 'Paola Fontana',
    amount: 48000,
    type: 'Cessione del quinto',
    status: 'IN_ATTESA',
    incassata: true,
    createdAt: addDays(now, -15),
    expectedPayoutDate: addDays(now, 30),
  },
  {
    id: '01JPRAC002',
    clientCompanyId: demoClients[1]!.id,
    clientCompanyName: demoClients[1]!.name,
    customerName: 'Lucia Pavan',
    assignedEmployeeId: '01JEMP001',
    assignedEmployeeName: 'Paola Fontana',
    amount: 21000,
    type: 'Prestito personale',
    status: 'APPROVATA',
    incassata: true,
    createdAt: addDays(now, -45),
    liquidatedAt: addDays(now, -7),
  },
  {
    id: '01JPRAC003',
    clientCompanyId: demoClients[1]!.id,
    clientCompanyName: demoClients[1]!.name,
    customerName: 'Daniele Valli',
    assignedEmployeeId: '01JEMP002',
    assignedEmployeeName: 'Chiara Mignani',
    amount: 32500,
    type: 'Consolidamento debiti',
    status: 'LIQUIDATA',
    incassata: true,
    createdAt: addDays(now, -120),
    liquidatedAt: addDays(now, -12),
  },
  {
    id: '01JPRAC004',
    clientCompanyId: demoClients[2]!.id,
    clientCompanyName: demoClients[2]!.name,
    customerName: 'Giorgia Sanna',
    assignedEmployeeId: '01JEMP003',
    assignedEmployeeName: 'Davide Carli',
    amount: 16500,
    type: 'Mutuo liquidità',
    status: 'RIFIUTATA',
    incassata: false,
    createdAt: addDays(now, -20),
  },
  {
    id: '01JPRAC005',
    clientCompanyId: demoClients[0]!.id,
    clientCompanyName: demoClients[0]!.name,
    customerName: 'Elena Sarti',
    assignedEmployeeId: '01JEMP003',
    assignedEmployeeName: 'Davide Carli',
    amount: 54000,
    type: 'Anticipo TFS',
    status: 'APPROVATA',
    incassata: true,
    createdAt: addDays(now, -5),
  },
];

export const demoHistory: PracticeHistoryRecord[] = demoPractices.flatMap((practice, index) => {
  const historyEntries = PRACTICE_STATUSES.map((status, statusIndex) => ({
    ...sampleStatus(status, -index * 6 - statusIndex * 4),
    practiceId: practice.id,
    incassata: status === 'LIQUIDATA' ? practice.incassata : practice.incassata,
  }));

  return historyEntries.slice(0, 3);
});

export const demoUsers = [
  {
    id: '01JADMIN',
    email: 'admin@usecredia.demo',
    role: 'ADMIN' as const,
    displayName: 'Admin Demo',
    passwordHash:
      '$2a$10$4QbUe7x8WcN6i/K3PaY5Me3sX3ENo5KqsA19qvNLs2Gwx9DhFF60y',
  },
  {
    id: '01JEMP001',
    email: 'paola.fontana@usecredia.demo',
    role: 'EMPLOYEE' as const,
    displayName: 'Paola Fontana',
    passwordHash:
      '$2a$10$GOhflU8dZkWQaxv6iJkGxO3E8pk8mL9YlE7C8Tn/Z5qX2aO9pYgIu',
  },
  {
    id: '01JCLIENT001',
    email: 'cliente@crediatech.demo',
    role: 'CLIENT' as const,
    displayName: 'Cliente Demo',
    clientCompanyId: demoClients[0]!.id,
    passwordHash:
      '$2a$10$F0LPgAvFp8Z64KbjDg7otu9KuX3sI5Yucs5cjox96D65gis6pZe1K',
  },
];
