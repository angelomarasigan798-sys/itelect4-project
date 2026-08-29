import { z } from 'zod';

export const appointmentSchema = z
  .object({
    patientName: z
      .string()
      .trim()
      .min(2, 'Patient name must be at least 2 characters long.')
      .max(80, 'Patient name must be 80 characters or fewer.'),
    appointmentDate: z.string().min(1, 'Please choose an appointment date.'),
    appointmentTime: z.string().min(1, 'Please choose a time for the appointment.'),
    appointmentType: z.string().min(1, 'Please select an appointment type.'),
    notes: z.string().max(250, 'Notes must be 250 characters or fewer.').optional().or(z.literal('')),
  })
  .refine(
    ({ appointmentDate, appointmentTime }) => {
      if (!appointmentDate || !appointmentTime) {
        return false;
      }

      const selectedDateTime = new Date(`${appointmentDate}T${appointmentTime}:00`);
      const now = new Date();

      return selectedDateTime.getTime() > now.getTime();
    },
    {
      message: 'Appointment date and time must be in the future.',
      path: ['appointmentTime'],
    },
  );

export type AppointmentFormValues = z.infer<typeof appointmentSchema>;
