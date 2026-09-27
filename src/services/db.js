import bcrypt from 'bcryptjs';

// Pre-seeded database users with hashed passwords
const INITIAL_USERS = [
  {
    id: 'USR-PAT-01',
    email: 'patient@metrohealth.org',
    // Hash for 'patient123'
    passwordHash: bcrypt.hashSync('patient123', 8),
    role: 'patient',
    name: 'Marcus Vance',
    patientId: 'PT-89412',
    phone: '+1 (555) 234-8901',
    bloodGroup: 'O+',
    createdAt: '2026-09-01'
  },
  {
    id: 'USR-PAT-02',
    email: 'claire@metrohealth.org',
    passwordHash: bcrypt.hashSync('patient123', 8),
    role: 'patient',
    name: 'Claire Dunphy',
    patientId: 'PT-31049',
    phone: '+1 (555) 492-3310',
    bloodGroup: 'A+',
    createdAt: '2026-09-05'
  },
  {
    id: 'USR-DOC-01',
    email: 'jenkins@metrohealth.org',
    // Hash for 'doctor123'
    passwordHash: bcrypt.hashSync('doctor123', 8),
    role: 'doctor',
    name: 'Dr. Sarah Jenkins, MD',
    doctorId: 'DOC-01',
    specialization: 'Cardiology',
    hospital: 'Metro General Hospital',
    phone: '+1 (555) 019-2831',
    createdAt: '2026-08-15'
  },
  {
    id: 'USR-DOC-02',
    email: 'chen@metrohealth.org',
    passwordHash: bcrypt.hashSync('doctor123', 8),
    role: 'doctor',
    name: 'Dr. Robert Chen, MD',
    doctorId: 'DOC-02',
    specialization: 'Internal Medicine',
    hospital: 'Central Health Clinic',
    phone: '+1 (555) 018-7744',
    createdAt: '2026-08-20'
  },
  {
    id: 'USR-DOC-03',
    email: 'rostova@metrohealth.org',
    passwordHash: bcrypt.hashSync('doctor123', 8),
    role: 'doctor',
    name: 'Dr. Elena Rostova, MD',
    doctorId: 'DOC-03',
    specialization: 'Neurology',
    hospital: 'St. Jude Medical Center',
    phone: '+1 (555) 012-3341',
    createdAt: '2026-08-22'
  },
  {
    id: 'USR-DOC-04',
    email: 'adebayo@metrohealth.org',
    passwordHash: bcrypt.hashSync('doctor123', 8),
    role: 'doctor',
    name: 'Dr. David Adebayo, MD',
    doctorId: 'DOC-04',
    specialization: 'Orthopedics',
    hospital: 'Summit Orthopedic Care',
    phone: '+1 (555) 017-5512',
    createdAt: '2026-08-25'
  },
  {
    id: 'USR-DOC-05',
    email: 'patel@metrohealth.org',
    passwordHash: bcrypt.hashSync('doctor123', 8),
    role: 'doctor',
    name: 'Dr. Maya Patel, MD',
    doctorId: 'DOC-05',
    specialization: 'Pulmonology',
    hospital: 'Metro General Hospital',
    phone: '+1 (555) 019-2832',
    createdAt: '2026-08-28'
  },
  {
    id: 'USR-ADM-01',
    email: 'admin@metrohealth.org',
    // Hash for 'admin123'
    passwordHash: bcrypt.hashSync('admin123', 8),
    role: 'admin',
    name: 'Clinical Operations Director',
    department: 'Hospital Administration & Emergency Oversight',
    phone: '+1 (555) 010-0000',
    createdAt: '2026-07-01'
  }
];

const DB_USERS_KEY = 'pulsepoint_db_users';
const DB_SESSION_KEY = 'pulsepoint_session';

