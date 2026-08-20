const API_URL = "http://localhost:3001";

export interface AppointmentApi {
  id: number;
  patientName: string;
  appointmentDate: string;
}

export type CreateAppointment = Omit<AppointmentApi, "id">;

export async function getAppointments(): Promise<AppointmentApi[]> {
  const response = await fetch(`${API_URL}/appointments`);

  if (!response.ok) {
    throw new Error("Failed to fetch appointments");
  }

  return response.json() as Promise<AppointmentApi[]>;
}

export async function getAppointmentById(id: number): Promise<AppointmentApi> {
  const response = await fetch(`${API_URL}/appointments/${id}`);

  if (!response.ok) {
    throw new Error(`Failed to fetch appointment ${id}`);
  }

  return response.json() as Promise<AppointmentApi>;
}

export async function createAppointment(input: CreateAppointment): Promise<AppointmentApi> {
  const response = await fetch(`${API_URL}/appointments`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(input),
  });

  if (!response.ok) {
    throw new Error('Failed to create appointment');
  }

  return response.json() as Promise<AppointmentApi>;
}