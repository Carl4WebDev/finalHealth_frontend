import { useState } from "react";
import { ClinicContext } from "./ClinicContext.jsx";
import {
  getAllClinicsOfDoctorApi,
  getAllClinicsOfUserNotAffiliatedApi,
  createAffiliationDoctorToClinicApi,
  getClinicSessionsApi,
  deleteClinicAffiliationApi,
  getAllClinicsOfUserApi,
  getClinicInfoApi,
  createClinicSessionApi,
  updateClinicApi,
  deleteClinicSessionApi,
  createClinicApi,
} from "../../api/clinicApi.js";

export const ClinicProvider = ({ children }) => {
  const [clinics, setClinics] = useState([]);
  const [clinicInfo, setClinicInfo] = useState([]);
  const [allClinicsOfUser, setAllClinicsOfUser] = useState([]);
  const [allClinics, setAllClinics] = useState([]);
  const [clinicSessions, setClinicSessions] = useState([]);

  const [loading, setLoading] = useState(false);
  const [loadingClinicSessions, setLoadingClinicSessions] = useState(false);
  const [loadingDeleteAffiliation, setLoadingDeleteAffiliation] =
    useState(false);
  const [loadingAllClinics, setLoadingAllClinics] = useState(false);
  const [loadingClinicsInfo, setLoadingClinicsInfo] = useState(false);
  const [loadingCreateClinicSession, setLoadingCreateClinicSession] =
    useState(false);
  const [loadingDeleteClinicSession, setLoadingDeleteClinicSession] =
    useState(false);
  const [loadingCreateClinic, setLoadingCreateClinic] = useState(false);

  const [error, setError] = useState(null);

  const getAllClinicsOfDoctor = async (doctorId) => {
    setLoading(true);
    setError(null);

    const res = await getAllClinicsOfDoctorApi(doctorId);

    if (!res.ok) {
      setError(res.message);
      setLoading(false);
      return;
    }

    setClinics(res.data || []);
    setLoading(false);
  };

  //to get all the unaffilated clinics and approved clinics
  const getAllClinicsOfUserNotAffiliated = async (doctorId) => {
    setLoading(true);
    setError(null);

    const res = await getAllClinicsOfUserNotAffiliatedApi(doctorId);

    if (!res.ok) {
      setError(res.message);
      setLoading(false);
      return;
    }

    setAllClinicsOfUser(res.data || []);
    setLoading(false);
  };

  //To get all clinics pending and approved clinics of the users account
  const getAllClinicsOfUser = async () => {
    setLoadingAllClinics(true);
    setError(null);

    const res = await getAllClinicsOfUserApi();

    if (!res.ok) {
      setError(res.message);
      setLoadingAllClinics(false);
      return;
    }

    setAllClinics(res.data.clinics || []);
    setLoadingAllClinics(false);
  };

  const getClinicSessions = async (clinicId) => {
    setLoadingClinicSessions(true);
    setError(null);

    const res = await getClinicSessionsApi(clinicId);

    if (!res.ok) {
      setError(res.message);
      setLoadingClinicSessions(false);
      return;
    }

    setClinicSessions(res.data || []);
    setLoadingClinicSessions(false);
  };

  const createAffiliationDoctorToClinic = async (doctorId, clinicId, affiliationCode) => {
    setLoading(true);
    setError(null);

    const res = await createAffiliationDoctorToClinicApi(doctorId, clinicId, affiliationCode);

    if (!res.ok) {
      setError(res.message);
      setLoading(false);
      return res;
    }

    await getAllClinicsOfDoctor(doctorId);

    setLoading(false);
    return res;
  };

  const deleteClinicAffiliation = async (doctorId, clinicId) => {
    setLoadingDeleteAffiliation(true);
    setError(null);

    const res = await deleteClinicAffiliationApi(doctorId, clinicId);

    if (!res.ok) {
      setError(res.message);
      setLoadingDeleteAffiliation(false);
      return;
    }

    setLoadingDeleteAffiliation(false);
  };

  const getClinicInfo = async (clinicId) => {
    setLoadingClinicsInfo(true);
    setError(null);

    const res = await getClinicInfoApi(clinicId);

    if (!res.ok) {
      setError(res.message);
      setLoadingClinicsInfo(false);
      return;
    }

    setClinicInfo(res.data.clinic || []);
    console.log(res.data.clinic);
    setLoadingClinicsInfo(false);
  };

  const deleteClinicSession = async (sessionClinicId) => {
    setLoadingDeleteClinicSession(true);
    setError(null);

    const res = await deleteClinicSessionApi(sessionClinicId);

    if (!res.ok) {
      setError(res.message);
      setLoadingDeleteClinicSession(false);
      return;
    }

    setLoadingDeleteClinicSession(false);
  };

  const createClinicSession = async (clinicId, clinicSessionData) => {
    setLoadingCreateClinicSession(true);
    setError(null);

    const res = await createClinicSessionApi(clinicId, clinicSessionData);

    if (!res.ok) {
      setError(res.message);
      setLoadingCreateClinicSession(false);
      return;
    }

    setLoadingCreateClinicSession(false);
  };

const createClinic = async (clinicData) => {
  setLoadingCreateClinic(true);
  setError(null);

  const res = await createClinicApi(clinicData);

  if (!res.ok) {
    setError(res.message);
    setLoadingCreateClinic(false);
    return res; // return the failed response
  }

  setLoadingCreateClinic(false);
  return res; // return the success response too
};

  const updateClinic = async (clinicId, clinicData) => {
    setLoadingCreateClinicSession(true);
    setError(null);

    const res = await updateClinicApi(clinicId, clinicData);

    if (!res.ok) {
      setError(res.message);
      setLoadingCreateClinicSession(false);
      return;
    }

    setLoadingCreateClinicSession(false);
  };

  return (
    <ClinicContext.Provider
      value={{
        clinics,
        allClinicsOfUser,
        allClinics,
        clinicInfo,
        clinicSessions,

        loadingClinicSessions,
        loading,
        error,

        getAllClinicsOfDoctor,
        getAllClinicsOfUserNotAffiliated,
        getClinicSessions,
        getAllClinicsOfUser,
        getClinicInfo,
        deleteClinicAffiliation,
        createAffiliationDoctorToClinic,
        createClinicSession,
        updateClinic,
        deleteClinicSession,
        createClinic,
      }}
    >
      {children}
    </ClinicContext.Provider>
  );
};
