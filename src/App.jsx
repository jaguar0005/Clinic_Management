import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AppProvider } from './context/AppContext';
import { PortalLayout } from './components/PortalLayout';
import { LoginPortal } from './pages/LoginPortal';

// Patient Portal Pages
import { PatientDashboard } from './pages/patient/PatientDashboard';
import { PatientAppointments } from './pages/patient/PatientAppointments';
import { BloodRequest } from './pages/patient/BloodRequest';
import { AmbulanceRequest } from './pages/patient/AmbulanceRequest';
import { HealthcareMapPage } from './pages/patient/HealthcareMapPage';
import { PatientDocuments } from './pages/patient/PatientDocuments';

// Staff (Doctor) Portal Pages
import { StaffDashboard } from './pages/staff/StaffDashboard';
import { StaffPatients } from './pages/staff/StaffPatients';
import { StaffAppointments } from './pages/staff/StaffAppointments';
import { StaffEmergency } from './pages/staff/StaffEmergency';
import { StaffMapPage } from './pages/staff/StaffMapPage';

// Admin Portal Pages
import { AdminDashboard } from './pages/admin/AdminDashboard';
import { AdminAppointments } from './pages/admin/AdminAppointments';
import { AdminPatients } from './pages/admin/AdminPatients';
import { AdminEmergency } from './pages/admin/AdminEmergency';
import { AdminUsers } from './pages/admin/AdminUsers';

function App() {
  return (
    <AppProvider>
      <BrowserRouter>
        <Routes>
          {/* Welcome / Role Authentication */}
          <Route path="/" element={<LoginPortal />} />

          {/* Patient Portal Routes */}
          <Route path="/patient" element={<PortalLayout />}>
            <Route index element={<PatientDashboard />} />
            <Route path="appointments" element={<PatientAppointments />} />
            <Route path="blood-request" element={<BloodRequest />} />
            <Route path="ambulance" element={<AmbulanceRequest />} />
            <Route path="map" element={<HealthcareMapPage />} />
            <Route path="documents" element={<PatientDocuments />} />
          </Route>

          {/* Staff (Doctor) Portal Routes */}
          <Route path="/staff" element={<PortalLayout />}>
            <Route index element={<StaffDashboard />} />
            <Route path="patients" element={<StaffPatients />} />
            <Route path="appointments" element={<StaffAppointments />} />
            <Route path="emergency" element={<StaffEmergency />} />
            <Route path="map" element={<StaffMapPage />} />
          </Route>

          {/* Admin Portal Routes */}
          <Route path="/admin" element={<PortalLayout />}>
            <Route index element={<AdminDashboard />} />
            <Route path="appointments" element={<AdminAppointments />} />
            <Route path="patients" element={<AdminPatients />} />
            <Route path="emergency" element={<AdminEmergency />} />
            <Route path="users" element={<AdminUsers />} />
            <Route path="map" element={<StaffMapPage />} />
          </Route>

          {/* Catch-all Fallback */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </AppProvider>
  );
}

export default App;
