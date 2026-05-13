/**
 * Core domain types for Droposit.
 *
 * Status is intentionally limited to three stages per proposal scope:
 * "pending" → "deposited" → "claimed". Don't expand this.
 */

export type ItemStatus = "pending" | "deposited" | "claimed";

export type UserRole = "depositor" | "staff";

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatarUrl?: string;
}

export interface Item {
  id: string;
  batchId: string;
  title: string;
  description: string;
  imageUrl?: string;
  status: ItemStatus;
  createdAt: string;
}

export interface Batch {
  id: string;
  qr_token: string;
  ownerId: string;
  ownerName: string;
  title: string;
  description: string;
  status: ItemStatus;
  createdAt: string;
  items: Item[];
}

export interface Notification {
  id: string;
  title: string;
  message: string;
  timestamp: string;
  read: boolean;
  type: "deposit" | "retrieval" | "system";
}
