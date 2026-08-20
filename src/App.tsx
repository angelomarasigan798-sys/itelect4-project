import {
  useMutation,
  useQuery,
  useQueryClient,
} from '@tanstack/react-query';
import { useState } from 'react';
import { Link, Route, Routes, useParams } from 'react-router-dom';
import type { AppointmentApi } from './api/client';
import {
  createAppointment,
  deleteAppointment,
  getAppointmentById,
  getAppointments,
} from './api/client';
import { useUIStore } from './store/uiStore';
import './App.css';

function AppointmentsPage() {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [appointmentToDelete, setAppointmentToDelete] = useState<AppointmentApi | null>(null);
  const [form, setForm] = useState({
    patientName: '',
    appointmentDate: '2026-08-21',
    appointmentTime: '09:00',
    appointmentType: 'General consultation',
    notes: '',
  });
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

  const deleteMutation = useMutation({
    mutationFn: deleteAppointment,
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ['appointments'] });
      setAppointmentToDelete(null);
    },
  });

  const filteredAppointments = appointments.filter((appointment) =>
    appointment.patientName.toLowerCase().includes(search.toLowerCase()),
  );

  const handleCreate = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    mutation.mutate(form, {
      onSuccess: () => {
        setForm({ patientName: '', appointmentDate: '2026-08-21', appointmentTime: '09:00', appointmentType: 'General consultation', notes: '' });
        setIsFormOpen(false);
      },
    });
  };

  if (isLoading) {
    return <div>Loading appointments...</div>;
  }

  if (error) {
    return <div>Error loading appointments</div>;
  }

  return (
    <div className={`app-shell${darkMode ? ' dark' : ''}`}>
      <header className="topbar">
        <Link className="brand" to="/appointments">
          <span className="brand-mark">+</span>
          <span>Careline</span>
        </Link>
        <button className="theme-button" type="button" onClick={toggleDarkMode}>
          <span className="theme-icon" aria-hidden="true">{darkMode ? '○' : '◐'}</span>
          {darkMode ? 'Light mode' : 'Dark mode'}
        </button>
      </header>

      <main className="page-content">
        <section className="page-heading">
          <div>
            <p className="eyebrow">Careline clinic</p>
            <h1>Appointments</h1>
            <p className="subtitle">Keep track of upcoming patient visits.</p>
          </div>
          <button className="primary-button" type="button" onClick={() => setIsFormOpen(true)}>
            <span aria-hidden="true">+</span>
            {mutation.isPending ? 'Creating...' : 'Create appointment'}
          </button>
        </section>

        <section className="toolbar" aria-label="Appointment tools">
          <label className="search-box">
            <span className="search-icon" aria-hidden="true">⌕</span>
            <input
              type="search"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search patients"
              aria-label="Search patients"
            />
          </label>
          <span className="appointment-count">{filteredAppointments.length} appointments</span>
        </section>

        <section className="appointment-list" aria-label="Appointment list">
          {filteredAppointments.length === 0 ? (
            <div className="empty-state">No appointments match your search.</div>
          ) : (
            filteredAppointments.map((appointment) => (
              <Link className="appointment-row" key={appointment.id} to={`/appointments/${appointment.id}`}>
                <span className="avatar">{appointment.patientName.charAt(0)}</span>
                <span className="appointment-info">
                  <strong>{appointment.patientName}</strong>
                  <span>{appointment.appointmentType || 'General consultation'}</span>
                </span>
                <span className="appointment-date">
                  <small>Appointment date</small>
                  <strong>{formatDate(appointment.appointmentDate)}</strong>
                  {appointment.appointmentTime && <small>{formatTime(appointment.appointmentTime)}</small>}
                </span>
                <span className="row-actions">
                  <button className="delete-button" type="button" onClick={(event) => { event.preventDefault(); event.stopPropagation(); setAppointmentToDelete(appointment); }} aria-label={`Delete appointment for ${appointment.patientName}`}>
                    <span aria-hidden="true">x</span> Delete
                  </button>
                  <span className="row-arrow" aria-hidden="true">-&gt;</span>
                </span>
              </Link>
            ))
          )}
        </section>
      </main>
      {isFormOpen && (
        <div className="modal-backdrop" role="presentation" onMouseDown={(event) => event.target === event.currentTarget && setIsFormOpen(false)}>
          <section className="appointment-modal" role="dialog" aria-modal="true" aria-labelledby="appointment-form-title">
            <div className="modal-header">
              <div><p className="eyebrow">Careline clinic</p><h2 id="appointment-form-title">New appointment</h2></div>
              <button className="close-button" type="button" onClick={() => setIsFormOpen(false)} aria-label="Close form">x</button>
            </div>
            <p className="modal-copy">Enter the patient details and choose a convenient visit schedule.</p>
            <form className="appointment-form" onSubmit={handleCreate}>
              <label>Patient name<input required value={form.patientName} onChange={(event) => setForm({ ...form, patientName: event.target.value })} placeholder="e.g. Maria Santos" /></label>
              <div className="form-grid">
                <label>Date<input required type="date" value={form.appointmentDate} onChange={(event) => setForm({ ...form, appointmentDate: event.target.value })} /></label>
                <label>Time<input required type="time" value={form.appointmentTime} onChange={(event) => setForm({ ...form, appointmentTime: event.target.value })} /></label>
              </div>
              <label>Appointment type<select value={form.appointmentType} onChange={(event) => setForm({ ...form, appointmentType: event.target.value })}><option>General consultation</option><option>Follow-up visit</option><option>Medical check-up</option><option>Laboratory request</option></select></label>
              <label>Notes <span className="optional">(optional)</span><textarea rows={3} value={form.notes} onChange={(event) => setForm({ ...form, notes: event.target.value })} placeholder="Add a short note for the clinic" /></label>
              {mutation.isError && <p className="form-error">We could not save this appointment. Please try again.</p>}
              <div className="form-actions"><button className="secondary-button" type="button" onClick={() => setIsFormOpen(false)}>Cancel</button><button className="primary-button" type="submit" disabled={mutation.isPending}>{mutation.isPending ? 'Saving...' : 'Save appointment'}</button></div>
            </form>
          </section>
        </div>
      )}
      {appointmentToDelete && (
        <div className="modal-backdrop" role="presentation">
          <section className="confirm-modal" role="dialog" aria-modal="true" aria-labelledby="delete-title">
            <span className="warning-icon" aria-hidden="true">!</span>
            <p className="eyebrow">Remove appointment</p>
            <h2 id="delete-title">Delete this appointment?</h2>
            <p className="modal-copy">The appointment for <strong>{appointmentToDelete.patientName}</strong> on <strong>{formatDate(appointmentToDelete.appointmentDate)}</strong> will be permanently removed.</p>
            {deleteMutation.isError && <p className="form-error">Unable to delete this appointment. Please try again.</p>}
            <div className="form-actions"><button className="secondary-button" type="button" onClick={() => setAppointmentToDelete(null)}>Keep appointment</button><button className="danger-button" type="button" onClick={() => deleteMutation.mutate(appointmentToDelete.id)} disabled={deleteMutation.isPending}>{deleteMutation.isPending ? 'Deleting...' : 'Delete appointment'}</button></div>
          </section>
        </div>
      )}
    </div>
  );
}

