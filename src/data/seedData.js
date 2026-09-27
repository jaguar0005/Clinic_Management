// Seed data for PulsePoint Health Platform

export const CURRENT_PATIENT = {
  id: 'PT-89412',
  name: 'Marcus Vance',
  age: 42,
  gender: 'Male',
  bloodGroup: 'O+',
  phone: '+1 (555) 234-8901',
  email: 'm.vance@metrohealth.org',
  address: '742 Evergreen Terrace, Metro City, NY 10001',
  emergencyContact: 'Eleanor Vance (Spouse) - +1 (555) 234-8902',
  allergies: 'Penicillin, Shellfish',
  chronicConditions: 'Mild Hypertension'
};

export const SEEDED_DOCTORS = [
  {
    id: 'DOC-01',
    name: 'Dr. Sarah Jenkins, MD',
    specialization: 'Cardiology',
    hospital: 'Metro General Hospital',
    rating: 4.9,
    experience: '14 years',
    nextAvailable: 'Tomorrow, 09:30 AM',
    availableSlots: ['09:30 AM', '11:00 AM', '02:00 PM', '04:15 PM']
  },
  {
    id: 'DOC-02',
    name: 'Dr. Robert Chen, MD',
    specialization: 'Internal Medicine',
    hospital: 'Central Health Clinic',
    rating: 4.8,
    experience: '11 years',
    nextAvailable: 'Today, 02:00 PM',
    availableSlots: ['02:00 PM', '02:45 PM', '03:30 PM', '05:00 PM']
  },
  {
    id: 'DOC-03',
    name: 'Dr. Elena Rostova, MD',
    specialization: 'Neurology',
    hospital: 'St. Jude Medical Center',
    rating: 4.9,
    experience: '18 years',
    nextAvailable: 'Wed, 11:00 AM',
    availableSlots: ['11:00 AM', '12:30 PM', '03:15 PM', '04:30 PM']
  },
  {
    id: 'DOC-04',
    name: 'Dr. David Adebayo, MD',
    specialization: 'Orthopedics',
    hospital: 'Summit Orthopedic Care',
    rating: 4.7,
    experience: '9 years',
    nextAvailable: 'Thu, 10:15 AM',
    availableSlots: ['10:15 AM', '11:45 AM', '01:30 PM', '03:00 PM']
  },
  {
    id: 'DOC-05',
    name: 'Dr. Maya Patel, MD',
    specialization: 'Pulmonology',
    hospital: 'Metro General Hospital',
    rating: 4.8,
    experience: '12 years',
    nextAvailable: 'Fri, 03:30 PM',
    availableSlots: ['09:00 AM', '10:30 AM', '01:15 PM', '03:30 PM']
  }
];

