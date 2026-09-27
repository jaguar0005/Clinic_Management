import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  CURRENT_PATIENT,
  SEEDED_DOCTORS,
  INITIAL_APPOINTMENTS,
  SEEDED_BLOOD_BANKS,
  INITIAL_BLOOD_REQUESTS,
  INITIAL_AMBULANCE_REQUESTS,
  SEEDED_FACILITIES,
  SEEDED_PATIENTS,
  INITIAL_NOTIFICATIONS,
  INITIAL_DOCUMENTS
} from '../data/seedData';
import {
  authenticateUser,
  registerUser,
  getStoredSession,
  clearStoredSession,
  getDatabaseUsers,
  getStoredPatients,
  saveNewPatient,
  getStoredFacilities,
  saveStoredFacilities,
  getStoredAppointments,
  saveStoredAppointments
} from '../services/db';
import {
  saveDocumentToDb,
  getAllStoredDocuments,
  getCachedDocuments
} from '../services/documentDb';

const AppContext = createContext(null);

// Helper to convert date and time string ("2026-09-28", "09:30 AM") into timestamp (minutes)
export const getAppointmentMinutes = (dateStr, timeStr) => {
  try {
    const [timePart, modifier] = timeStr.trim().split(' ');
    let [hours, minutes] = timePart.split(':').map(Number);
    if (modifier === 'PM' && hours < 12) hours += 12;
    if (modifier === 'AM' && hours === 12) hours = 0;

    const [year, month, day] = dateStr.split('-').map(Number);
    const d = new Date(year, month - 1, day, hours, minutes, 0, 0);
    return Math.floor(d.getTime() / (1000 * 60));
  } catch {
    return 0;
  }
};

