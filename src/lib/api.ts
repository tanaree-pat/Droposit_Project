import type { Batch, Item } from "./types";

const BASE =
  typeof window !== "undefined"
    ? `http://${window.location.hostname}:8000`
    : (process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000");

function getToken(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem("drp_token");
}

async function requestForm<T>(path: string, form: FormData): Promise<T> {
  const token = getToken();
  const res = await fetch(`${BASE}${path}`, {
    method: "POST",
    headers: token ? { Authorization: `Bearer ${token}` } : {},
    body: form,
  });
  if (res.status === 401) {
    if (typeof window !== "undefined") window.dispatchEvent(new Event("drp:unauthorized"));
    throw new Error("Unauthorized");
  }
  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new Error((body as { error?: string }).error ?? `HTTP ${res.status}`);
  }
  return res.json() as Promise<T>;
}

async function request<T>(path: string, init: RequestInit = {}): Promise<T> {
  const token = getToken();
  const res = await fetch(`${BASE}${path}`, {
    ...init,
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...(init.headers ?? {}),
    },
  });

  if (res.status === 401) {
    if (typeof window !== "undefined") window.dispatchEvent(new Event("drp:unauthorized"));
    throw new Error("Unauthorized");
  }

  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new Error((body as { error?: string }).error ?? `HTTP ${res.status}`);
  }

  return res.json() as Promise<T>;
}

// ── raw backend shapes ───────────────────────────────────────────────────────

interface RawItem {
  id: number;
  name: string;
  description: string | null;
  image_url: string | null;
  created_at: string;
}

interface RawBatch {
  id: number;
  qr_token: string;
  name: string;
  description: string | null;
  status: string;
  created_at: string;
  items?: RawItem[];
}

interface RawAdminBatch {
  id: number;
  name: string;
  status: string;
  owner: string;
  item_count: number;
  created_at: string | null;
  deposited_at: string | null;
  claimed_at: string | null;
}

interface RawAdminBatchDetail {
  id: number;
  name: string;
  description: string | null;
  status: string;
  owner: { id: number; full_name: string; email: string };
  items: RawItem[];
  deposited_at: string | null;
  claimed_at: string | null;
}

interface RawScanResolve {
  batch_id: number;
  batch_name: string;
  status: string;
  owner: { id: number; full_name: string; email: string };
  items: RawItem[];
}

// ── mappers ──────────────────────────────────────────────────────────────────

function mapItem(raw: RawItem, batchId: number, batchStatus: string): Item {
  return {
    id: String(raw.id),
    batchId: String(batchId),
    title: raw.name,
    description: raw.description ?? "",
    imageUrl: raw.image_url
      ? raw.image_url.startsWith("http") ? raw.image_url : `${BASE}${raw.image_url}`
      : undefined,
    status: batchStatus as Item["status"],
    createdAt: raw.created_at,
  };
}

function mapBatch(raw: RawBatch, ownerName = ""): Batch {
  return {
    id: String(raw.id),
    qr_token: raw.qr_token,
    ownerId: "",
    ownerName,
    title: raw.name,
    description: raw.description ?? "",
    status: raw.status as Batch["status"],
    createdAt: raw.created_at,
    items: (raw.items ?? []).map((i) => mapItem(i, raw.id, raw.status)),
  };
}

function mapAdminBatch(raw: RawAdminBatch): Batch {
  const phantom: Item = {
    id: "", batchId: String(raw.id), title: "", description: "",
    status: raw.status as Item["status"], createdAt: "",
  };
  return {
    id: String(raw.id),
    qr_token: "",
    ownerId: "",
    ownerName: raw.owner,
    title: raw.name,
    description: "",
    status: raw.status as Batch["status"],
    createdAt: raw.created_at ?? raw.deposited_at ?? raw.claimed_at ?? new Date().toISOString(),
    items: Array<Item>(raw.item_count).fill(phantom),
  };
}

function mapAdminBatchDetail(raw: RawAdminBatchDetail): Batch {
  return {
    id: String(raw.id),
    qr_token: "",
    ownerId: String(raw.owner.id),
    ownerName: raw.owner.full_name,
    title: raw.name,
    description: raw.description ?? "",
    status: raw.status as Batch["status"],
    createdAt: raw.deposited_at ?? raw.claimed_at ?? new Date().toISOString(),
    items: raw.items.map((i) => mapItem(i, raw.id, raw.status)),
  };
}

// ── auth ─────────────────────────────────────────────────────────────────────

export interface AuthUser {
  id: string;
  full_name: string;
  email: string;
  role: "depositor" | "staff";
}

export const authApi = {
  register: (data: { full_name: string; email: string; password: string; role?: string }) =>
    request<{ message: string; user_id: number }>("/auth/register", {
      method: "POST",
      body: JSON.stringify(data),
    }),

  login: (data: { email: string; password: string }) =>
    request<{ access_token: string; user: AuthUser }>("/auth/login", {
      method: "POST",
      body: JSON.stringify(data),
    }),
};

// ── batches (depositor) ──────────────────────────────────────────────────────

export const batchesApi = {
  list: () => request<RawBatch[]>("/batches").then((bs) => bs.map((b) => mapBatch(b))),

  get: (id: number) => request<RawBatch>(`/batches/${id}`).then((b) => mapBatch(b)),

  create: (data: { name: string; description?: string }) =>
    request<RawBatch>("/batches", { method: "POST", body: JSON.stringify(data) }).then(mapBatch),

  addItem: (batchId: number, data: { name: string; description?: string; image?: File | null }) => {
    if (data.image) {
      const form = new FormData();
      form.append("name", data.name);
      if (data.description) form.append("description", data.description);
      form.append("image", data.image);
      return requestForm<RawItem>(`/batches/${batchId}/items`, form);
    }
    return request<RawItem>(`/batches/${batchId}/items`, {
      method: "POST",
      body: JSON.stringify({ name: data.name, description: data.description }),
    });
  },

  editItem: (batchId: number, itemId: number, data: { name?: string; description?: string }) =>
    request<RawItem>(`/batches/${batchId}/items/${itemId}`, {
      method: "PATCH",
      body: JSON.stringify(data),
    }),
};

// ── scan (staff) ─────────────────────────────────────────────────────────────

export const scanApi = {
  resolve: (token: string) => request<RawScanResolve>(`/scan/${token}`),

  deposit: (token: string, checkpoint = "Checkpoint A") =>
    request<{ message: string; batch_id: number; status: string }>(`/scan/${token}/deposit`, {
      method: "POST",
      body: JSON.stringify({ checkpoint }),
    }),

  checkout: (token: string, checkpoint = "Checkpoint A") =>
    request<{ message: string; batch_id: number; status: string }>(`/scan/${token}/checkout`, {
      method: "POST",
      body: JSON.stringify({ checkpoint }),
    }),
};

// ── admin (staff) ────────────────────────────────────────────────────────────

export const adminApi = {
  listBatches: (status?: string) =>
    request<RawAdminBatch[]>(`/admin/batches${status ? `?status=${status}` : ""}`).then((bs) =>
      bs.map(mapAdminBatch)
    ),

  getBatch: (id: number) =>
    request<RawAdminBatchDetail>(`/admin/batches/${id}`).then(mapAdminBatchDetail),
};
