import React from 'react';
import { NavLink, useLocation, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
  CalendarDays,
  Droplet,
  Truck,
  MapPin,
  FileText,
  Users,
  AlertTriangle,
  LogOut,
  Activity,
  Database,
  ShieldCheck,
  Stethoscope
} from 'lucide-react';
import { useApp } from '../context/AppContext';

export const Sidebar = () => {
  const { currentUser, userRole, logout, switchUser, bloodRequests, ambulanceRequests } = useApp();
  const navigate = useNavigate();
  const location = useLocation();

  const activeRole = currentUser?.role || userRole || 'patient';
  const isAdmin = activeRole === 'admin';
  const isDoctor = activeRole === 'doctor' || activeRole === 'staff';

  const myDoctorId = currentUser?.doctorId || 'DOC-01';
  const pendingBloodCount = bloodRequests.filter(
    r => (isDoctor ? r.doctorId === myDoctorId : true) && r.status === 'Submitted'
  ).length;

  const activeAmbulanceCount = ambulanceRequests.filter(r => r.status !== 'Completed').length;

  const patientNavItems = [
    { label: 'Dashboard', path: '/patient', icon: LayoutDashboard },
    { label: 'Appointments', path: '/patient/appointments', icon: CalendarDays },
    { label: 'Blood Request', path: '/patient/blood-request', icon: Droplet },
    { label: 'Ambulance Request', path: '/patient/ambulance', icon: Truck, alertBadge: activeAmbulanceCount > 0 },
    { label: 'Healthcare Map', path: '/patient/map', icon: MapPin },
    { label: 'Documents', path: '/patient/documents', icon: FileText }
  ];

  const doctorNavItems = [
    { label: 'Doctor Dashboard', path: '/staff', icon: LayoutDashboard },
    { label: 'Patients Directory', path: '/staff/patients', icon: Users },
    { label: 'My Appointments', path: '/staff/appointments', icon: CalendarDays },
    {
      label: 'Emergency Center',
      path: '/staff/emergency',
      icon: AlertTriangle,
      badge: pendingBloodCount
    },
    { label: 'Facilities Map', path: '/staff/map', icon: MapPin }
  ];

  const adminNavItems = [
    { label: 'Admin Dashboard', path: '/admin', icon: LayoutDashboard },
    { label: 'All Appointments', path: '/admin/appointments', icon: CalendarDays },
    { label: 'All Patients', path: '/admin/patients', icon: Users },
    {
      label: 'Emergency Operations',
      path: '/admin/emergency',
      icon: AlertTriangle,
      badge: bloodRequests.filter(r => r.status === 'Submitted').length
    },
    { label: 'User Database', path: '/admin/users', icon: Database },
    { label: 'Facilities Map', path: '/admin/map', icon: MapPin }
  ];

  const currentNavItems = isAdmin
    ? adminNavItems
    : isDoctor
    ? doctorNavItems
    : patientNavItems;

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <>
      {/* Desktop & Tablet Sidebar */}
      <aside className="hidden md:flex flex-col w-64 border-r border-[#E5E5E5] bg-white h-screen sticky top-0 z-30 select-none">
        {/* Brand / Logo Header */}
        <div className="p-4 border-b border-[#E5E5E5] flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-[#0F7A4C] flex items-center justify-center text-white">
              <Activity className="w-5 h-5 stroke-[2]" />
            </div>
            <div>
              <span className="text-sm font-bold text-[#1A1A1A] block leading-tight tracking-tight">
                PulsePoint
              </span>
              <span className="text-[11px] font-medium text-[#5C5C5C] uppercase tracking-wider block">
                Health Platform
              </span>
            </div>
          </div>
          <span
            className={`text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded border ${
              isAdmin
                ? 'bg-amber-50 text-amber-900 border-amber-300'
                : isDoctor
                ? 'bg-[#E6F4EC] text-[#0F7A4C] border-[#C8E6D5]'
                : 'bg-blue-50 text-blue-800 border-blue-200'
            }`}
          >
            {isAdmin ? 'Admin' : isDoctor ? 'Doctor' : 'Patient'}
          </span>
        </div>

        {/* User Role Card */}
        <div className="p-3 mx-3 mt-3 bg-[#F7F7F7] rounded-lg border border-[#E5E5E5] text-xs">
          <div className="flex items-center gap-2 mb-1">
            {isAdmin ? (
              <ShieldCheck className="w-4 h-4 text-amber-700" />
            ) : isDoctor ? (
              <Stethoscope className="w-4 h-4 text-[#0F7A4C]" />
            ) : (
              <Activity className="w-4 h-4 text-blue-700" />
            )}
            <span className="font-semibold text-[#1A1A1A] truncate">{currentUser?.name || 'Active User'}</span>
          </div>
          <div className="text-[11px] text-[#5C5C5C]">
            {isDoctor && <span>{currentUser?.specialization} (ID: {myDoctorId})</span>}
            {isAdmin && <span>System Administrator</span>}
            {!isDoctor && !isAdmin && <span>MRN: {currentUser?.patientId || 'PT-89412'} • {currentUser?.bloodGroup || 'O+'}</span>}
          </div>
        </div>

        {/* Navigation links */}
        <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
          <div className="px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider text-[#5C5C5C]">
            {isAdmin ? 'Hospital Operations' : isDoctor ? 'Physician Caseload' : 'Patient Portal'}
          </div>

          {currentNavItems.map(item => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;

            return (
              <NavLink
                key={item.path}
                to={item.path}
                className={`flex items-center justify-between px-3 py-2 rounded-lg text-xs font-medium transition-colors ${
                  isActive
                    ? 'bg-[#E6F4EC] text-[#0F7A4C] font-semibold border border-[#C8E6D5]'
                    : 'text-[#5C5C5C] hover:text-[#1A1A1A] hover:bg-[#F7F7F7] border border-transparent'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <Icon className={`w-4 h-4 ${isActive ? 'text-[#0F7A4C]' : 'text-[#5C5C5C]'}`} />
                  <span>{item.label}</span>
                </div>
                {item.badge > 0 && (
                  <span className="w-5 h-5 rounded-full bg-[#C4302B] text-white text-[10px] font-bold flex items-center justify-center">
                    {item.badge}
                  </span>
                )}
                {item.alertBadge && (
                  <span className="w-2 h-2 rounded-full bg-[#C4302B] animate-pulse" />
                )}
              </NavLink>
            );
          })}
        </nav>

        {/* Quick Portal Switcher & Logout */}
        <div className="p-3 border-t border-[#E5E5E5] space-y-2 bg-[#F7F7F7]">
          <div className="text-[10px] uppercase font-bold text-[#5C5C5C] tracking-wider px-1">
            Demo Portal Switcher:
          </div>
          <div className="grid grid-cols-3 gap-1">
            <button
              onClick={() => {
                switchUser('patient');
                navigate('/patient');
              }}
              className={`p-1 text-[11px] font-semibold rounded border text-center transition-colors ${
                !isDoctor && !isAdmin
                  ? 'bg-[#0F7A4C] text-white border-[#0F7A4C]'
                  : 'bg-white text-[#1A1A1A] border-[#E5E5E5] hover:bg-neutral-100'
              }`}
            >
              Patient
            </button>
            <button
              onClick={() => {
                switchUser('doctor', {
                  id: 'USR-DOC-01',
                  name: 'Dr. Sarah Jenkins, MD',
                  doctorId: 'DOC-01',
                  specialization: 'Cardiology',
                  hospital: 'Metro General Hospital'
                });
                navigate('/staff');
              }}
              className={`p-1 text-[11px] font-semibold rounded border text-center transition-colors ${
                isDoctor && myDoctorId === 'DOC-01'
                  ? 'bg-[#0F7A4C] text-white border-[#0F7A4C]'
                  : 'bg-white text-[#1A1A1A] border-[#E5E5E5] hover:bg-neutral-100'
              }`}
            >
              Dr. Sarah
            </button>
            <button
              onClick={() => {
                switchUser('admin');
                navigate('/admin');
              }}
              className={`p-1 text-[11px] font-semibold rounded border text-center transition-colors ${
                isAdmin
                  ? 'bg-[#0F7A4C] text-white border-[#0F7A4C]'
                  : 'bg-white text-[#1A1A1A] border-[#E5E5E5] hover:bg-neutral-100'
              }`}
            >
              Admin
            </button>
          </div>

          <button
            onClick={handleLogout}
            className="w-full flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-[#C4302B] hover:bg-[#FDE8E8] border border-[#F8B4B4] transition-colors"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Sign Out Session</span>
          </button>
        </div>
      </aside>

      {/* Mobile Bottom Navigation Bar */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white border-t border-[#E5E5E5] flex items-center justify-around py-2 px-1">
        {currentNavItems.slice(0, 5).map(item => {
          const Icon = item.icon;
          const isActive = location.pathname === item.path;

          return (
            <NavLink
              key={item.path}
              to={item.path}
              className={`flex flex-col items-center py-1 px-2 rounded text-[10px] font-medium ${
                isActive ? 'text-[#0F7A4C]' : 'text-[#5C5C5C]'
              }`}
            >
              <Icon className="w-5 h-5 mb-0.5" />
              <span>{item.label.split(' ')[0]}</span>
            </NavLink>
          );
        })}
      </div>
    </>
  );
};
