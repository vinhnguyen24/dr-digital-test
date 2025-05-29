// src/types/abe.ts

export interface Abe {
  id: number;
  fullName: string;
  userId: string;
  phoneNumber: string;
  region: string;
  role: 'staff' | 'supervisor';
  email: string;
  status: 'active' | 'pending' | 'banned';
}
