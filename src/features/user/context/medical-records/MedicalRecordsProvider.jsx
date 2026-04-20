import { useState } from "react";
import { MedicalRecordsContext } from "./MedicalRecordsContext.jsx";
import {
  getPatientOfDoctorInClinicApi,
  getPatientInfoApi,
  getPatientMedRecordApi,
  getMedicalRecordsFullDetailsAPi,
  createMedicalRecordApi,
  uploadMedicalRecordDocumentApi,
    getPatientVitalSignsApi,
  createVitalSignApi,
} from "../../api/medicalRecordsApi.js";

export const MedicalRecordsProvider = ({ children }) => {
  const [patients, setPatients] = useState([]);
  const [patientMedRecords, setPatientMedRecords] = useState([]);
  const [patientsInfo, setPatientsInfo] = useState([]);
  const [medicalRecordsFullDetails, setMedicalRecordsFullDetails] = useState({
    medicalRecord: null,
    vitalSigns: [],
    prescriptions: [],
    labResults: [],
    referrals: [],
    followups: [],
    certificates: [],
    documents: [], // 🔥 REQUIRED
  });

  const [patientVitalSigns, setPatientVitalSigns] = useState([]);
const [loadingPatientVitalSigns, setLoadingPatientVitalSigns] = useState(false);

const [loading, setLoading] = useState(false);
const [loadingPatientInfo, setLoadingPatientInfo] = useState(false);
const [loadingPatientMedRecord, setLoadingPatientMedRecord] = useState(false);
const [loadingMedicalRecordsFullDetails, setLoadingMedicalRecordsFullDetails] = useState(false);
const [error, setError] = useState(null);


  const getPatientVitalSigns = async (patientId) => {
  setLoadingPatientVitalSigns(true);
  setError(null);

  try {
    const res = await getPatientVitalSignsApi(patientId);

    if (!res.ok) {
      setError(res.message);
      setPatientVitalSigns([]);
      return res;
    }

    setPatientVitalSigns(res.data.vitalSigns || []);
    return res;
  } catch (err) {
    setError("Something went wrong");
    setPatientVitalSigns([]);
    return { ok: false, message: "Something went wrong" };
  } finally {
    setLoadingPatientVitalSigns(false);
  }
};

const createVitalSign = async (patientId, vitalSignData) => {
  setError(null);

  try {
    const res = await createVitalSignApi(patientId, vitalSignData);

    if (!res.ok) {
      setError(res.message);
      return res;
    }

    return {
      ...res,
      vitalSign: res.data.vitalSign,
    };
  } catch (err) {
    setError("Something went wrong");
    return { ok: false, message: "Something went wrong" };
  }
};

  const getPatientOfDoctorInClinic = async (doctorId, clinicId) => {
    setLoading(true);
    setError(null);

    try {
      const res = await getPatientOfDoctorInClinicApi(doctorId, clinicId);

      if (!res.ok) {
        setError(res.message);
        setLoading(false);
        return;
      }

      setPatients(res.data.patients || []);
    } catch (err) {
      setError("Something went wrong");
      setPatients([]);
    } finally {
      setLoading(false);
    }
  };

  const getPatientInfo = async (patientId) => {
    setLoadingPatientInfo(true);
    setError(null);

    try {
      const res = await getPatientInfoApi(patientId);

      if (!res.ok) {
        setError(res.message);
        setLoading(false);
        return;
      }

      setPatientsInfo(res.data.patientInfo || []);
    } catch (err) {
      setError("Something went wrong");
      setPatientsInfo([]);
    } finally {
      setLoadingPatientInfo(false);
    }
  };

  const getPatientMedRecord = async (patientId) => {
    setLoadingPatientMedRecord(true);
    setError(null);

    try {
      const res = await getPatientMedRecordApi(patientId);

      if (!res.ok) {
        setError(res.message);
        return;
      }

      // ✅ STORE THE WHOLE AGGREGATE
      setPatientMedRecords(res.data.patientMedRec);
    } catch (err) {
      setError("Something went wrong");
      setPatientMedRecords(null);
    } finally {
      setLoadingPatientMedRecord(false);
    }
  };

  const getMedicalRecordsFullDetails = async (recordId) => {
    setLoadingMedicalRecordsFullDetails(true);
    setError(null);

    try {
      const res = await getMedicalRecordsFullDetailsAPi(recordId);

if (!res.ok) {
  setError(res.message);
  return res;
}

      // THIS IS THE OBJECT
      setMedicalRecordsFullDetails({
  ...res.data.patientMedRecDetail,
  medicalRecord: {
    ...res.data.patientMedRecDetail.medicalRecord,
    pre_employment_data:
      res.data.patientMedRecDetail.medicalRecord?.pre_employment_data || null,
    form_type:
      res.data.patientMedRecDetail.medicalRecord?.form_type || "general",
  },
});
    } catch (err) {
      setError("Something went wrong");
      setMedicalRecordsFullDetails({
  medicalRecord: null,
  vitalSigns: [],
  prescriptions: [],
  labResults: [],
  referrals: [],
  followups: [],
  certificates: [],
  documents: [],
});
    } finally {
      setLoadingMedicalRecordsFullDetails(false);
    }
  };

const createMedicalRecord = async (patientId, medicalRecordData) => {
  setError(null);

  try {
    const res = await createMedicalRecordApi(patientId, medicalRecordData);

    if (!res.ok) {
      setError(res.message);
      return res;
    }

    return {
      ...res,
      record: res.data.record,
    };
  } catch (err) {
    setError("Something went wrong");
    return { ok: false, message: "Something went wrong" };
  }
};
const uploadMedicalRecordDocument = async (recordId, file) => {
  setError(null);

  try {
    const res = await uploadMedicalRecordDocumentApi(recordId, file);

    if (!res.ok) {
      setError(res.message);
      return res;
    }

    return res;
  } catch (err) {
    setError("Something went wrong");
    return { ok: false, message: "Something went wrong" };
  }
};

  const clearPatients = () => {
    setPatients([]);
  };

  return (
<MedicalRecordsContext.Provider
  value={{
    getPatientOfDoctorInClinic,
    getPatientInfo,
    clearPatients,
    getPatientMedRecord,
    getMedicalRecordsFullDetails,
    createMedicalRecord,
    uploadMedicalRecordDocument,
    getPatientVitalSigns,
    createVitalSign,
    loading,
    error,
    patients,
    patientsInfo,
    patientMedRecords,
    patientVitalSigns,
    medicalRecordsFullDetails,
    loadingPatientVitalSigns,
  }}
>
      {children}
    </MedicalRecordsContext.Provider>
  );
};
