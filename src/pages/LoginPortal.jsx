import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Activity,
  UserCheck,
  Stethoscope,
  ShieldCheck,
  ArrowRight,
  Lock,
  Mail,
  UserPlus,
  LogIn,
  KeyRound,
  AlertCircle,
  Database
} from 'lucide-react';
import { useApp } from '../context/AppContext';

export const LoginPortal = () => {
  const { login, register, switchUser } = useApp();
  const navigate = useNavigate();

  const [authMode, setAuthMode] = useState('login'); // 'login' | 'register'

  // Login form state
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [loginError, setLoginError] = useState(null);

  // Register form state
  const [regName, setRegName] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regPassword, setRegPassword] = useState('');
  const [regRole, setRegRole] = useState('patient'); // 'patient' | 'doctor' | 'admin'
  const [regSpecialization, setRegSpecialization] = useState('Cardiology');
  const [regBloodGroup, setRegBloodGroup] = useState('O+');
  const [regError, setRegError] = useState(null);

  const handleLoginSubmit = (e) => {
    e.preventDefault();
    setLoginError(null);

    const res = login(loginEmail, loginPassword);
    if (!res.success) {
      setLoginError(res.error);
      return;
    }

    if (res.user.role === 'admin') {
      navigate('/admin');
    } else if (res.user.role === 'doctor') {
      navigate('/staff');
    } else {
      navigate('/patient');
    }
  };

  const handleRegisterSubmit = (e) => {
    e.preventDefault();
    setRegError(null);

    const res = register({
      email: regEmail,
      password: regPassword,
      name: regName,
      role: regRole,
      specialization: regRole === 'doctor' ? regSpecialization : null,
      bloodGroup: regRole === 'patient' ? regBloodGroup : null
    });

    if (!res.success) {
      setRegError(res.error);
      return;
    }

    if (res.user.role === 'admin') {
      navigate('/admin');
    } else if (res.user.role === 'doctor') {
      navigate('/staff');
    } else {
      navigate('/patient');
    }
  };

  const handleQuickLogin = (role, customData) => {
    switchUser(role, customData);
    if (role === 'admin') {
      navigate('/admin');
    } else if (role === 'doctor') {
      navigate('/staff');
    } else {
      navigate('/patient');
    }
  };

  return (
    <div className="min-h-screen bg-[#F7F7F7] flex flex-col justify-between p-4 sm:p-6 md:p-8">
      {/* Top Clinical Header */}
      <header className="max-w-5xl w-full mx-auto flex items-center justify-between pb-6 border-b border-[#E5E5E5]">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-[#0F7A4C] flex items-center justify-center text-white">
            <Activity className="w-6 h-6 stroke-[2]" />
          </div>
          <div>
            <h1 className="text-xl sm:text-2xl font-bold text-[#1A1A1A] tracking-tight">
              PulsePoint Health
            </h1>
            <p className="text-xs text-[#5C5C5C]">
              Unified Patient, Clinic &amp; Emergency Coordination Platform
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 text-xs font-semibold px-2.5 py-1 bg-[#E6F4EC] text-[#0F7A4C] rounded border border-[#C8E6D5]">
          <Database className="w-3.5 h-3.5" />
          <span>Connected to Authentication Database</span>
        </div>
      </header>

      {/* Main Authentication Card */}
      <main className="max-w-5xl w-full mx-auto my-auto py-8">
        <div className="text-center max-w-xl mx-auto mb-8">
          <h2 className="text-2xl sm:text-3xl font-bold text-[#1A1A1A]">
            Healthcare Portal Authentication
          </h2>
          <p className="text-xs sm:text-sm text-[#5C5C5C] mt-2">
            Sign in with verified database credentials, or use 1-click evaluation access below.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Column: Form (7 cols) */}
          <div className="lg:col-span-7 health-card bg-white p-6 border border-[#E5E5E5] space-y-5">
            {/* Mode Tabs */}
            <div className="grid grid-cols-2 gap-2 bg-[#F7F7F7] p-1 rounded-lg border border-[#E5E5E5]">
              <button
                type="button"
                onClick={() => setAuthMode('login')}
                className={`py-2 text-xs font-semibold rounded-md transition-all flex items-center justify-center gap-1.5 ${
                  authMode === 'login'
                    ? 'bg-white text-[#0F7A4C] shadow-xs'
                    : 'text-[#5C5C5C] hover:text-[#1A1A1A]'
                }`}
              >
                <LogIn className="w-3.5 h-3.5" />
                <span>Sign In with Database</span>
              </button>
              <button
                type="button"
                onClick={() => setAuthMode('register')}
                className={`py-2 text-xs font-semibold rounded-md transition-all flex items-center justify-center gap-1.5 ${
                  authMode === 'register'
                    ? 'bg-white text-[#0F7A4C] shadow-xs'
                    : 'text-[#5C5C5C] hover:text-[#1A1A1A]'
                }`}
              >
                <UserPlus className="w-3.5 h-3.5" />
                <span>Register New Account</span>
              </button>
            </div>

            {/* Login Form */}
            {authMode === 'login' ? (
              <form onSubmit={handleLoginSubmit} className="space-y-4">
                {loginError && (
                  <div className="p-3 bg-[#FDE8E8] text-[#C4302B] rounded-lg text-xs flex items-center gap-2 border border-[#F8B4B4]">
                    <AlertCircle className="w-4 h-4 shrink-0" />
                    <span>{loginError}</span>
                  </div>
                )}

                <div>
                  <label className="text-xs font-semibold text-[#1A1A1A] block mb-1">
                    Email Address
                  </label>
                  <div className="relative">
                    <Mail className="w-4 h-4 text-[#5C5C5C] absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="email"
                      required
                      placeholder="e.g. jenkins@metrohealth.org or patient@metrohealth.org"
                      value={loginEmail}
                      onChange={(e) => setLoginEmail(e.target.value)}
                      className="w-full text-xs pl-9 pr-3 py-2.5 rounded-lg border border-[#E5E5E5] bg-white text-[#1A1A1A] focus:outline-none focus:border-[#0F7A4C]"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-xs font-semibold text-[#1A1A1A] block mb-1">
                    Password
                  </label>
                  <div className="relative">
                    <Lock className="w-4 h-4 text-[#5C5C5C] absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="password"
                      required
                      placeholder="Enter account security password"
                      value={loginPassword}
                      onChange={(e) => setLoginPassword(e.target.value)}
                      className="w-full text-xs pl-9 pr-3 py-2.5 rounded-lg border border-[#E5E5E5] bg-white text-[#1A1A1A] focus:outline-none focus:border-[#0F7A4C]"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full py-2.5 px-4 bg-[#0F7A4C] hover:bg-[#0c633d] text-white font-semibold text-xs rounded-lg transition-colors flex items-center justify-center gap-1.5"
                >
                  <KeyRound className="w-3.5 h-3.5" />
                  <span>Authenticate &amp; Enter Portal</span>
                </button>
              </form>
            ) : (
              /* Register Form */
              <form onSubmit={handleRegisterSubmit} className="space-y-3.5">
                {regError && (
                  <div className="p-3 bg-[#FDE8E8] text-[#C4302B] rounded-lg text-xs flex items-center gap-2 border border-[#F8B4B4]">
                    <AlertCircle className="w-4 h-4 shrink-0" />
                    <span>{regError}</span>
                  </div>
                )}

                <div>
                  <label className="text-xs font-semibold text-[#1A1A1A] block mb-1">
                    Full Legal Name
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Dr. Arthur Conan or Jane Doe"
                    value={regName}
                    onChange={(e) => setRegName(e.target.value)}
                    className="w-full text-xs p-2.5 rounded-lg border border-[#E5E5E5] bg-white text-[#1A1A1A] focus:outline-none focus:border-[#0F7A4C]"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs font-semibold text-[#1A1A1A] block mb-1">
                      Email Address
                    </label>
                    <input
                      type="email"
                      required
                      placeholder="user@metrohealth.org"
                      value={regEmail}
                      onChange={(e) => setRegEmail(e.target.value)}
                      className="w-full text-xs p-2.5 rounded-lg border border-[#E5E5E5] bg-white text-[#1A1A1A] focus:outline-none focus:border-[#0F7A4C]"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-[#1A1A1A] block mb-1">
                      Password
                    </label>
                    <input
                      type="password"
                      required
                      placeholder="Minimum 6 characters"
                      value={regPassword}
                      onChange={(e) => setRegPassword(e.target.value)}
                      className="w-full text-xs p-2.5 rounded-lg border border-[#E5E5E5] bg-white text-[#1A1A1A] focus:outline-none focus:border-[#0F7A4C]"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-xs font-semibold text-[#1A1A1A] block mb-1">
                    Account Role
                  </label>
                  <select
                    value={regRole}
                    onChange={(e) => setRegRole(e.target.value)}
                    className="w-full text-xs p-2.5 rounded-lg border border-[#E5E5E5] bg-white text-[#1A1A1A] focus:outline-none focus:border-[#0F7A4C]"
                  >
                    <option value="patient">Patient (Outpatient &amp; Emergency Access)</option>
                    <option value="doctor">Doctor / Staff (Clinical Caseload &amp; Verification)</option>
                    <option value="admin">Administrator (Hospital Operations Oversight)</option>
                  </select>
                </div>

                {regRole === 'doctor' && (
                  <div>
                    <label className="text-xs font-semibold text-[#1A1A1A] block mb-1">
                      Clinical Specialization
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Cardiology, Neurology, Internal Medicine"
                      value={regSpecialization}
                      onChange={(e) => setRegSpecialization(e.target.value)}
                      className="w-full text-xs p-2.5 rounded-lg border border-[#E5E5E5] bg-white text-[#1A1A1A] focus:outline-none focus:border-[#0F7A4C]"
                    />
                  </div>
                )}

                {regRole === 'patient' && (
                  <div>
                    <label className="text-xs font-semibold text-[#1A1A1A] block mb-1">
                      Blood Group
                    </label>
                    <select
                      value={regBloodGroup}
                      onChange={(e) => setRegBloodGroup(e.target.value)}
                      className="w-full text-xs p-2.5 rounded-lg border border-[#E5E5E5] bg-white text-[#1A1A1A] focus:outline-none focus:border-[#0F7A4C]"
                    >
                      {['O+', 'O-', 'A+', 'A-', 'B+', 'B-', 'AB+', 'AB-'].map(bg => (
                        <option key={bg} value={bg}>{bg}</option>
                      ))}
                    </select>
                  </div>
                )}

                <button
                  type="submit"
                  className="w-full py-2.5 px-4 bg-[#0F7A4C] hover:bg-[#0c633d] text-white font-semibold text-xs rounded-lg transition-colors flex items-center justify-center gap-1.5"
                >
                  <UserPlus className="w-3.5 h-3.5" />
                  <span>Complete Registration &amp; Connect</span>
                </button>
              </form>
            )}
          </div>

          {/* Right Column: 1-Click Evaluation Logins (5 cols) */}
          <div className="lg:col-span-5 space-y-4">
            <div>
              <h3 className="text-base font-bold text-[#1A1A1A]">
                1-Click Evaluation Credentials
              </h3>
              <p className="text-xs text-[#5C5C5C] mt-0.5">
                Pre-authenticated accounts to quickly test doctor isolation, blood verification, and admin features:
              </p>
            </div>

            <div className="space-y-2.5">
              {/* Doctor 1: Dr. Sarah Jenkins */}
              <button
                type="button"
                onClick={() =>
                  handleQuickLogin('doctor', {
                    id: 'USR-DOC-01',
                    email: 'jenkins@metrohealth.org',
                    name: 'Dr. Sarah Jenkins, MD',
                    doctorId: 'DOC-01',
                    specialization: 'Cardiology',
                    hospital: 'Metro General Hospital'
                  })
                }
                className="w-full p-3 rounded-lg border border-[#E5E5E5] hover:border-[#0F7A4C] hover:bg-[#E6F4EC]/30 text-left transition-all flex items-center justify-between group bg-white"
              >
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-lg bg-[#E6F4EC] text-[#0F7A4C] flex items-center justify-center font-bold text-xs">
                    <Stethoscope className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="font-semibold text-xs text-[#1A1A1A] group-hover:text-[#0F7A4C]">
                      Dr. Sarah Jenkins, MD
                    </div>
                    <div className="text-[11px] text-[#5C5C5C]">
                      Cardiology • ID: <strong>DOC-01</strong>
                    </div>
                  </div>
                </div>
                <ArrowRight className="w-4 h-4 text-[#5C5C5C] group-hover:text-[#0F7A4C]" />
              </button>

              {/* Doctor 2: Dr. Robert Chen */}
              <button
                type="button"
                onClick={() =>
                  handleQuickLogin('doctor', {
                    id: 'USR-DOC-02',
                    email: 'chen@metrohealth.org',
                    name: 'Dr. Robert Chen, MD',
                    doctorId: 'DOC-02',
                    specialization: 'Internal Medicine',
                    hospital: 'Central Health Clinic'
                  })
                }
                className="w-full p-3 rounded-lg border border-[#E5E5E5] hover:border-[#0F7A4C] hover:bg-[#E6F4EC]/30 text-left transition-all flex items-center justify-between group bg-white"
              >
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-lg bg-[#E6F4EC] text-[#0F7A4C] flex items-center justify-center font-bold text-xs">
                    <Stethoscope className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="font-semibold text-xs text-[#1A1A1A] group-hover:text-[#0F7A4C]">
                      Dr. Robert Chen, MD
                    </div>
                    <div className="text-[11px] text-[#5C5C5C]">
                      Internal Medicine • ID: <strong>DOC-02</strong>
                    </div>
                  </div>
                </div>
                <ArrowRight className="w-4 h-4 text-[#5C5C5C] group-hover:text-[#0F7A4C]" />
              </button>

              {/* Patient: Marcus Vance */}
              <button
                type="button"
                onClick={() =>
                  handleQuickLogin('patient', {
                    id: 'USR-PAT-01',
                    email: 'patient@metrohealth.org',
                    name: 'Marcus Vance',
                    patientId: 'PT-89412',
                    bloodGroup: 'O+'
                  })
                }
                className="w-full p-3 rounded-lg border border-[#E5E5E5] hover:border-blue-600 hover:bg-blue-50/50 text-left transition-all flex items-center justify-between group bg-white"
              >
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-700 flex items-center justify-center font-bold text-xs">
                    <UserCheck className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="font-semibold text-xs text-[#1A1A1A] group-hover:text-blue-700">
                      Marcus Vance (Patient)
                    </div>
                    <div className="text-[11px] text-[#5C5C5C]">
                      ID: PT-89412 • Blood Group: O+
                    </div>
                  </div>
                </div>
                <ArrowRight className="w-4 h-4 text-[#5C5C5C] group-hover:text-blue-700" />
              </button>

              {/* Administrator */}
              <button
                type="button"
                onClick={() =>
                  handleQuickLogin('admin', {
                    id: 'USR-ADM-01',
                    email: 'admin@metrohealth.org',
                    name: 'Clinical Operations Director',
                    department: 'Hospital Administration & Emergency Oversight'
                  })
                }
                className="w-full p-3 rounded-lg border border-[#E5E5E5] hover:border-amber-600 hover:bg-amber-50/40 text-left transition-all flex items-center justify-between group bg-white"
              >
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-lg bg-amber-100 text-amber-900 flex items-center justify-center font-bold text-xs">
                    <ShieldCheck className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="font-semibold text-xs text-[#1A1A1A] group-hover:text-amber-900">
                      Hospital Administrator (Admin)
                    </div>
                    <div className="text-[11px] text-[#5C5C5C]">
                      All Doctors, Patients &amp; Logistics
                    </div>
                  </div>
                </div>
                <ArrowRight className="w-4 h-4 text-[#5C5C5C] group-hover:text-amber-900" />
              </button>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="max-w-5xl w-full mx-auto pt-6 border-t border-[#E5E5E5] text-xs text-[#5C5C5C] flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <Activity className="w-4 h-4 text-[#0F7A4C]" />
          <span>PulsePoint Health Coordination Platform • Authentication &amp; Database Layer</span>
        </div>
        <div className="flex items-center gap-4 text-[11px]">
          <span>Role Enforcement</span>
          <span>•</span>
          <span>Doctor Isolation</span>
          <span>•</span>
          <span>One-Way Status Transitions</span>
        </div>
      </footer>
    </div>
  );
};
