import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider } from './theme/ThemeProvider';
import { BookingPage } from './pages/BookingPage';
import { BookingWizardPage } from './pages/BookingWizardPage';
import { AdminDashboard } from './pages/admin/AdminDashboard';
import { HospitalForm } from './pages/admin/HospitalForm';
import { DoctorManager } from './pages/admin/DoctorManager';
import { AppointmentsCalendar } from './pages/admin/AppointmentsCalendar';
import './index.css';
function App() {
  return <Router>
      <Routes>
        {/* Admin Routes */}
        <Route path="/admin" element={<AdminDashboard />} />
        <Route path="/admin/hospitals/new" element={<HospitalForm />} />
        <Route path="/admin/hospitals/:id/edit" element={<HospitalForm />} />
        <Route path="/admin/hospitals/:id/doctors" element={<DoctorManager />} />
        <Route path="/admin/appointments" element={<AppointmentsCalendar />} />

        {/* Dynamic Tenant Routes */}
        <Route path="/:hospitalSlug" element={<ThemeProvider>
            <BookingPage />
          </ThemeProvider>} />
        <Route path="/:hospitalSlug/book/:doctorId" element={<ThemeProvider>
            <BookingWizardPage />
          </ThemeProvider>} />

        {/* Default Redirect */}
        <Route path="*" element={<Navigate to="/admin" replace />} />
      </Routes>
    </Router>;
}
export default App;