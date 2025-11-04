export interface ClientCompanyRecord {
  id: string;
  name: string;
  vatNumber?: string | null;
  taxCode?: string | null;
  email?: string | null;
  phone?: string | null;
  address?: string | null;
  city?: string | null;
  province?: string | null;
  postalCode?: string | null;
  contactName?: string | null;
  createdAt: string;
  updatedAt?: string | null;
}

export interface ClientUserRecord {
  id: string;
  email: string;
  role: 'CLIENT';
  clientCompanyId: string;
  invitedAt?: string | null;
}
