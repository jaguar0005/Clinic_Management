# PulsePoint Health — Unified Patient, Clinic & Emergency Coordination Platform

**FITFEST2026 Solo 4-Hour Hackathon MVP**  
*Track: Patient & Emergency Management System*  
*Target Deployment: Google Cloud Run (Containerized SPA via Node/Express)*

---

## 1. Project Overview

**PulsePoint Health** is a clinical-grade coordination platform designed to unify patient engagement, outpatient clinic scheduling, and urgent emergency dispatch into one cohesive, synchronized interface. 

Built specifically for the FITFEST2026 Hackathon, this MVP replaces disjointed hospital tools with an intuitive, calm, and high-contrast system. All state transitions (such as booking appointments, requesting urgent blood units, tracking live ambulances, and staff clinical verifications) are synchronized in-memory via React's Context API so that actions performed in the **Staff Portal** instantly reflect in the **Patient Portal** without requiring a remote database or backend server.

---

## 2. Tech Stack

- **Frontend Core:** React 19 + Vite 8
- **Styling:** Tailwind CSS v4 (configured with a strict clinical color palette and typography tokens)
- **Routing:** React Router v7 (`react-router-dom`) with HTML5 History API fallback
- **State Management:** React Context API (`AppContext.jsx`) managing shared state across both portals
- **Interactive Geospatial Map:** Leaflet.js with OpenStreetMap tiles, utilizing custom SVG/HTML dot markers (no default red pins)
- **Icons:** `lucide-react` (monochrome line icons only; **strictly zero emojis**)
- **Deployment Server:** Node.js + Express 5 static server supporting containerized deployment on Google Cloud Run
- **Containerization:** Multi-stage `Dockerfile` (Node 22 Alpine builder + minimal runner)

---

## 3. Strict Clinical Design System

The application strictly implements a healthcare SaaS visual language (inspired by hospital scheduling interfaces and high-trust clinical tools):

### Color Tokens
| Name | Hex Code | Usage |
| :--- | :--- | :--- |
| **Primary Green** | `#0F7A4C` | Primary buttons, active navigation, confirmed states, brand accents |
| **Secondary Green** | `#E6F4EC` | Background fills, subtle hover states, verified badge highlights |
| **Base White** | `#FFFFFF` | Clean canvas background, card surfaces |
| **Emergency Red** | `#C4302B` | Critical actions, active ambulance sirens, urgent alerts (never decorative) |
| **Neutral Text** | `#1A1A1A` | Primary typography, headers, high-contrast readability |
| **Muted Text** | `#5C5C5C` | Secondary labels, timestamps, metadata |
| **Border Divider** | `#E5E5E5` | Crisp 1px structural dividing lines |
| **Card / Alt BG** | `#F7F7F7` | Form inputs, table headers, secondary stat backgrounds |

> **Design Constraints:** No purple/indigo/violet gradients, no glassmorphism, no neon glows, and no emojis anywhere in the interface.

---

## 4. Key Features & Portal Architecture

```
/
├── Welcome / Portal Role Selector (LoginPortal)
├── /patient (Patient Portal)
│   ├── /patient                 → Dashboard (Greeting, Next Appt, 3 Emergency Buttons, Alerts)
│   ├── /patient/appointments    → Appointments (Filter, 3-Step Booking Flow, Cancel Action)
│   ├── /patient/blood-request   → Urgent Blood Requisition (Form, Status Stepper, Depot Inventory)
│   ├── /patient/ambulance       → Ambulance Dispatch (Form, Live Countdown ETA, 4.5s Auto-Advancing Stepper)
│   ├── /patient/map             → Regional Healthcare Map (Leaflet, Dot Markers, Directions)
│   └── /patient/documents       → Uploaded Documents (Image/PDF Upload, Previews, Metadata)
└── /staff (Physician & Clinic Coordination Portal)
    ├── /staff                   → Staff Dashboard (Today's Appts, Blood & Ambulance Stats, Weekly Schedule Grid)
    ├── /staff/patients          → Patient Directory (Search, Demographics, Clinical History Drawer)
    ├── /staff/appointments      → Caseload Intake (Table with Status Dropdown Updates)
    ├── /staff/emergency         → Emergency Center (MD Verification Queue & Ambulance Telemetry)
    └── /staff/map               → Facility & EMS Dispatch Map
```