// Initialize and retrieve users from persistent database storage
export const getDatabaseUsers = () => {
  try {
    const raw = localStorage.getItem(DB_USERS_KEY);
    if (!raw) {
      localStorage.setItem(DB_USERS_KEY, JSON.stringify(INITIAL_USERS));
      return INITIAL_USERS;
    }
    return JSON.parse(raw);
  } catch {
    return INITIAL_USERS;
  }
};

export const saveDatabaseUsers = (users) => {
  try {
    localStorage.setItem(DB_USERS_KEY, JSON.stringify(users));
  } catch (err) {
    console.error('Failed to save database users:', err);
  }
};

// Authentication verification
export const authenticateUser = (email, password) => {
  const users = getDatabaseUsers();
  const normalizedEmail = email.trim().toLowerCase();
  const user = users.find(u => u.email.toLowerCase() === normalizedEmail);

  if (!user) {
    return { success: false, error: 'User record not found in health database.' };
  }

  const isPasswordValid = bcrypt.compareSync(password, user.passwordHash);
  if (!isPasswordValid) {
    return { success: false, error: 'Invalid security credentials. Check password.' };
  }

  // Create simulated JWT session payload
  const sessionUser = {
    id: user.id,
    email: user.email,
    name: user.name,
    role: user.role, // 'patient' | 'doctor' | 'admin'
    doctorId: user.doctorId || null,
    patientId: user.patientId || null,
    specialization: user.specialization || null,
    hospital: user.hospital || null,
    bloodGroup: user.bloodGroup || null,
    token: `jwt_session_${user.id}_${Date.now()}`
  };

  try {
    localStorage.setItem(DB_SESSION_KEY, JSON.stringify(sessionUser));
  } catch {}

  return { success: true, user: sessionUser };
};

// Register new user into database
export const registerUser = ({ email, password, name, role, doctorId, specialization, hospital, bloodGroup, phone }) => {
  const users = getDatabaseUsers();
  const normalizedEmail = email.trim().toLowerCase();

  if (users.some(u => u.email.toLowerCase() === normalizedEmail)) {
    return { success: false, error: 'An account with this email address already exists in database.' };
  }

  const newId = `USR-${role.toUpperCase().slice(0, 3)}-${Date.now()}`;
  const passwordHash = bcrypt.hashSync(password, 8);

  const newUser = {
    id: newId,
    email: normalizedEmail,
    passwordHash,
    role,
    name,
    phone: phone || '+1 (555) 000-0000',
    patientId: role === 'patient' ? `PT-${Math.floor(10000 + Math.random() * 89999)}` : null,
    doctorId: role === 'doctor' ? (doctorId || `DOC-${Math.floor(10 + Math.random() * 89)}`) : null,
    specialization: specialization || (role === 'doctor' ? 'General Medicine' : null),
    hospital: hospital || 'Metro General Hospital',
    bloodGroup: bloodGroup || (role === 'patient' ? 'O+' : null),
    createdAt: new Date().toISOString().split('T')[0]
  };

  const updatedUsers = [...users, newUser];
  saveDatabaseUsers(updatedUsers);

  // Auto-login
  const sessionUser = {
    id: newUser.id,
    email: newUser.email,
    name: newUser.name,
    role: newUser.role,
    doctorId: newUser.doctorId,
    patientId: newUser.patientId,
    specialization: newUser.specialization,
    hospital: newUser.hospital,
    bloodGroup: newUser.bloodGroup,
    token: `jwt_session_${newUser.id}_${Date.now()}`
  };

  try {
    localStorage.setItem(DB_SESSION_KEY, JSON.stringify(sessionUser));
  } catch {}

  // If new user is a patient, register in patient directory
  if (role === 'patient') {
    saveNewPatient({
      id: newUser.patientId,
      name: newUser.name,
      age: 34,
      gender: 'Patient',
      bloodGroup: newUser.bloodGroup || 'O+',
      phone: newUser.phone,
      email: newUser.email,
      address: '742 Evergreen Terrace, Metro City',
      emergencyContact: 'Family Contact - ' + newUser.phone,
      allergies: 'None reported',
      chronicConditions: 'General outpatient observation'
    });
  }

  return { success: true, user: sessionUser };
};