export const INITIAL_APPOINTMENTS = [
  {
    id: 'APT-1001',
    patientId: 'PT-89412',
    patientName: 'Marcus Vance',
    doctorId: 'DOC-01',
    doctorName: 'Dr. Sarah Jenkins, MD',
    specialization: 'Cardiology',
    hospital: 'Metro General Hospital - Dept. B, Room 304',
    date: '2026-09-28',
    time: '09:30 AM',
    status: 'Confirmed',
    type: 'Routine Cardiovascular Follow-up',
    notes: 'Review blood pressure telemetry logs and adjust dosage if indicated.'
  },
  {
    id: 'APT-1002',
    patientId: 'PT-89412',
    patientName: 'Marcus Vance',
    doctorId: 'DOC-02',
    doctorName: 'Dr. Robert Chen, MD',
    specialization: 'Internal Medicine',
    hospital: 'Central Health Clinic - Suite 102',
    date: '2026-09-14',
    time: '02:00 PM',
    status: 'Completed',
    type: 'Annual Preventative Health Assessment',
    notes: 'All standard vitals normal. Recommended lipid follow-up.'
  },
  {
    id: 'APT-1003',
    patientId: 'PT-31049',
    patientName: 'Claire Dunphy',
    doctorId: 'DOC-01',
    doctorName: 'Dr. Sarah Jenkins, MD',
    specialization: 'Cardiology',
    hospital: 'Metro General Hospital - Dept. B',
    date: '2026-09-28',
    time: '11:00 AM',
    status: 'Confirmed',
    type: 'Stress Echocardiogram Test',
    notes: 'Patient reported mild exertional dyspnea.'
  },
  {
    id: 'APT-1004',
    patientId: 'PT-52901',
    patientName: 'Carlos Mendoza',
    doctorId: 'DOC-03',
    doctorName: 'Dr. Elena Rostova, MD',
    specialization: 'Neurology',
    hospital: 'St. Jude Medical Center - Room 410',
    date: '2026-09-29',
    time: '10:00 AM',
    status: 'Checked-In',
    type: 'Migraine Aura Consultation',
    notes: 'Chronic hemicranial episodes persisting > 4 weeks.'
  },
  {
    id: 'APT-1005',
    patientId: 'PT-66104',
    patientName: 'Beatrice Woods',
    doctorId: 'DOC-04',
    doctorName: 'Dr. David Adebayo, MD',
    specialization: 'Orthopedics',
    hospital: 'Summit Orthopedic Care',
    date: '2026-09-29',
    time: '01:30 PM',
    status: 'Requested',
    type: 'Left Knee Arthroscopy Follow-up',
    notes: 'Assessing post-operative mobility and swelling.'
  },
  {
    id: 'APT-1006',
    patientId: 'PT-77299',
    patientName: 'Dev Patel',
    doctorId: 'DOC-05',
    doctorName: 'Dr. Maya Patel, MD',
    specialization: 'Pulmonology',
    hospital: 'Metro General Hospital',
    date: '2026-09-30',
    time: '09:00 AM',
    status: 'Confirmed',
    type: 'Asthma Management Plan',
    notes: 'Spirometry re-test requested.'
  },
  {
    id: 'APT-1007',
    patientId: 'PT-89412',
    patientName: 'Marcus Vance',
    doctorId: 'DOC-04',
    doctorName: 'Dr. David Adebayo, MD',
    specialization: 'Orthopedics',
    hospital: 'Summit Orthopedic Care',
    date: '2026-08-10',
    time: '11:30 AM',
    status: 'Cancelled',
    type: 'Ankle Sprain Evaluation',
    notes: 'Cancelled by patient due to schedule conflict.'
  }
];

export const SEEDED_BLOOD_BANKS = [
  {
    id: 'BB-01',
    name: 'Metro Regional Blood Center',
    address: '450 Lexington Ave, Metro City',
    distance: '2.4 km',
    contact: '+1 (555) 014-9921',
    lastUpdated: '12 mins ago',
    inventory: {
      'O+': 14,
      'O-': 3,
      'A+': 22,
      'A-': 6,
      'B+': 18,
      'B-': 4,
      'AB+': 9,
      'AB-': 2
    }
  },
  {
    id: 'BB-02',
    name: 'Red Shield Blood Reserve',
    address: '880 Broadway Blvd, Metro City',
    distance: '4.8 km',
    contact: '+1 (555) 019-4411',
    lastUpdated: '28 mins ago',
    inventory: {
      'O+': 8,
      'O-': 1,
      'A+': 15,
      'A-': 2,
      'B+': 11,
      'B-': 0,
      'AB+': 5,
      'AB-': 1
    }
  },
  {
    id: 'BB-03',
    name: 'St. Jude Transfusion Depot',
    address: '1200 Cathedral Pkwy, Metro City',
    distance: '6.1 km',
    contact: '+1 (555) 012-3341',
    lastUpdated: '45 mins ago',
    inventory: {
      'O+': 19,
      'O-': 5,
      'A+': 28,
      'A-': 7,
      'B+': 14,
      'B-': 3,
      'AB+': 8,
      'AB-': 3
    }
  },
  {
    id: 'BB-04',
    name: 'Hope Valley Emergency Bank',
    address: '312 Industrial Park Rd, Metro City',
    distance: '9.3 km',
    contact: '+1 (555) 018-8822',
    lastUpdated: '1 hour ago',
    inventory: {
      'O+': 4,
      'O-': 0,
      'A+': 9,
      'A-': 1,
      'B+': 7,
      'B-': 1,
      'AB+': 3,
      'AB-': 0
    }
  }
];

