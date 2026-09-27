import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeftRight, UserCheck, Stethoscope, ShieldCheck, LogOut } from 'lucide-react';
import { useApp } from '../context/AppContext';

export const TopBar = () => {
  const { currentUser, userRole, switchUser, logout } = useApp();
  const navigate = useNavigate();

  const activeRole = currentUser?.role || userRole || 'patient';
  const isAdmin = activeRole === 'admin';
  const isDoctor = activeRole === 'doctor' || activeRole === 'staff';

  const handleQuickSwitch = () => {
    if (activeRole === 'patient') {
      // Switch to Doctor
      switchUser('doctor', {
        id: 'USR-DOC-01',
        name: 'Dr. Sarah Jenkins, MD',
        doctorId: 'DOC-01',
        specialization: 'Cardiology',
        hospital: 'Metro General Hospital'
      });
      navigate('/staff');
    } else if (isDoctor) {
      // Switch to Admin
      switchUser('admin');
      navigate('/admin');
    } else {
      // Switch to Patient
      switchUser('patient');
      navigate('/patient');
    }
  };

  return (
    <header className="h-16 border-b border-[#E5E5E5] bg-white sticky top-0 z-20 px-4 md:px-6 flex items-center justify-between">
      {/* Left indicator */}
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-[#0F7A4C] animate-pulse" />
          <span className="text-xs font-semibold text-[#1A1A1A] uppercase tracking-wider">
            {isAdmin
              ? 'Hospital Operations & Admin Hub'
              : isDoctor
              ? `Physician Hub • ${currentUser?.name || 'Doctor'}`
              : 'Patient Care Portal'}
          </span>
        </div>
        <span className="hidden sm:inline-block text-[#E5E5E5]">|</span>
        <span className="hidden sm:inline-block text-xs text-[#5C5C5C]">
          System Status: Operational • Database Synchronized
        </span>
      </div>

      {/* Right controls */}
      <div className="flex items-center gap-3">
        {/* Quick Portal Switcher Button */}
        <button
          onClick={handleQuickSwitch}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-[#E6F4EC] text-[#0F7A4C] border border-[#C8E6D5] hover:bg-[#d5edde] transition-colors"
          title="Cycle view between Patient, Doctor, and Admin"
        >
          <ArrowLeftRight className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">
            Switch to {activeRole === 'patient' ? 'Doctor View' : isDoctor ? 'Admin View' : 'Patient View'}
          </span>
          <span className="sm:hidden">Switch</span>
        </button>

        {/* User Profile Pill */}
        <div className="flex items-center gap-2.5 pl-3 border-l border-[#E5E5E5]">
          <div
            className={`w-8 h-8 rounded-full border flex items-center justify-center ${
              isAdmin
                ? 'bg-amber-100 border-amber-300 text-amber-800'
                : isDoctor
                ? 'bg-[#E6F4EC] border-[#C8E6D5] text-[#0F7A4C]'
                : 'bg-blue-50 border-blue-200 text-blue-700'
            }`}
          >
            {isAdmin ? (
              <ShieldCheck className="w-4 h-4 stroke-[2]" />
            ) : isDoctor ? (
              <Stethoscope className="w-4 h-4 stroke-[2]" />
            ) : (
              <UserCheck className="w-4 h-4 stroke-[2]" />
            )}
          </div>
          <div className="hidden md:block text-left">
            <div className="text-xs font-semibold text-[#1A1A1A] leading-tight">
              {currentUser?.name || 'Active User'}
            </div>
            <div className="text-[11px] text-[#5C5C5C] leading-none mt-0.5">
              {isAdmin
                ? 'Administrator'
                : isDoctor
                ? `${currentUser?.specialization || 'Medicine'} (${currentUser?.doctorId || 'DOC-01'})`
                : `ID: ${currentUser?.patientId || 'PT-89412'} • ${currentUser?.bloodGroup || 'O+'}`}
            </div>
          </div>

          <button
            onClick={() => {
              logout();
              navigate('/');
            }}
            title="Log Out"
            className="p-1.5 text-[#5C5C5C] hover:text-[#C4302B] hover:bg-[#FDE8E8] rounded-md transition-colors ml-1"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </div>
    </header>
  );
};
