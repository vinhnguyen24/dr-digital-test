// src/types/abe.ts

export interface Abe {
  id: string;
  fullName: string;
  userId: string;
  phoneNumber: string;
  region: string;
  role: "staff" | "supervisor";
  email: string;
  status: "active" | "pending" | "banned";
}