export const INITIAL_BLOOD_REQUESTS = [
  {
    id: 'BLD-401',
    patientName: 'Marcus Vance',
    doctorId: 'DOC-01',
    doctorName: 'Dr. Sarah Jenkins, MD',
    bloodGroup: 'O+',
    units: 2,
    hospital: 'Metro General Hospital (Surgical Ward 3)',
    requiredBy: '2026-09-28 16:00',
    contact: '+1 (555) 234-8901',
    urgency: 'High',
    status: 'Submitted', // Submitted -> Doctor Verified -> Searching -> Availability Found
    createdAt: 'Today, 10:15 AM',
    notes: 'Scheduled for elective vascular revision. Pre-op reserve requirement.'
  },
  {
    id: 'BLD-402',
    patientName: 'Dev Patel',
    doctorId: 'DOC-02',
    doctorName: 'Dr. Robert Chen, MD',
    bloodGroup: 'B+',
    units: 3,
    hospital: 'St. Jude Medical Center',
    requiredBy: '2026-09-29 08:00',
    contact: '+1 (555) 890-1122',
    urgency: 'Emergency',
    status: 'Doctor Verified',
    createdAt: 'Today, 08:30 AM',
    notes: 'Verified by Dr. Chen. Acute trauma transfusion protocol.'
  },
  {
    id: 'BLD-403',
    patientName: 'Elena Gomez',
    doctorId: 'DOC-03',
    doctorName: 'Dr. Elena Rostova, MD',
    bloodGroup: 'AB-',
    units: 1,
    hospital: 'Central Health Clinic',
    requiredBy: '2026-09-30 12:00',
    contact: '+1 (555) 441-9988',
    urgency: 'Moderate',
    status: 'Availability Found',
    createdAt: 'Yesterday, 14:00 PM',
    notes: 'Transfusion unit reserved at St. Jude Transfusion Depot.'
  },
  {
    id: 'BLD-404',
    patientName: 'Marcus Vance',
    doctorId: 'DOC-02',
    doctorName: 'Dr. Robert Chen, MD',
    bloodGroup: 'O+',
    units: 1,
    hospital: 'Central Health Clinic',
    requiredBy: '2026-09-29 15:00',
    contact: '+1 (555) 234-8901',
    urgency: 'High',
    status: 'Submitted',
    createdAt: 'Today, 11:20 AM',
    notes: 'Severe anemia stabilization and cross-match requested.'
  }
];

export const INITIAL_AMBULANCE_REQUESTS = [
  {
    id: 'AMB-809',
    patientName: 'Marcus Vance',
    pickupLocation: '742 Evergreen Terrace, Metro City',
    destination: 'Metro General Hospital Emergency Dept.',
    contact: '+1 (555) 234-8901',
    notes: 'Patient experiencing acute retrosternal chest tightness.',
    status: 'Dispatched', // Requested -> Assigned -> Dispatched -> Arriving -> Completed
    unitId: 'EMS Unit 04',
    etaMinutes: 6,
    requestedAt: '12 mins ago',
    driverContact: '+1 (555) 019-8804'
  }
];

