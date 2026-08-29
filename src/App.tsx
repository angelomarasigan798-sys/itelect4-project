import {
  useMutation,
  useQuery,
  useQueryClient,
} from '@tanstack/react-query';
import { zodResolver } from '@hookform/resolvers/zod';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { Link, Navigate, Route, Routes, useNavigate, useParams } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import type { AppointmentApi } from './api/client';
import {
  createAppointment,
  deleteAppointment,
  getAppointmentById,
  getAppointments,
  updateAppointment,
} from './api/client';
import { appointmentSchema, type AppointmentFormValues } from './schemas/appointmentSchema';
import { useUIStore } from './store/uiStore';
import './App.css';

const VALID_USERNAME = '1234';
const VALID_PASSWORD = 'admin';

function LoginPage({ onLogin }: { onLogin: (username: string, password: string) => boolean }) {
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (onLogin(username.trim(), password.trim())) {
      setError('');
      navigate('/appointments', { replace: true });
      return;
    }

    setError('Invalid username or password. Please try again.');
  };

  return (
    <div className="login-page">
      <div className="login-card">
        <p className="eyebrow">Careline clinic</p>
        <h1>Login</h1>
        <p className="login-subtitle">Sign in to access appointments.</p>

        <Link className="console-link" to="/lecture-console">
          Open Session 8 lecture console
        </Link>

        <form className="login-form" onSubmit={handleSubmit}>
          <div>
            <Label htmlFor="username">Username</Label>
            <Input
              id="username"
              type="text"
              value={username}
              onChange={(event) => setUsername(event.target.value)}
              placeholder="Enter your username"
              autoComplete="username"
            />
          </div>

          <div>
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              placeholder="Enter your password"
              autoComplete="current-password"
            />
          </div>

          {error && <p className="login-error">{error}</p>}

          <Button className="primary-button login-button" type="submit">
            Sign in
          </Button>
        </form>
      </div>
    </div>
  );
}

function LectureConsolePage() {
  return (
    <div className="lecture-console-shell">
      <header className="topbar">
        <Link className="brand" to="/appointments">
          <span className="brand-mark">+</span>
          <span>Careline</span>
        </Link>
        <div className="topbar-actions">
          <Link className="console-link topbar-console-link" to="/appointments">
            Back to appointments
          </Link>
        </div>
      </header>
      <iframe
        title="ITELECT4 Session 8 Console"
        src="/lecture-console.html"
        className="lecture-console-iframe"
      />
    </div>
  );
}

