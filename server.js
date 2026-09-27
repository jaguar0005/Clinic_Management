import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import bcrypt from 'bcryptjs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 8080;

app.use(express.json());

// In-memory / persistent database storage for server instance
const USERS_DB = [
  {
    id: 'USR-PAT-01',
    email: 'patient@metrohealth.org',
    passwordHash: bcrypt.hashSync('patient123', 8),
    role: 'patient',
    name: 'Marcus Vance',
    patientId: 'PT-89412',
    bloodGroup: 'O+'
  },
  {
    id: 'USR-DOC-01',
    email: 'jenkins@metrohealth.org',
    passwordHash: bcrypt.hashSync('doctor123', 8),
    role: 'doctor',
    name: 'Dr. Sarah Jenkins, MD',
    doctorId: 'DOC-01',
    specialization: 'Cardiology',
    hospital: 'Metro General Hospital'
  },
  {
    id: 'USR-DOC-02',
    email: 'chen@metrohealth.org',
    passwordHash: bcrypt.hashSync('doctor123', 8),
    role: 'doctor',
    name: 'Dr. Robert Chen, MD',
    doctorId: 'DOC-02',
    specialization: 'Internal Medicine',
    hospital: 'Central Health Clinic'
  },
  {
    id: 'USR-ADM-01',
    email: 'admin@metrohealth.org',
    passwordHash: bcrypt.hashSync('admin123', 8),
    role: 'admin',
    name: 'Clinical Operations Director',
    department: 'Hospital Administration'
  }
];

// Health API check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', service: 'PulsePoint Health API', timestamp: new Date().toISOString() });
});

// Authentication API: Login
app.post('/api/auth/login', (req, res) => {
  const { email, password } = req.body || {};
  if (!email || !password) {
    return res.status(400).json({ success: false, error: 'Email and password are required.' });
  }

  const user = USERS_DB.find(u => u.email.toLowerCase() === email.trim().toLowerCase());
  if (!user || !bcrypt.compareSync(password, user.passwordHash)) {
    return res.status(401).json({ success: false, error: 'Invalid email or password credentials.' });
  }

  const { passwordHash, ...safeUser } = user;
  return res.json({
    success: true,
    user: {
      ...safeUser,
      token: `jwt_live_${user.id}_${Date.now()}`
    }
  });
});

// Authentication API: Register
app.post('/api/auth/register', (req, res) => {
  const { email, password, name, role, specialization, hospital, bloodGroup } = req.body || {};
  if (!email || !password || !name) {
    return res.status(400).json({ success: false, error: 'Name, email, and password are required.' });
  }

  if (USERS_DB.some(u => u.email.toLowerCase() === email.trim().toLowerCase())) {
    return res.status(409).json({ success: false, error: 'An account with this email address already exists.' });
  }

  const newUser = {
    id: `USR-${(role || 'PAT').toUpperCase().slice(0, 3)}-${Date.now()}`,
    email: email.trim().toLowerCase(),
    passwordHash: bcrypt.hashSync(password, 8),
    role: role || 'patient',
    name,
    patientId: role === 'patient' ? `PT-${Math.floor(10000 + Math.random() * 89999)}` : null,
    doctorId: role === 'doctor' ? `DOC-${Math.floor(10 + Math.random() * 89)}` : null,
    specialization: specialization || (role === 'doctor' ? 'General Medicine' : null),
    hospital: hospital || 'Metro General Hospital',
    bloodGroup: bloodGroup || (role === 'patient' ? 'O+' : null)
  };

  USERS_DB.push(newUser);
  const { passwordHash, ...safeUser } = newUser;
  return res.status(201).json({
    success: true,
    user: {
      ...safeUser,
      token: `jwt_live_${newUser.id}_${Date.now()}`
    }
  });
});

// List users for admin inspection
app.get('/api/auth/users', (req, res) => {
  const sanitized = USERS_DB.map(({ passwordHash, ...u }) => u);
  res.json({ success: true, count: sanitized.length, users: sanitized });
});

// Serve static compiled assets from dist
app.use(express.static(path.join(__dirname, 'dist')));

// Fallback to index.html for SPA client-side routing
app.use((req, res) => {
  res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`PulsePoint Health server listening on http://0.0.0.0:${PORT}`);
});
