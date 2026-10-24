import { useAuthStore } from "../store/authStore";
import type { AiReview } from "../types";

const API_URL = import.meta.env.VITE_API_URL?.replace(/\/$/, "");

if (!API_URL) {
  throw new Error("VITE_API_URL is missing. Set it in the frontend environment.");
}

export interface AppointmentApi {
  id: string;
  patientName: string;
  appointmentDate: string;
  appointmentTime: string;
  appointmentType: string;
  notes: string;
  status: "upcoming" | "done";
}

export type CreateAppointment = Omit<AppointmentApi, "id">;

export function askAi(input: { prompt: string }): Promise<AiReview> {
  return request("/api/ai", {
    method: "POST",
    body: JSON.stringify(input),
  });
}

interface ApiUser {
  id: string;
  name: string;
  email: string;
}

interface AuthReply {
  token: string;
  user: ApiUser;
}

interface ApiError {
  message?: string;
}

async function request<T>(path: string, init: RequestInit = {}): Promise<T> {
  const token = useAuthStore.getState().token;
  const response = await fetch(`${API_URL}${path}`, {
    ...init,
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...init.headers,
    },
  });

  if (!response.ok) {
    const body = (await response.json().catch(() => null)) as ApiError | null;
    throw new Error(body?.message ?? `Request failed (${response.status})`);
  }

  if (response.status === 204) return undefined as T;
  return response.json() as Promise<T>;
}

export function getAppointments(): Promise<AppointmentApi[]> {
  return request("/api/appointments");
}

export function getAppointmentById(id: string): Promise<AppointmentApi> {
  return request(`/api/appointments/${encodeURIComponent(id)}`);
}

export function createAppointment(input: CreateAppointment): Promise<AppointmentApi> {
  return request("/api/appointments", {
    method: "POST",
    body: JSON.stringify(input),
  });
}

export function updateAppointment(
  id: string,
  input: Partial<AppointmentApi>,
): Promise<AppointmentApi> {
  return request(`/api/appointments/${encodeURIComponent(id)}`, {
    method: "PATCH",
    body: JSON.stringify(input),
  });
}

export function deleteAppointment(id: string): Promise<void> {
  return request(`/api/appointments/${encodeURIComponent(id)}`, {
    method: "DELETE",
  });
}

export function registerUser(input: {
  name: string;
  email: string;
  password: string;
}): Promise<ApiUser> {
  return request("/api/auth/register", {
    method: "POST",
    body: JSON.stringify(input),
  });
}

export function loginUser(input: {
  email: string;
  password: string;
}): Promise<AuthReply> {
  return request("/api/auth/login", {
    method: "POST",
    body: JSON.stringify(input),
  });
}