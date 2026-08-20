import {
  useMutation,
  useQuery,
  useQueryClient,
} from '@tanstack/react-query';
import { Link, Route, Routes, useParams } from 'react-router-dom';
import type { AppointmentApi, CreateAppointment } from './api/client';
import {
  createAppointment,
  getAppointmentById,
  getAppointments,
} from './api/client';
import { useUIStore } from './store/uiStore';

function AppointmentsPage() {
  const queryClient = useQueryClient();
  const search = useUIStore((state) => state.search);
  const setSearch = useUIStore((state) => state.setSearch);
  const darkMode = useUIStore((state) => state.darkMode);
  const toggleDarkMode = useUIStore((state) => state.toggleDarkMode);

  const {
    data: appointments = [],
    isLoading,
    error,
  } = useQuery<AppointmentApi[]>({
    queryKey: ['appointments'],
    queryFn: getAppointments,
  });

  const mutation = useMutation({
    mutationFn: createAppointment,
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: ['appointments'],
      });
    },
  });

  const filteredAppointments = appointments.filter((appointment) =>
    appointment.patientName.toLowerCase().includes(search.toLowerCase()),
  );

  const handleCreate = () => {
    const newAppointment: CreateAppointment = {
      patientName: 'Jane Doe',
      appointmentDate: '2026-08-21',
    };

    mutation.mutate(newAppointment);
  };

  if (isLoading) {
    return <div>Loading appointments...</div>;
  }

  if (error) {
    return <div>Error loading appointments</div>;
  }

  return (
    <div style={{ padding: '2rem' }}>
      <h1>Appointments</h1>

      <button type="button" onClick={toggleDarkMode}>
        {darkMode ? 'Light mode' : 'Dark mode'}
      </button>

      <input
        type="text"
        value={search}
        onChange={(event) => setSearch(event.target.value)}
        placeholder="Search appointment..."
        style={{ display: 'block', margin: '1rem 0', width: '100%' }}
      />

      <button type="button" onClick={handleCreate}>
        Create appointment
      </button>

      <ul>
        {filteredAppointments.map((appointment) => (
          <li key={appointment.id}>
            <Link to={`/appointments/${appointment.id}`}>
              {appointment.patientName} - {appointment.appointmentDate}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

function AppointmentDetailPage() {
  const { id } = useParams<{ id: string }>();

  const appointmentQuery = useQuery({
    queryKey: ['appointment', id],
    queryFn: () => getAppointmentById(Number(id)),
    enabled: Boolean(id),
  });

  if (appointmentQuery.isLoading) {
    return <div>Loading appointment...</div>;
  }

  if (appointmentQuery.error || !appointmentQuery.data) {
    return <div>Appointment not found.</div>;
  }

  return (
    <div style={{ padding: '2rem' }}>
      <Link to="/appointments">Back to appointments</Link>
      <h1>{appointmentQuery.data.patientName}</h1>
      <p>Date: {appointmentQuery.data.appointmentDate}</p>
    </div>
  );
}

function App() {
  return (
    <Routes>
      <Route path="/appointments" element={<AppointmentsPage />} />
      <Route path="/appointments/:id" element={<AppointmentDetailPage />} />
      <Route path="*" element={<Link to="/appointments">Go to appointments</Link>} />
    </Routes>
  );
}

export default App;
