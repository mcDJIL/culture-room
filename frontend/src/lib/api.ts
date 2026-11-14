export const TOKEN_KEY = "ruang-budaya-token";
export const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000/api";

const GENERIC_ERROR = "Permintaan belum berhasil. Silakan coba lagi.";
const NETWORK_ERROR = "Tidak dapat terhubung ke server. Periksa koneksi Anda lalu coba lagi.";

export class ApiError extends Error {
  status: number;

  constructor(status: number, message: string) {
    super(message);
    this.name = "ApiError";
    this.status = status;
  }
}

export function getToken() {
  if (typeof window === "undefined") return null;
  return window.localStorage.getItem(TOKEN_KEY);
}

type RequestOptions = {
  method?: string;
  body?: unknown;
  token?: string | null;
  signal?: AbortSignal;
};

export async function apiRequest(path: string, options: RequestOptions = {}) {
  const headers: Record<string, string> = {};
  if (options.body !== undefined) headers["Content-Type"] = "application/json";

  const token = options.token === undefined ? getToken() : options.token;
  if (token) headers.Authorization = `Bearer ${token}`;

  let response: Response;
  try {
    response = await fetch(`${API_URL}${path}`, {
      body: options.body === undefined ? undefined : JSON.stringify(options.body),
      cache: "no-store",
      headers,
      method: options.method ?? "GET",
      signal: options.signal,
    });
  } catch (error) {
    if (error instanceof DOMException && error.name === "AbortError") throw error;
    throw new ApiError(0, NETWORK_ERROR);
  }

  if (!response.ok) {
    const data: unknown = await response.json().catch(() => null);
    const message =
      data && typeof data === "object" && "error" in data && typeof data.error === "string"
        ? data.error
        : GENERIC_ERROR;
    throw new ApiError(response.status, message);
  }

  return response;
}

export async function api<T>(path: string, options: RequestOptions = {}) {
  const response = await apiRequest(path, options);
  if (response.status === 204) return undefined as T;
  return (await response.json()) as T;
}

export type Discipline = {
  id: string;
  name: string;
  note: string;
  visual: string;
  credit: string;
  followed: boolean;
};

export type Post = {
  id: number;
  author: string;
  discipline: string;
  location: string;
  type: string;
  body: string;
  image?: string | null;
  imageAlt?: string | null;
  imageCredit?: string | null;
  tags: string[];
  isOwn: boolean;
  liked: boolean;
  saved: boolean;
};

export type PostComment = {
  id: string;
  body: string;
  createdAt: string;
  author: string;
};

export type NetworkProfile = {
  id: string;
  name: string;
  headline: string;
  location: string;
  disciplines: string[];
  banner: string;
  credit: string;
  connected: boolean;
};

export type Organization = {
  id: string;
  name: string;
  type: string;
  location: string;
  description: string;
  disciplines: string[];
  accepting: boolean;
  banner: string;
  credit: string;
  followed: boolean;
};

export type Opportunity = {
  id: string;
  title: string;
  detail: string;
};

export type Workshop = {
  id: string;
  cluster: string;
  title: string;
  format: string;
  description: string;
};

export type Slot = {
  id: string;
  date: string;
  time: string;
  status: "available" | "booked";
};

export type Listing = {
  id: string;
  kind: "service" | "product";
  title: string;
  discipline: string;
  location: string;
  description: string;
  price: number;
  unit: string;
  stock?: number | null;
  slots?: Slot[];
  image: string;
  credit: string;
};

export type Collaboration = {
  id: string;
  field: string;
  title: string;
  need: string;
  joined: boolean;
};

export type SearchResult = {
  type: string;
  id: string;
  title: string;
  view: "jejaring" | "jasa" | "workshop" | "kolaborasi";
};

export type AuthUser = {
  id: string;
  name: string;
  email: string;
  headline: string;
  location: string | null;
  discipline: string | null;
};