### A. Patient Portal
1. **Patient Dashboard:**
   - Preloaded profile for **Marcus Vance** (MRN: `PT-89412`, Blood Group: `O+`).
   - **Next Appointment Card:** Shows upcoming cardiology follow-up with Dr. Sarah Jenkins, date/time, ward location, and status pill.
   - **Emergency Quick-Access Panel:** 3 distinct action cards (Request Blood, Request Ambulance, Find Facility).
   - **Live Emergency Status Banners:** Dynamically display active ambulance transit or blood requests currently in progress.
   - **Recent Notifications:** Seeded clinical advisories and updates with timestamps.

2. **Appointments:**
   - Filter by "All", "Upcoming", or "Past/Completed".
   - **Multi-step Booking Flow:** Select Physician (specialty, rating, next available) → Select Date & Time Slot → Enter Consultation Reason → Instant Confirmation.
   - New bookings immediately enter the queue with status `"Requested"`.
   - Built-in cancellation action updates status to `"Cancelled"`.

3. **Urgent Blood Requisition:**
   - Clinical requisition form specifying patient, blood group dropdown (`O+`, `O-`, `A+`, `A-`, `B+`, `B-`, `AB+`, `AB-`), units required, receiving hospital, and target date/time.
   - **Live Status Stepper:** `Submitted → Doctor Verified → Searching → Availability Found`.
   - **Static Blood Depot Inventory Table:** Live reported counts across 4 regional blood repositories, with the mandatory clinical disclaimer: *"Availability is reported information and may change."*

4. **Emergency Ambulance Dispatch:**
   - Rapid response form with auto-filled patient address and triage notes.
   - **Live Telemetry Stepper:** `Requested → Assigned → Dispatched → Arriving → Completed`.
   - **Countdown ETA Simulation:** Automatically counts down minutes and seconds; state automatically advances every **4.5 seconds** via `setInterval` to demonstrate live vehicle movement for hackathon judges.

5. **Healthcare Map:**
   - Leaflet.js OpenStreetMap centered on Metro City.
   - Color-coded dot markers: Green (Hospitals), Blue (Clinics), Red (Blood Depots), Amber (Ambulances).
   - Interactive facility detail drawer with clinical specialties, contact numbers, hours, and direct Google Maps routing integration.

6. **Uploaded Documents:**
   - File upload supporting medical images (PNG/JPEG) and PDF reports.
   - Client-side `FileReader` thumbnail preview generation.
   - Document metadata list with timestamps, file sizes, and authorized clinician review status.

---

### B. Staff & Physician Hub (Doctor + Admin Combined)
1. **Staff Dashboard:**
   - Summary stat cards: *Today's Appointments*, *Pending Blood Verifications*, *Active Ambulance Requests*, and *Currently Checked-In*.
   - **High-Priority Weekly Schedule Grid:** A responsive 7-day calendar (Mon Sep 28 – Sun Oct 04) showing appointments across hourly slots (08:00 AM – 05:00 PM), color-coded by clinical status.
   - Clicking any appointment card opens a popover to inspect notes and update appointment status on the fly.

2. **Patient Directory:**
   - Searchable by patient name, MRN, or chronic condition.
   - Filterable by blood group.
   - Click "View Profile" to open a comprehensive medical profile drawer showing emergency contacts, allergies, appointment histories, and uploaded diagnostic scans.

3. **Appointment Caseload Management:**
   - Complete table with instant inline dropdown status updates (`Requested → Confirmed → Checked-In → Completed → Cancelled`).
   - Updates the shared state in real-time, instantly reflecting on the patient's view.

4. **Emergency Coordination Center:**
   - **Blood Requisitions Queue:** Review pending blood requests submitted by patients. Physicians can click **"Verify Requirement (Approve)"** to approve the demand, or **"Request Correction"**.
   - **Active Ambulance Telemetry:** Monitor vehicle routing, destination hospital, triage notes, and estimated arrival in real-time.
   - **Shared State Verification:** Approving a blood request here immediately updates the stepper on the patient's screen to **"Doctor Verified"**.

---

## 5. Directory Structure