export const SEEDED_FACILITIES = [
  {
    id: 'FAC-01',
    name: 'Metro General Hospital',
    type: 'hospital',
    lat: 40.7128,
    lng: -74.0060,
    address: '100 Hospital Plaza, Metro City',
    distance: '1.8 km',
    specialties: 'Level 1 Trauma Center, Interventional Cardiology, Intensive Care, 24/7 ER',
    phone: '+1 (555) 019-2831',
    emergencyBeds: 18,
    operatingHours: '24 Hours / 7 Days'
  },
  {
    id: 'FAC-02',
    name: 'Central Health Clinic',
    type: 'clinic',
    lat: 40.7180,
    lng: -74.0010,
    address: '422 Center Street, Metro City',
    distance: '2.3 km',
    specialties: 'Primary Care, Pediatrics, Urgent Diagnostics, Outpatient Pharmacy',
    phone: '+1 (555) 018-7744',
    emergencyBeds: 4,
    operatingHours: '08:00 AM - 08:00 PM'
  },
  {
    id: 'FAC-03',
    name: 'Metro Regional Blood Center',
    type: 'blood-bank',
    lat: 40.7090,
    lng: -74.0110,
    address: '450 Lexington Ave, Metro City',
    distance: '2.4 km',
    specialties: 'Whole Blood Donations, Platelet Pheresis, Rapid Crossmatch Laboratory',
    phone: '+1 (555) 014-9921',
    emergencyBeds: 0,
    operatingHours: '07:00 AM - 07:00 PM'
  },
  {
    id: 'FAC-04',
    name: 'St. Jude Medical Center',
    type: 'hospital',
    lat: 40.7250,
    lng: -73.9980,
    address: '1200 Cathedral Pkwy, Metro City',
    distance: '4.1 km',
    specialties: 'Neurology, Oncology, Comprehensive Stroke Care, Level 2 Pediatric ER',
    phone: '+1 (555) 012-3341',
    emergencyBeds: 12,
    operatingHours: '24 Hours / 7 Days'
  },
  {
    id: 'FAC-05',
    name: 'City West Primary Clinic',
    type: 'clinic',
    lat: 40.7050,
    lng: -74.0150,
    address: '190 Hudson Ave, Metro City',
    distance: '3.7 km',
    specialties: 'Family Medicine, Geriatric Consultations, Preventive Screenings',
    phone: '+1 (555) 017-5512',
    emergencyBeds: 2,
    operatingHours: '08:30 AM - 06:00 PM'
  },
  {
    id: 'FAC-06',
    name: 'Red Shield Blood Reserve',
    type: 'blood-bank',
    lat: 40.7150,
    lng: -74.0180,
    address: '880 Broadway Blvd, Metro City',
    distance: '4.8 km',
    specialties: 'Emergency Plasma Reserve, Rare Blood Group Registry, Cryoprecipitate',
    phone: '+1 (555) 019-4411',
    emergencyBeds: 0,
    operatingHours: '08:00 AM - 06:00 PM'
  },
  {
    id: 'FAC-07',
    name: 'Rapid Response Ambulance #04',
    type: 'ambulance',
    lat: 40.7115,
    lng: -74.0040,
    address: 'Current Location: En Route on Broadway',
    distance: 'En Route — 1.2 km away',
    specialties: 'Advanced Cardiac Life Support (ACLS), Paramedic Crew of 3',
    phone: 'Dispatch: 911-AMB-04',
    emergencyBeds: 1,
    operatingHours: 'Active Dispatch'
  },
  {
    id: 'FAC-08',
    name: 'Rapid Response Ambulance #07',
    type: 'ambulance',
    lat: 40.7210,
    lng: -73.9920,
    address: 'Standby Station: 5th Ave Outpost',
    distance: 'Standby — 3.5 km away',
    specialties: 'Basic Life Support (BLS), Immediate Response Certified',
    phone: 'Dispatch: 911-AMB-07',
    emergencyBeds: 1,
    operatingHours: 'Standby Ready'
  }
];

