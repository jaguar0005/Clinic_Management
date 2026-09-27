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
  getDatabaseUsers
} from '../services/db';

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
  const [currentPatient] = useState(CURRENT_PATIENT);
  const [appointments, setAppointments] = useState(INITIAL_APPOINTMENTS);
  const [bloodRequests, setBloodRequests] = useState(INITIAL_BLOOD_REQUESTS);
  const [ambulanceRequests, setAmbulanceRequests] = useState(INITIAL_AMBULANCE_REQUESTS);
  const [documents, setDocuments] = useState(INITIAL_DOCUMENTS);
  const [notifications, setNotifications] = useState(INITIAL_NOTIFICATIONS);
  const [patients] = useState(SEEDED_PATIENTS);
  const [doctors] = useState(SEEDED_DOCTORS);
  const [bloodBanks] = useState(SEEDED_BLOOD_BANKS);
  const [facilities] = useState(SEEDED_FACILITIES);

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

  // Appointment validation and booking
  const bookAppointment = (data) => {
    const newMins = getAppointmentMinutes(data.date, data.time);
    const activePatientId = currentUser?.patientId || currentPatient.id;

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
      patientName: currentUser?.name || currentPatient.name,
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

    setAppointments(prev => [newAppointment, ...prev]);

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
    setAppointments(prev =>
      prev.map(apt => {
        if (apt.id !== appointmentId) return apt;

        // If already cancelled or completed, it is terminal and cannot be changed!
        if (apt.status === 'Cancelled' || apt.status === 'Completed') {
          return apt;
        }

        // Prevent moving backwards
        if (apt.status === 'Confirmed' && newStatus === 'Requested') return apt;
        if (apt.status === 'Checked-In' && (newStatus === 'Confirmed' || newStatus === 'Requested')) return apt;

        return { ...apt, status: newStatus };
      })
    );
  };

  // Cancel appointment with mandatory / optional short reason note
  const cancelAppointment = (appointmentId, reasonNote, cancelledBy) => {
    setAppointments(prev =>
      prev.map(apt => {
        if (apt.id !== appointmentId) return apt;
        // Cannot cancel if already completed
        if (apt.status === 'Completed') return apt;

        return {
          ...apt,
          status: 'Cancelled',
          cancellationReason: reasonNote || 'Appointment cancelled by clinic.',
          cancelledBy: cancelledBy || currentUser?.name || 'Staff'
        };
      })
    );
  };

  // Blood request actions with doctor assignment & automated progression
  const createBloodRequest = (data) => {
    const newRequest = {
      id: `BLD-${Math.floor(400 + Math.random() * 599)}`,
      patientName: data.patientName || currentUser?.name || currentPatient.name,
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
      patientName: data.patientName || currentUser?.name || currentPatient.name,
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

  // Document upload
  const uploadDocument = (docFile) => {
    const newDoc = {
      id: `DOC-FILE-${Date.now()}`,
      fileName: docFile.name,
      fileSize: `${(docFile.size / 1024).toFixed(0)} KB`,
      fileType: docFile.type.includes('image') ? 'Medical Image' : 'Clinical Record',
      uploadedAt: new Date().toISOString().split('T')[0],
      category: 'Patient Upload',
      doctor: 'Awaiting Staff Review',
      previewUrl: docFile.previewUrl || null
    };

    setDocuments(prev => [newDoc, ...prev]);
    return newDoc;
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
        currentPatient,
        appointments,
        doctors,
        bloodBanks,
        bloodRequests,
        ambulanceRequests,
        documents,
        notifications,
        patients,
        facilities,
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
