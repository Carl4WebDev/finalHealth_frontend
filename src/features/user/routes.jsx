import { Routes, Route } from "react-router-dom";
import Dashboard from "./pages/dashboard/Dashboard";
import DoctorSchedule from "./pages/doctor-schedule/DoctorSchedule";
import Patients from "./pages/patients/Patients";
import SubscriptionView from "./pages/subscription/SubscriptionView";
import ProfileView from "./pages/profile/ProfileView";
import CreateAppointment from "./pages/appointments-2/CreateAppointment";
import RegisterPatient from "./pages/appointments-2/RegisterPatient";
import MedicalHistoryPage from "./pages/patients/pages/MedicalHistoryPage";
import AppointmentsPage from "./pages/appointments/AppointmentsPage";

import ClinicDoctorMngPage from "./pages/doctor-schedule/ClinicDoctorMngPage";
import ManageDoctorPage from "./pages/doctor-schedule/doctor-related/pages/ManageDoctorPage";
import ManageClinicPage from "./pages/doctor-schedule/clinic-related/pages/ManageClinicPage";

import PatientInfo from "./pages/patients/pages/PatientInfo";
import MedicalHistoryInfo from "./pages/patients/pages/MedicalHistoryInfo";
import DiagnosisTreatmentManagement from "./pages/patients/DiagnosisTreatmentManagement";

import { AppointmentProvider } from "./context/appointments/AppointmentProvider";
import { DoctorProvider } from "./context/doctors/DoctorProvider";
import { ClinicProvider } from "./context/clinics/ClinicProvider";
import { QueueProvider } from "./context/queues/QueueProvider";
import { PatientProvider } from "./context/patients/PatientProvider";
import { DoctorSessionProvider } from "./context/doctor-sessions/DoctorSessionProvider";
import { SubscriptionProvider } from "./context/subscriptions/SubscriptionProvider";
import { MedicalRecordsProvider } from "./context/medical-records/MedicalRecordsProvider";
import { UserProvider } from "./context/users/UserProvider";
import { DashboardProvider } from "./context/dashboard/DashboardProvider";
import {DiagnosisTreatmentProvider} from "./context/diagnosis-treatments/DiagnosisTreatmentProvider"
import VisitHistoryDetails from "./pages/patients/pages/VisitHistoryDetails";

import VisiDetails from "./pages/patients/pages/VisitDetails"

export default function UserRoutes() {
  return (
    <DiagnosisTreatmentProvider>

      <DashboardProvider>
        <UserProvider>
          <MedicalRecordsProvider>
            <SubscriptionProvider>
              <DoctorSessionProvider>
                <QueueProvider>
                  <PatientProvider>
                    <ClinicProvider>
                      <DoctorProvider>
                        <AppointmentProvider>
                          <Routes>
                            <Route path="/dashboard" element={<Dashboard />} />

                            <Route
                              path="/appointments"
                              element={<AppointmentsPage />}
                            />
                            <Route
                              path="/appointments/create"
                              element={<CreateAppointment />}
                            />

                            <Route
                              path="/appointments/create-patient"
                              element={<RegisterPatient />}
                            />

                            <Route
                              path="/doctor-clinic-management"
                              element={<ClinicDoctorMngPage />}
                            />

                            <Route
                              path="/manage-doctor/:doctorId"
                              element={<ManageDoctorPage />}
                            />
                            <Route
                              path="/manage-clinic/:clinicId"
                              element={<ManageClinicPage />}
                            />

                            <Route path="/patients" element={<Patients />} />

                            {/*  */}
                            <Route
                              path="/patients/:patientId"
                              element={<PatientInfo />}
                            />
                            <Route
                              path="/patients/:patientId/records/:recordId"
                              element={<MedicalHistoryInfo />}
                            />
                            <Route
                               path="/patients/:patientId/visit-history/:visitId"
                              element={<VisiDetails />}
                            />
                            <Route
  path="/patients/management"
  element={<DiagnosisTreatmentManagement />}
/>
                            {/*  */}

                            <Route
                              path="/subscription"
                              element={<SubscriptionView />}
                            />

                            <Route path="/profile" element={<ProfileView />} />
                          </Routes>
                        </AppointmentProvider>
                      </DoctorProvider>
                    </ClinicProvider>
                  </PatientProvider>
                </QueueProvider>
              </DoctorSessionProvider>
            </SubscriptionProvider>
          </MedicalRecordsProvider>
        </UserProvider>
      </DashboardProvider>
    </DiagnosisTreatmentProvider>
  );
}