export const SEEDED_PATIENTS = [
  CURRENT_PATIENT,
  {
    id: 'PT-31049',
    name: 'Claire Dunphy',
    age: 48,
    gender: 'Female',
    bloodGroup: 'A+',
    phone: '+1 (555) 492-3310',
    email: 'c.dunphy@metrohealth.org',
    address: '142 Maplewood Road, Metro City, NY 10003',
    emergencyContact: 'Phil Dunphy (Spouse) - +1 (555) 492-3311',
    allergies: 'Aspirin',
    chronicConditions: 'Asthma, Seasonal Rhinitis'
  },
  {
    id: 'PT-52901',
    name: 'Carlos Mendoza',
    age: 36,
    gender: 'Male',
    bloodGroup: 'B-',
    phone: '+1 (555) 782-9901',
    email: 'c.mendoza@metrohealth.org',
    address: '501 Columbus Way, Metro City, NY 10007',
    emergencyContact: 'Sofia Mendoza (Sister) - +1 (555) 782-9904',
    allergies: 'None reported',
    chronicConditions: 'Chronic Migraine with Visual Aura'
  },
  {
    id: 'PT-66104',
    name: 'Beatrice Woods',
    age: 63,
    gender: 'Female',
    bloodGroup: 'O-',
    phone: '+1 (555) 304-8199',
    email: 'b.woods@metrohealth.org',
    address: '89 Riverside Drive, Metro City, NY 10012',
    emergencyContact: 'Arthur Woods (Son) - +1 (555) 304-8190',
    allergies: 'Sulfa Drugs',
    chronicConditions: 'Osteoarthritis (Bilateral Knees), Type 2 Diabetes'
  },
  {
    id: 'PT-77299',
    name: 'Dev Patel',
    age: 29,
    gender: 'Male',
    bloodGroup: 'B+',
    phone: '+1 (555) 890-1122',
    email: 'd.patel@metrohealth.org',
    address: '33 Grand St, Metro City, NY 10013',
    emergencyContact: 'Sunita Patel (Mother) - +1 (555) 890-1120',
    allergies: 'None',
    chronicConditions: 'Exercise-Induced Bronchospasm'
  }
];

export const INITIAL_NOTIFICATIONS = [
  {
    id: 'NOTIF-01',
    title: 'Appointment Confirmed',
    description: 'Dr. Sarah Jenkins confirmed your consultation for tomorrow, Sep 28 at 09:30 AM.',
    type: 'appointment',
    timestamp: '15 mins ago'
  },
  {
    id: 'NOTIF-02',
    title: 'Emergency Blood Request Logged',
    description: 'Request for 2 units of O+ blood at Metro General Hospital is pending clinical verification.',
    type: 'emergency',
    timestamp: '1 hour ago'
  },
  {
    id: 'NOTIF-03',
    title: 'Diagnostic Record Added',
    description: 'Dr. Robert Chen uploaded standard laboratory panel documentation to your profile.',
    type: 'document',
    timestamp: 'Yesterday at 04:30 PM'
  },
  {
    id: 'NOTIF-04',
    title: 'Facility Protocol Advisory',
    description: 'Metro General Hospital masking protocols updated for ambulatory outpatient suites.',
    type: 'system',
    timestamp: '2 days ago'
  }
];

export const INITIAL_DOCUMENTS = [
  {
    id: 'DOC-FILE-01',
    fileName: 'Vascular_Screening_Report_Sep2026.pdf',
    fileSize: '1.4 MB',
    fileType: 'PDF Document',
    uploadedAt: '2026-09-20',
    category: 'Diagnostic Report',
    doctor: 'Dr. Sarah Jenkins'
  },
  {
    id: 'DOC-FILE-02',
    fileName: 'Resting_12Lead_ECG_Trace.png',
    fileSize: '680 KB',
    fileType: 'Medical Image',
    uploadedAt: '2026-08-25',
    category: 'Cardiology ECG',
    doctor: 'Dr. Sarah Jenkins'
  },
  {
    id: 'DOC-FILE-03',
    fileName: 'Prescription_Refill_Authorization.pdf',
    fileSize: '340 KB',
    fileType: 'Prescription',
    uploadedAt: '2026-07-14',
    category: 'Prescription',
    doctor: 'Dr. Robert Chen'
  }
];