```
c:\Users\gaurj\OneDrive\SEM-5\Flora_Hackathon\
├── Dockerfile                  # Multi-stage production container for Cloud Run
├── .dockerignore               # Optimized Docker build context exclusions
├── server.js                   # Express static SPA server with routing fallback
├── package.json                # Dependencies and scripts (dev, build, start, lint)
├── vite.config.js              # Vite configuration with Tailwind CSS plugin
├── index.html                  # HTML entry point with Inter font and clinical metadata
├── src/
│   ├── main.jsx                # Application bootstrap
│   ├── App.jsx                 # Route definitions and layout assembly
│   ├── index.css               # Design tokens, Leaflet map styling, and base CSS
│   ├── context/
│   │   └── AppContext.jsx      # Shared reactive state, booking, verification & auto-stepper
│   ├── data/
│   │   └── seedData.js         # Realistic seed data for patients, doctors, blood banks, maps
│   ├── components/
│   │   ├── HealthcareMap.jsx   # Leaflet map with custom colored dot markers
│   │   ├── WeeklyCalendar.jsx  # Weekly schedule grid for staff dashboard
│   │   ├── Stepper.jsx         # Clinical stepper for blood and ambulance tracking
│   │   ├── StatusPill.jsx      # Colored dot badge component
│   │   ├── StatCard.jsx        # Summary KPI cards
│   │   ├── Sidebar.jsx         # Left navigation (collapsible to bottom nav on mobile)
│   │   ├── TopBar.jsx          # Header with user role toggle and quick actions
│   │   └── PortalLayout.jsx    # Standard wrapper for authenticated views
│   └── pages/
│       ├── LoginPortal.jsx     # Welcome & portal role selector
│       ├── patient/
│       │   ├── PatientDashboard.jsx
│       │   ├── PatientAppointments.jsx
│       │   ├── BloodRequest.jsx
│       │   ├── AmbulanceRequest.jsx
│       │   ├── HealthcareMapPage.jsx
│       │   └── PatientDocuments.jsx
│       └── staff/
│           ├── StaffDashboard.jsx
│           ├── StaffPatients.jsx
│           ├── StaffAppointments.jsx
│           ├── StaffEmergency.jsx
│           └── StaffMapPage.jsx
```

---

## 6. How to Run Locally

### Prerequisites
- Node.js (v18, v20, or v22)
- npm (v9+)

### Installation
```bash
# Clone or navigate to the repository directory
cd Flora_Hackathon

# Install dependencies
npm install
```

### Start Development Server
```bash
npm run dev
```
Open [http://localhost:5173](http://localhost:5173) in your browser.

### Run Production Server Locally
```bash
# Build the optimized production bundle
npm run build

# Start the Express server
npm start
```
Open [http://localhost:8080](http://localhost:8080) in your browser.

---

## 7. Google Cloud Run Deployment

The project is pre-configured with a production-ready `Dockerfile` and `server.js` that listens on `process.env.PORT` (as required by Google Cloud Run).

### Build & Deploy with Google Cloud CLI:
```bash
# 1. Set your GCP project ID
gcloud config set project YOUR_PROJECT_ID

# 2. Build and deploy directly to Cloud Run
gcloud run deploy pulsepoint-health \
  --source . \
  --platform managed \
  --region us-central1 \
  --allow-unauthenticated \
  --port 8080
```

---

## 8. 3-Minute Demo Walkthrough Script (For Judges)

1. **Role Selection (`/`):**
   - Start on the landing screen. Point out the clinical aesthetic (calm greens, high-contrast neutrals, zero distracting AI templates/emojis).
   - Click **"Continue as Patient"**.

2. **Patient Experience (`/patient`):**
   - Note the personalized greeting for **Marcus Vance**, his upcoming Cardiology appointment, and the 3 Emergency Quick-Access buttons.
   - Navigate to **Appointments (`/patient/appointments`)**: Click **"Book Appointment"**, select a physician (e.g. Dr. Robert Chen), choose a slot, and click Confirm. Show the new booking immediately appearing with status `"Requested"`.
   - Navigate to **Blood Request (`/patient/blood-request`)**: Show the form pre-filled with Marcus's `O+` profile, submit a request, and show the **Stepper** initialized at `"Submitted"`. Scroll down to highlight the static blood bank inventory table and disclaimer line.
   - Navigate to **Ambulance Request (`/patient/ambulance`)**: Point out the live countdown ETA and explain that the status stepper automatically advances every 4.5 seconds to simulate live paramedic telemetry.
   - Navigate to **Healthcare Map (`/patient/map`)**: Show the Leaflet map with custom colored dots for hospitals, clinics, blood reserves, and ambulances. Click a hospital to view specialties and the "Get Directions" link.

3. **Staff Coordination & Shared State Sync (`/staff`):**
   - Click the topbar **"Switch to Staff View"** button.
   - Point out the **Stat Cards** and the **Weekly Schedule Grid** displaying appointments across time slots. Click an appointment block to inspect and change its status.
   - Navigate to **Emergency Center (`/staff/emergency`)**:
     - Find the blood request that was just submitted in the Patient portal.
     - Click **"Verify Requirement (Approve)"** — the status turns to `"Doctor Verified"`.
   - Click **"Switch to Patient View"** and navigate back to **Blood Request**: Show that the patient's stepper now displays `"Doctor Verified"` in real time!