function formatDate(date: string) {
  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  }).format(new Date(`${date}T00:00:00`));
}

function formatTime(time: string) {
  return new Intl.DateTimeFormat('en-US', { hour: 'numeric', minute: '2-digit' }).format(new Date(`2026-01-01T${time}`));
}

function AppointmentDetailPage() {
  const { id } = useParams<{ id: string }>();

  const appointmentQuery = useQuery({
    queryKey: ['appointment', id],
    queryFn: () => getAppointmentById(id as string),
    enabled: Boolean(id),
  });

  if (appointmentQuery.isLoading) {
    return <div>Loading appointment...</div>;
  }

  if (appointmentQuery.error || !appointmentQuery.data) {
    return <div>Appointment not found.</div>;
  }

  return (
    <div className="app-shell">
      <header className="topbar">
        <Link className="brand" to="/appointments"><span className="brand-mark">+</span><span>Careline</span></Link>
      </header>
      <main className="detail-content">
        <Link className="back-link" to="/appointments">&lt;- Back to appointments</Link>
        <div className="detail-card">
          <span className="avatar avatar-large">{appointmentQuery.data.patientName.charAt(0)}</span>
          <p className="eyebrow">Appointment details</p>
          <h1>{appointmentQuery.data.patientName}</h1>
          <div className="detail-field"><span>Date</span><strong>{formatDate(appointmentQuery.data.appointmentDate)}</strong></div>
          <div className="detail-field"><span>Visit type</span><strong>General consultation</strong></div>
        </div>
      </main>
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