export const getStoredSession = () => {
  try {
    const raw = localStorage.getItem(DB_SESSION_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
};

export const clearStoredSession = () => {
  try {
    localStorage.removeItem(DB_SESSION_KEY);
  } catch {}
};

// ==========================================
// PATIENTS DATABASE PERSISTENCE
// ==========================================
const DB_PATIENTS_KEY = 'pulsepoint_patients_db';

export const saveNewPatient = (patient) => {
  try {
    const existing = getStoredPatients([]);
    const filtered = existing.filter(p => p.id !== patient.id && p.email !== patient.email);
    const updated = [patient, ...filtered];
    localStorage.setItem(DB_PATIENTS_KEY, JSON.stringify(updated));
    return updated;
  } catch {
    return [patient];
  }
};

export const getStoredPatients = (seededPatients = []) => {
  try {
    const raw = localStorage.getItem(DB_PATIENTS_KEY);
    let patients = raw ? JSON.parse(raw) : [];

    // Combine with seeded patients
    const map = new Map();
    seededPatients.forEach(p => map.set(p.id, p));
    patients.forEach(p => map.set(p.id, p));

    // Also verify all registered database users with role 'patient' are present
    const users = getDatabaseUsers();
    users.filter(u => u.role === 'patient').forEach(u => {
      const pid = u.patientId || u.id;
      if (!map.has(pid)) {
        map.set(pid, {
          id: pid,
          name: u.name,
          age: 36,
          gender: 'Patient',
          bloodGroup: u.bloodGroup || 'O+',
          phone: u.phone,
          email: u.email,
          address: '742 Evergreen Terrace, Metro City',
          emergencyContact: 'Family Contact - ' + u.phone,
          allergies: 'None reported',
          chronicConditions: 'General outpatient observation'
        });
      }
    });

    const result = Array.from(map.values());
    localStorage.setItem(DB_PATIENTS_KEY, JSON.stringify(result));
    return result;
  } catch {
    return seededPatients;
  }
};

// ==========================================
// FACILITIES DATABASE PERSISTENCE
// ==========================================
const DB_FACILITIES_KEY = 'pulsepoint_facilities_db';

export const getStoredFacilities = (seededFacilities = []) => {
  try {
    const raw = localStorage.getItem(DB_FACILITIES_KEY);
    if (!raw) {
      localStorage.setItem(DB_FACILITIES_KEY, JSON.stringify(seededFacilities));
      return seededFacilities;
    }
    const facilities = JSON.parse(raw);
    // Ensure all seeded facilities exist
    const map = new Map();
    seededFacilities.forEach(f => map.set(f.id, f));
    facilities.forEach(f => map.set(f.id, f));
    return Array.from(map.values());
  } catch {
    return seededFacilities;
  }
};

export const saveStoredFacilities = (facilities) => {
  try {
    localStorage.setItem(DB_FACILITIES_KEY, JSON.stringify(facilities));
  } catch {}
};

// ==========================================
// APPOINTMENTS DATABASE PERSISTENCE
// ==========================================
const DB_APPOINTMENTS_KEY = 'pulsepoint_appointments_db';

export const getStoredAppointments = (initialAppointments = []) => {
  try {
    const raw = localStorage.getItem(DB_APPOINTMENTS_KEY);
    if (!raw) {
      localStorage.setItem(DB_APPOINTMENTS_KEY, JSON.stringify(initialAppointments));
      return initialAppointments;
    }
    return JSON.parse(raw);
  } catch {
    return initialAppointments;
  }
};

export const saveStoredAppointments = (appointments) => {
  try {
    localStorage.setItem(DB_APPOINTMENTS_KEY, JSON.stringify(appointments));
  } catch {}
};