function AppointmentsPage() {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [appointmentToDelete, setAppointmentToDelete] = useState<AppointmentApi | null>(null);
  const [appointmentToEdit, setAppointmentToEdit] = useState<AppointmentApi | null>(null);
  const queryClient = useQueryClient();
  const search = useUIStore((state) => state.search);
  const createForm = useForm<AppointmentFormValues>({
    resolver: zodResolver(appointmentSchema),
    defaultValues: {
      patientName: '',
      appointmentDate: '2026-08-21',
      appointmentTime: '09:00',
      appointmentType: 'General consultation',
      notes: '',
    },
  });
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = createForm;
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

  const completeMutation = useMutation({
    mutationFn: ({ id, appointment }: { id: string; appointment: AppointmentApi }) => updateAppointment(id, { ...appointment, status: 'done' }),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ['appointments'] });
    },
  });

  const editMutation = useMutation({
    mutationFn: ({ id, appointment }: { id: string; appointment: Partial<AppointmentApi> }) => updateAppointment(id, appointment),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ['appointments'] });
      setAppointmentToEdit(null);
    },
  });

  const upcomingAppointments = appointments.filter((appointment) => appointment.status !== 'done');
  const completedAppointments = appointments.filter((appointment) => appointment.status === 'done');
  const filteredAppointments = upcomingAppointments.filter((appointment) =>
    appointment.patientName.toLowerCase().includes(search.toLowerCase()),
  );

  const handleCreate = (values: AppointmentFormValues) => {
    mutation.mutate(
      {
        ...values,
        notes: values.notes ?? '',
        status: 'upcoming',
      },
      {
        onSuccess: () => {
          reset();
          setIsFormOpen(false);
        },
      },
    );
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
        <div className="topbar-actions">
          <Link className="console-link topbar-console-link" to="/lecture-console">
            Session 8 Console
          </Link>
          <button className="theme-button" type="button" onClick={toggleDarkMode}>
            <span className="theme-icon" aria-hidden="true">{darkMode ? '○' : '◐'}</span>
            {darkMode ? 'Light mode' : 'Dark mode'}
          </button>
          <button
            className="logout-button"
            type="button"
            onClick={() => {
              localStorage.removeItem('careline-auth');
              window.location.href = '/';
            }}
          >
            Log out
          </button>
        </div>
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
                  <button className="status-button" type="button" onClick={(event) => { event.preventDefault(); event.stopPropagation(); completeMutation.mutate({ id: appointment.id, appointment }); }}>
                    {completeMutation.isPending ? 'Saving...' : 'Done'}
                  </button>
                  <button className="delete-button" type="button" onClick={(event) => { event.preventDefault(); event.stopPropagation(); setAppointmentToDelete(appointment); }} aria-label={`Delete appointment for ${appointment.patientName}`}>
                    <span aria-hidden="true">x</span> Delete
                  </button>
                  <span className="row-arrow" aria-hidden="true">-&gt;</span>
                </span>
              </Link>
            ))
          )}
        </section>

        {completedAppointments.length > 0 && (
          <section className="completed-section" aria-label="Completed appointments">
            <div className="completed-header">
              <h2>Completed appointments</h2>
              <span className="appointment-count">{completedAppointments.length} finished</span>
            </div>

            <div className="completed-list">
              {completedAppointments.map((appointment) => (
                <article className="completed-card" key={appointment.id}>
                  <div className="completed-topline">
                    <strong>{appointment.patientName}</strong>
                    <span className="status-tag">Done</span>
                  </div>
                  <p className="completed-meta">{formatDate(appointment.appointmentDate)} • {appointment.appointmentType || 'General consultation'}</p>
                  <p className="completed-notes"><strong>Notes:</strong> {appointment.notes || 'No notes were provided for this appointment.'}</p>
                  <div className="completed-actions">
                    <button className="edit-button" type="button" onClick={() => setAppointmentToEdit(appointment)}>
                      Edit
                    </button>
                  </div>
                </article>
              ))}
            </div>
          </section>
        )}
      </main>
      <TanStackFooter />
      {isFormOpen && (
        <div className="modal-backdrop" role="presentation" onMouseDown={(event) => event.target === event.currentTarget && setIsFormOpen(false)}>
          <section className="appointment-modal" role="dialog" aria-modal="true" aria-labelledby="appointment-form-title">
            <div className="modal-header">
              <div><p className="eyebrow">Careline clinic</p><h2 id="appointment-form-title">New appointment</h2></div>
              <button className="close-button" type="button" onClick={() => setIsFormOpen(false)} aria-label="Close form">x</button>
            </div>
            <p className="modal-copy">Enter the patient details and choose a convenient visit schedule.</p>
            <form className="appointment-form" onSubmit={handleSubmit(handleCreate)}>
              <div>
                <Label htmlFor="patientName">Patient name</Label>
                <Input id="patientName" {...register('patientName')} aria-invalid={Boolean(errors.patientName)} placeholder="e.g. Maria Santos" />
                {errors.patientName && <p className="login-error">{errors.patientName.message}</p>}
              </div>
              <div className="form-grid">
                <div>
                  <Label htmlFor="appointmentDate">Date</Label>
                  <Input id="appointmentDate" type="date" {...register('appointmentDate')} aria-invalid={Boolean(errors.appointmentDate)} />
                  {errors.appointmentDate && <p className="login-error">{errors.appointmentDate.message}</p>}
                </div>
                <div>
                  <Label htmlFor="appointmentTime">Time</Label>
                  <Input id="appointmentTime" type="time" {...register('appointmentTime')} aria-invalid={Boolean(errors.appointmentTime)} />
                  {errors.appointmentTime && <p className="login-error">{errors.appointmentTime.message}</p>}
                </div>
              </div>
              <div>
                <Label htmlFor="appointmentType">Appointment type</Label>
                <select id="appointmentType" {...register('appointmentType')} aria-invalid={Boolean(errors.appointmentType)}>
                  <option value="General consultation">General consultation</option>
                  <option value="Follow-up visit">Follow-up visit</option>
                  <option value="Medical check-up">Medical check-up</option>
                  <option value="Laboratory request">Laboratory request</option>
                </select>
                {errors.appointmentType && <p className="login-error">{errors.appointmentType.message}</p>}
              </div>
              <div>
                <Label htmlFor="notes">Notes <span className="optional">(optional)</span></Label>
                <textarea id="notes" rows={3} {...register('notes')} placeholder="Add a short note for the clinic" />
                {errors.notes && <p className="login-error">{errors.notes.message}</p>}
              </div>
              {mutation.isError && <p className="form-error">We could not save this appointment. Please try again.</p>}
              <div className="form-actions"><button className="secondary-button" type="button" onClick={() => setIsFormOpen(false)}>Cancel</button><Button className="primary-button" type="submit" disabled={mutation.isPending}>{mutation.isPending ? 'Saving...' : 'Save appointment'}</Button></div>
            </form>
          </section>
        </div>
      )}
      {appointmentToEdit && (
        <div className="modal-backdrop" role="presentation" onMouseDown={(event) => event.target === event.currentTarget && setAppointmentToEdit(null)}>
          <section className="appointment-modal" role="dialog" aria-modal="true" aria-labelledby="edit-appointment-title">
            <div className="modal-header">
              <div><p className="eyebrow">Careline clinic</p><h2 id="edit-appointment-title">Edit appointment</h2></div>
              <button className="close-button" type="button" onClick={() => setAppointmentToEdit(null)} aria-label="Close edit form">x</button>
            </div>
            <p className="modal-copy">Update the patient's appointment details and notes.</p>
            <form className="appointment-form" onSubmit={(event) => {
              event.preventDefault();
              editMutation.mutate({
                id: appointmentToEdit.id,
                appointment: {
                  patientName: appointmentToEdit.patientName,
                  appointmentDate: appointmentToEdit.appointmentDate,
                  appointmentTime: appointmentToEdit.appointmentTime,
                  appointmentType: appointmentToEdit.appointmentType,
                  notes: appointmentToEdit.notes,
                  status: appointmentToEdit.status,
                },
              });
            }}>
              <label>Patient name<input required value={appointmentToEdit.patientName} onChange={(event) => setAppointmentToEdit({ ...appointmentToEdit, patientName: event.target.value })} /></label>
              <div className="form-grid">
                <label>Date<input required type="date" value={appointmentToEdit.appointmentDate} onChange={(event) => setAppointmentToEdit({ ...appointmentToEdit, appointmentDate: event.target.value })} /></label>
                <label>Time<input required type="time" value={appointmentToEdit.appointmentTime || '09:00'} onChange={(event) => setAppointmentToEdit({ ...appointmentToEdit, appointmentTime: event.target.value })} /></label>
              </div>
              <label>Appointment type<select value={appointmentToEdit.appointmentType || 'General consultation'} onChange={(event) => setAppointmentToEdit({ ...appointmentToEdit, appointmentType: event.target.value })}><option>General consultation</option><option>Follow-up visit</option><option>Medical check-up</option><option>Laboratory request</option></select></label>
              <label>Notes <span className="optional">(optional)</span><textarea rows={3} value={appointmentToEdit.notes || ''} onChange={(event) => setAppointmentToEdit({ ...appointmentToEdit, notes: event.target.value })} placeholder="Add a short note for the clinic" /></label>
              {editMutation.isError && <p className="form-error">Unable to update this appointment. Please try again.</p>}
              <div className="form-actions"><button className="secondary-button" type="button" onClick={() => setAppointmentToEdit(null)}>Cancel</button><button className="primary-button" type="submit" disabled={editMutation.isPending}>{editMutation.isPending ? 'Saving...' : 'Save changes'}</button></div>
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

function TanStackFooter() {
  return (
    <footer className="site-footer">
      <a className="tanstack-badge" href="https://tanstack.com/query" target="_blank" rel="noreferrer" aria-label="Visit TanStack Query website">
        <span className="tanstack-icon">T</span>
        <span>TanStack Query</span>
      </a>
    </footer>
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
  const queryClient = useQueryClient();
  const [isEditing, setIsEditing] = useState(false);
  const [form, setForm] = useState({
    patientName: '',
    appointmentDate: '2026-08-21',
    appointmentTime: '09:00',
    appointmentType: 'General consultation',
    notes: '',
  });

  const appointmentQuery = useQuery({
    queryKey: ['appointment', id],
    queryFn: () => getAppointmentById(id as string),
    enabled: Boolean(id),
  });

  const editMutation = useMutation({
    mutationFn: (updated: Partial<AppointmentApi>) => updateAppointment(id as string, updated),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ['appointment', id] });
      await queryClient.invalidateQueries({ queryKey: ['appointments'] });
      setIsEditing(false);
    },
  });

  useEffect(() => {
    if (appointmentQuery.data) {
      setForm({
        patientName: appointmentQuery.data.patientName,
        appointmentDate: appointmentQuery.data.appointmentDate,
        appointmentTime: appointmentQuery.data.appointmentTime || '09:00',
        appointmentType: appointmentQuery.data.appointmentType || 'General consultation',
        notes: appointmentQuery.data.notes || '',
      });
    }
  }, [appointmentQuery.data]);

  if (appointmentQuery.isLoading) {
    return <div>Loading appointment...</div>;
  }

  if (appointmentQuery.error || !appointmentQuery.data) {
    return <div>Appointment not found.</div>;
  }

  const handleSave = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    editMutation.mutate({
      patientName: form.patientName,
      appointmentDate: form.appointmentDate,
      appointmentTime: form.appointmentTime,
      appointmentType: form.appointmentType,
      notes: form.notes,
      status: appointmentQuery.data.status,
    });
  };

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
          <div className="detail-field"><span>Visit type</span><strong>{appointmentQuery.data.appointmentType || 'General consultation'}</strong></div>
          <div className="detail-field"><span>Notes</span><strong>{appointmentQuery.data.notes || 'No notes were provided.'}</strong></div>

          <div className="detail-actions">
            <button className="edit-button" type="button" onClick={() => setIsEditing((current) => !current)}>
              {isEditing ? 'Cancel edit' : 'Edit patient'}
            </button>
          </div>

          {isEditing && (
            <form className="appointment-form detail-edit-form" onSubmit={handleSave}>
              <label>Patient name<input required value={form.patientName} onChange={(event) => setForm({ ...form, patientName: event.target.value })} /></label>
              <div className="form-grid">
                <label>Date<input required type="date" value={form.appointmentDate} onChange={(event) => setForm({ ...form, appointmentDate: event.target.value })} /></label>
                <label>Time<input required type="time" value={form.appointmentTime} onChange={(event) => setForm({ ...form, appointmentTime: event.target.value })} /></label>
              </div>
              <label>Appointment type<select value={form.appointmentType} onChange={(event) => setForm({ ...form, appointmentType: event.target.value })}><option>General consultation</option><option>Follow-up visit</option><option>Medical check-up</option><option>Laboratory request</option></select></label>
              <label>Notes <span className="optional">(optional)</span><textarea rows={3} value={form.notes} onChange={(event) => setForm({ ...form, notes: event.target.value })} placeholder="Add a short note for the clinic" /></label>
              <div className="form-actions"><button className="primary-button" type="submit" disabled={editMutation.isPending}>{editMutation.isPending ? 'Saving...' : 'Save changes'}</button></div>
            </form>
          )}
        </div>
      </main>
      <TanStackFooter />
    </div>
  );
}

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    if (typeof window === 'undefined') {
      return false;
    }

    return localStorage.getItem('careline-auth') === 'true';
  });

  useEffect(() => {
    localStorage.setItem('careline-auth', String(isAuthenticated));
  }, [isAuthenticated]);

  const handleLogin = (username: string, password: string) => {
    if (username === VALID_USERNAME && password === VALID_PASSWORD) {
      setIsAuthenticated(true);
      return true;
    }

    return false;
  };

  if (!isAuthenticated) {
    return (
      <Routes>
        <Route path="/" element={<LoginPage onLogin={handleLogin} />} />
        <Route path="/lecture-console" element={<LectureConsolePage />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    );
  }

  return (
    <Routes>
      <Route path="/" element={<LoginPage onLogin={handleLogin} />} />
      <Route path="/lecture-console" element={<LectureConsolePage />} />
      <Route path="/appointments" element={<AppointmentsPage />} />
      <Route path="/appointments/:id" element={<AppointmentDetailPage />} />
      <Route path="*" element={<Navigate to="/appointments" replace />} />
    </Routes>
  );
}

export default App;