export const AppProvider = ({ children }) => {
  // Session / Authentication state
  const [currentUser, setCurrentUser] = useState(() => {
    const session = getStoredSession();
    if (session) return session;
    // Default fallback to Marcus Vance (Patient)
    return {
      id: 'USR-PAT-01',
      email: 'patient@metrohealth.org',
      name: 'Marcus Vance',
      role: 'patient',
      patientId: 'PT-89412',
      bloodGroup: 'O+',
      token: 'jwt_default_session'
    };
  });

  const [userRole, setUserRole] = useState(() => currentUser?.role || 'patient');

  // Compute active patient profile dynamically from currentUser so newly registered patients get their own profile!
  const activePatient = currentUser?.role === 'patient'
    ? {
        id: currentUser.patientId || currentUser.id,
        name: currentUser.name,
        age: currentUser.age || 38,
        gender: currentUser.gender || 'Patient',
        bloodGroup: currentUser.bloodGroup || 'O+',
        phone: currentUser.phone || '+1 (555) 234-8901',
        email: currentUser.email,
        address: currentUser.address || '742 Evergreen Terrace, Metro City',
        emergencyContact: currentUser.emergencyContact || 'Emergency Contact On File',
        allergies: currentUser.allergies || 'None reported',
        chronicConditions: currentUser.chronicConditions || 'General observation'
      }
    : CURRENT_PATIENT;

  const [appointments, setAppointments] = useState(() => getStoredAppointments(INITIAL_APPOINTMENTS));
  const [bloodRequests, setBloodRequests] = useState(INITIAL_BLOOD_REQUESTS);
  const [ambulanceRequests, setAmbulanceRequests] = useState(INITIAL_AMBULANCE_REQUESTS);
  const [documents, setDocuments] = useState(() => {
    const cached = getCachedDocuments();
    return cached.length > 0 ? cached : INITIAL_DOCUMENTS;
  });
  const [notifications, setNotifications] = useState(INITIAL_NOTIFICATIONS);
  const [patients, setPatients] = useState(() => getStoredPatients(SEEDED_PATIENTS));
  const [doctors] = useState(SEEDED_DOCTORS);
  const [bloodBanks] = useState(SEEDED_BLOOD_BANKS);
  const [facilities, setFacilities] = useState(() => getStoredFacilities(SEEDED_FACILITIES));

  // Hydrate documents from persistent database asynchronously
  useEffect(() => {
    getAllStoredDocuments(INITIAL_DOCUMENTS).then(docs => {
      if (docs && docs.length > 0) {
        setDocuments(docs);
      }
    });
  }, []);

  // Sync role when currentUser changes
  useEffect(() => {
    if (currentUser?.role) {
      setUserRole(currentUser.role);
    }
  }, [currentUser]);

  // Auto-advance simulation for active ambulance requests
  useEffect(() => {
    const interval = setInterval(() => {
      setAmbulanceRequests(prevRequests => {
        let changed = false;
        const updated = prevRequests.map(req => {
          if (req.status === 'Requested') {
            changed = true;
            return { ...req, status: 'Assigned', etaMinutes: 9, unitId: 'EMS Unit 04' };
          } else if (req.status === 'Assigned') {
            changed = true;
            return { ...req, status: 'Dispatched', etaMinutes: 6 };
          } else if (req.status === 'Dispatched') {
            changed = true;
            return { ...req, status: 'Arriving', etaMinutes: 2 };
          } else if (req.status === 'Arriving') {
            changed = true;
            return { ...req, status: 'Completed', etaMinutes: 0 };
          }
          return req;
        });

        return changed ? updated : prevRequests;
      });
    }, 4500);

    return () => clearInterval(interval);
  }, []);

  // Authentication handlers
  const login = (email, password) => {
    const result = authenticateUser(email, password);
    if (result.success) {
      setCurrentUser(result.user);
      setUserRole(result.user.role);
    }
    return result;
  };

  const register = (data) => {
    const result = registerUser(data);
    if (result.success) {
      setCurrentUser(result.user);
      setUserRole(result.user.role);
      // Immediately refresh patient registry so Doctor and Admin see the newly registered patient!
      setPatients(getStoredPatients(SEEDED_PATIENTS));
    }
    return result;
  };

  const logout = () => {
    clearStoredSession();
    setCurrentUser(null);
    setUserRole(null);
  };

  const switchUser = (role, customUserData = {}) => {
    let mockUser = null;
    if (role === 'patient') {
      mockUser = {
        id: 'USR-PAT-01',
        email: 'patient@metrohealth.org',
        name: 'Marcus Vance',
        role: 'patient',
        patientId: 'PT-89412',
        bloodGroup: 'O+',
        ...customUserData
      };
    } else if (role === 'doctor') {
      // Default to Dr. Sarah Jenkins (DOC-01) or provided doctor
      mockUser = {
        id: customUserData.id || 'USR-DOC-01',
        email: customUserData.email || 'jenkins@metrohealth.org',
        name: customUserData.name || 'Dr. Sarah Jenkins, MD',
        role: 'doctor',
        doctorId: customUserData.doctorId || 'DOC-01',
        specialization: customUserData.specialization || 'Cardiology',
        hospital: customUserData.hospital || 'Metro General Hospital',
        ...customUserData
      };
    } else if (role === 'admin') {
      mockUser = {
        id: 'USR-ADM-01',
        email: 'admin@metrohealth.org',
        name: 'Clinical Operations Director',
        role: 'admin',
        department: 'Hospital Administration & Emergency Oversight',
        ...customUserData
      };
    }

    if (mockUser) {
      setCurrentUser(mockUser);
      setUserRole(mockUser.role);
      try {
        localStorage.setItem('pulsepoint_session', JSON.stringify(mockUser));
      } catch {}
    }
  };

  // Facility management (Admin can add new hospital / clinic on map)
  const addFacility = (newFac) => {
    const facility = {
      id: `FAC-${Date.now()}`,
      name: newFac.name,
      type: newFac.type || 'hospital',
      lat: Number(newFac.lat) || 40.7150,
      lng: Number(newFac.lng) || -74.0050,
      address: newFac.address || 'Metro City Center',
      distance: newFac.distance || '1.8 km',
      specialties: newFac.specialties || 'Comprehensive Care & Diagnostics',
      phone: newFac.phone || '+1 (555) 010-2200',
      emergencyBeds: Number(newFac.emergencyBeds) || 6,
      operatingHours: newFac.operatingHours || '24 Hours / 7 Days'
    };

    setFacilities(prev => {
      const updated = [facility, ...prev];
      saveStoredFacilities(updated);
      return updated;
    });

    const newNotif = {
      id: `NOTIF-${Date.now()}`,
      title: 'Facility Registry Updated',
      description: `New ${facility.type}: ${facility.name} added to regional health map.`,
      type: 'system',
      timestamp: 'Just now'
    };
    setNotifications(prev => [newNotif, ...prev]);

    return facility;
  };

  // Appointment validation and booking
  const bookAppointment = (data) => {
    const newMins = getAppointmentMinutes(data.date, data.time);
    const activePatientId = currentUser?.patientId || activePatient.id;
    const activePatientName = currentUser?.name || activePatient.name;
    const activePatientEmail = currentUser?.email || activePatient.email;

    // Rule 1: Patient cannot book two appointments with less than 1-hour (60 mins) difference on the same date
    const patientConflict = appointments.find(apt => {
      if (apt.status === 'Cancelled') return false;
      if (apt.date !== data.date) return false;
      if (apt.patientId !== activePatientId) return false;

      const existingMins = getAppointmentMinutes(apt.date, apt.time);
      const diff = Math.abs(newMins - existingMins);
      return diff < 60; // Less than 60 minutes apart
    });

    if (patientConflict) {
      return {
        success: false,
        error: `Schedule conflict: You already have an appointment with ${patientConflict.doctorName} at ${patientConflict.time} on ${data.date}. Clinic policy requires at least a 1-hour interval between appointments.`
      };
    }

    // Rule 2: Doctor cannot have two overlapping appointments within 60 minutes
    const doctorConflict = appointments.find(apt => {
      if (apt.status === 'Cancelled') return false;
      if (apt.date !== data.date) return false;
      if (apt.doctorId !== data.doctorId) return false;

      const existingMins = getAppointmentMinutes(apt.date, apt.time);
      const diff = Math.abs(newMins - existingMins);
      return diff < 60;
    });

    if (doctorConflict) {
      return {
        success: false,
        error: `Physician unavailable: ${data.doctorName} is already booked at ${doctorConflict.time} on ${data.date}. Please select a slot separated by at least 1 hour.`
      };
    }

    const newAppointment = {
      id: `APT-${Math.floor(1000 + Math.random() * 9000)}`,
      patientId: activePatientId,
      patientName: activePatientName,
      patientEmail: activePatientEmail,
      doctorId: data.doctorId,
      doctorName: data.doctorName,
      specialization: data.specialization,
      hospital: data.hospital,
      date: data.date,
      time: data.time,
      status: 'Requested',
      type: data.type || 'Clinical Consultation',
      notes: data.notes || 'Booked via patient coordination portal.',
      cancellationReason: null,
      cancelledBy: null,
      createdAt: new Date().toISOString()
    };

    setAppointments(prev => {
      const updated = [newAppointment, ...prev];
      saveStoredAppointments(updated);
      return updated;
    });

    // Push notification
    const newNotif = {
      id: `NOTIF-${Date.now()}`,
      title: 'Appointment Requested',
      description: `Appointment with ${data.doctorName} for ${data.date} at ${data.time} submitted for physician confirmation.`,
      type: 'appointment',
      timestamp: 'Just now'
    };
    setNotifications(prev => [newNotif, ...prev]);

    return { success: true, appointment: newAppointment };
  };

  // One-way status progression rule:
  // Requested -> Confirmed -> Checked-In -> Completed
  // Cancelled is irreversible! Once cancelled, no other status can be set.
  // Confirmed cannot go back to Requested. Checked-In cannot go back to Confirmed.
  const updateAppointmentStatus = (appointmentId, newStatus) => {
    setAppointments(prev => {
      const updated = prev.map(apt => {
        if (apt.id !== appointmentId) return apt;

        // If already cancelled or completed, it is terminal and cannot be changed!
        if (apt.status === 'Cancelled' || apt.status === 'Completed') {
          return apt;
        }

        // Prevent moving backwards
        if (apt.status === 'Confirmed' && newStatus === 'Requested') return apt;
        if (apt.status === 'Checked-In' && (newStatus === 'Confirmed' || newStatus === 'Requested')) return apt;

        return { ...apt, status: newStatus };
      });
      saveStoredAppointments(updated);
      return updated;
    });
  };

  // Cancel appointment: Patients can ONLY cancel their own appointment!
  const cancelAppointment = (appointmentId, reasonNote, cancelledBy) => {
    const activePatientId = currentUser?.patientId || activePatient.id;

    setAppointments(prev => {
      const updated = prev.map(apt => {
        if (apt.id !== appointmentId) return apt;
        // Cannot cancel if already completed
        if (apt.status === 'Completed') return apt;

        // If caller is patient, ensure they own this appointment!
        if (currentUser?.role === 'patient') {
          const isOwn = apt.patientId === activePatientId ||
                        (currentUser?.email && apt.patientEmail?.toLowerCase() === currentUser.email.toLowerCase()) ||
                        (currentUser?.name && apt.patientName?.toLowerCase() === currentUser.name.toLowerCase());
          if (!isOwn) {
            console.warn('Unauthorized: Patient can only cancel their own appointment.');
            return apt;
          }
        }

        return {
          ...apt,
          status: 'Cancelled',
          cancellationReason: reasonNote || 'Appointment cancelled by patient/clinic.',
          cancelledBy: cancelledBy || currentUser?.name || 'Patient'
        };
      });
      saveStoredAppointments(updated);
      return updated;
    });
  };

  // Blood request actions with doctor assignment & automated progression
  const createBloodRequest = (data) => {
    const newRequest = {
      id: `BLD-${Math.floor(400 + Math.random() * 599)}`,
      patientName: data.patientName || currentUser?.name || activePatient.name,
      bloodGroup: data.bloodGroup,
      units: Number(data.units),
      hospital: data.hospital,
      doctorId: data.doctorId,
      doctorName: data.doctorName,
      requiredBy: data.requiredBy,
      contact: data.contact,
      urgency: data.urgency || 'High',
      status: 'Submitted', // Submitted -> Doctor Verified -> Searching -> Availability Found
      createdAt: 'Just now',
      notes: data.notes || 'Emergency replenishment requirement recorded.'
    };

    setBloodRequests(prev => [newRequest, ...prev]);

    const newNotif = {
      id: `NOTIF-${Date.now()}`,
      title: 'Blood Requirement Registered',
      description: `Request for ${data.units} units of ${data.bloodGroup} assigned to ${data.doctorName} for clinical verification.`,
      type: 'emergency',
      timestamp: 'Just now'
    };
    setNotifications(prev => [newNotif, ...prev]);

    return newRequest;
  };

  // When doctor verifies requirement:
  // 1. Move immediately to 'Doctor Verified'
  // 2. Automatically advance to 'Searching' after 3.5s
  // 3. Automatically advance to 'Availability Found' after another 4.5s
  const verifyBloodRequest = (requestId) => {
    setBloodRequests(prev =>
      prev.map(req => (req.id === requestId ? { ...req, status: 'Doctor Verified' } : req))
    );

    // Auto-advance to Searching
    setTimeout(() => {
      setBloodRequests(prev =>
        prev.map(req => {
          if (req.id === requestId && req.status === 'Doctor Verified') {
            return { ...req, status: 'Searching' };
          }
          return req;
        })
      );

      // Auto-advance to Availability Found
      setTimeout(() => {
        setBloodRequests(prev =>
          prev.map(req => {
            if (req.id === requestId && req.status === 'Searching') {
              return { ...req, status: 'Availability Found' };
            }
            return req;
          })
        );
      }, 4500);
    }, 3500);
  };

  const requestBloodCorrection = (requestId, note) => {
    setBloodRequests(prev =>
      prev.map(req =>
        req.id === requestId
          ? {
              ...req,
              status: 'Correction Requested',
              notes: note ? `${req.notes ? req.notes + ' | ' : ''}Correction Requested: ${note}` : req.notes
            }
          : req
      )
    );
  };

  // Ambulance request actions
  const createAmbulanceRequest = (data) => {
    const newAmbulance = {
      id: `AMB-${Math.floor(800 + Math.random() * 199)}`,
      patientName: data.patientName || currentUser?.name || activePatient.name,
      pickupLocation: data.pickupLocation,
      destination: data.destination,
      contact: data.contact,
      notes: data.notes || 'Emergency dispatch requested.',
      status: 'Requested',
      unitId: 'Pending Assignment',
      etaMinutes: 12,
      requestedAt: 'Just now',
      driverContact: 'Pending'
    };

    setAmbulanceRequests(prev => [newAmbulance, ...prev]);

    const newNotif = {
      id: `NOTIF-${Date.now()}`,
      title: 'Ambulance Dispatched Alert',
      description: `Emergency transit requested from ${data.pickupLocation}. Dispatch queued.`,
      type: 'emergency',
      timestamp: 'Just now'
    };
    setNotifications(prev => [newNotif, ...prev]);

    return newAmbulance;
  };

  // Document upload with persistent database storage
  const uploadDocument = async (docFile) => {
    const activePatientId = currentUser?.patientId || activePatient.id;
    const activePatientName = currentUser?.name || activePatient.name;

    const newDoc = {
      id: `DOC-FILE-${Date.now()}`,
      fileName: docFile.name,
      fileSize: `${(docFile.size / 1024).toFixed(0)} KB`,
      fileType: docFile.type?.includes('image') ? 'Medical Image' : 'Clinical Record',
      uploadedAt: new Date().toISOString().split('T')[0],
      category: 'Patient Diagnostic Upload',
      doctor: 'Dr. Sarah Jenkins, MD',
      previewUrl: docFile.previewUrl || null,
      patientId: activePatientId,
      patientName: activePatientName
    };

    await saveDocumentToDb(newDoc);
    setDocuments(prev => [newDoc, ...prev.filter(d => d.id !== newDoc.id)]);
    return newDoc;
  };

  // Administrative patient enrollment
  const enrollPatient = (data) => {
    const newPatient = {
      id: `PT-${Math.floor(10000 + Math.random() * 89999)}`,
      name: data.name,
      age: Number(data.age) || 35,
      gender: data.gender || 'Not specified',
      bloodGroup: data.bloodGroup || 'O+',
      phone: data.phone || '+1 (555) 000-0000',
      email: data.email || `patient.${Date.now()}@metrohealth.org`,
      address: data.address || '742 Evergreen Terrace, Metro City',
      emergencyContact: data.emergencyContact || 'Family Contact on File',
      allergies: data.allergies || 'None reported',
      chronicConditions: data.chronicConditions || 'General observation'
    };

    saveNewPatient(newPatient);
    setPatients(getStoredPatients(SEEDED_PATIENTS));

    const newNotif = {
      id: `NOTIF-${Date.now()}`,
      title: 'New Patient Registered',
      description: `EHR profile created for ${newPatient.name} (MRN: ${newPatient.id}).`,
      type: 'system',
      timestamp: 'Just now'
    };
    setNotifications(prev => [newNotif, ...prev]);

    return newPatient;
  };

  return (
    <AppContext.Provider
      value={{
        currentUser,
        userRole,
        setUserRole,
        login,
        register,
        logout,
        switchUser,
        currentPatient: activePatient,
        activePatient,
        appointments,
        doctors,
        bloodBanks,
        bloodRequests,
        ambulanceRequests,
        documents,
        notifications,
        patients,
        facilities,
        addFacility,
        enrollPatient,
        bookAppointment,
        cancelAppointment,
        updateAppointmentStatus,
        createBloodRequest,
        verifyBloodRequest,
        requestBloodCorrection,
        createAmbulanceRequest,
        uploadDocument
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
