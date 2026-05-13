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
  getPatientVisitHistoryApi,
  //added
    updateMedicalRecordApi,
  deleteMedicalRecordApi,

  getPrescriptionsByRecordApi,
  getPrescriptionByIdApi,
  createPrescriptionApi,
  updatePrescriptionApi,
  deletePrescriptionApi,

  getLabResultsByRecordApi,
  getLabResultByIdApi,
  createLabResultApi,
  updateLabResultApi,
  deleteLabResultApi,

  getCertificatesByRecordApi,
  getCertificateByIdApi,
  createCertificateApi,
  updateCertificateApi,
  deleteCertificateApi,

  updateLabResultImageApi,

  updateCertificateImageApi,

  getMedicalRecordByAppointmentIdApi,
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

  const [patientVisitHistory, setPatientVisitHistory] = useState([]);
const [loadingPatientVisitHistory, setLoadingPatientVisitHistory] = useState(false);

  const [patientVitalSigns, setPatientVitalSigns] = useState([]);
const [loadingPatientVitalSigns, setLoadingPatientVitalSigns] = useState(false);

const [loading, setLoading] = useState(false);
const [loadingPatientInfo, setLoadingPatientInfo] = useState(false);
const [loadingPatientMedRecord, setLoadingPatientMedRecord] = useState(false);
const [loadingMedicalRecordsFullDetails, setLoadingMedicalRecordsFullDetails] = useState(false);
const [error, setError] = useState(null);

  const [prescriptions, setPrescriptions] = useState([]);
  const [selectedPrescription, setSelectedPrescription] = useState(null);

  const [labResults, setLabResults] = useState([]);
  const [selectedLabResult, setSelectedLabResult] = useState(null);

  const [certificates, setCertificates] = useState([]);
  const [selectedCertificate, setSelectedCertificate] = useState(null);

  const [loadingPrescriptions, setLoadingPrescriptions] = useState(false);
  const [loadingLabResults, setLoadingLabResults] = useState(false);
  const [loadingCertificates, setLoadingCertificates] = useState(false);

  const [medicalRecordByAppointment, setMedicalRecordByAppointment] = useState(null);
const [loadingMedicalRecordByAppointment, setLoadingMedicalRecordByAppointment] =
  useState(false);



  const updateCertificateImage = async (certificateId, recordId, file) => {
  const formData = new FormData();
  formData.append("certificate_image", file);

  const res = await updateCertificateImageApi(certificateId, formData);

  if (!res.ok) {
    return false;
  }

  await getCertificatesByRecord(recordId);

  return res;
};
const getPatientVisitHistory = async (patientId) => {
  setLoadingPatientVisitHistory(true);
  setError(null);

  try {
    const res = await getPatientVisitHistoryApi(patientId);

    if (!res.ok) {
      setError(res.message);
      setPatientVisitHistory([]);
      return res;
    }

    setPatientVisitHistory(res.data.visitHistory || []);
    return res;
  } catch (err) {
    setError("Something went wrong");
    setPatientVisitHistory([]);
    return { ok: false, message: "Something went wrong" };
  } finally {
    setLoadingPatientVisitHistory(false);
  }
};

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

    // medical record
  const updateMedicalRecord = async (recordId, medicalRecordData) => {
    setError(null);

    try {
      const res = await updateMedicalRecordApi(recordId, medicalRecordData);

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

  const deleteMedicalRecord = async (recordId) => {
    setError(null);

    try {
      const res = await deleteMedicalRecordApi(recordId);

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

  // prescriptions
  const getPrescriptionsByRecord = async (recordId) => {
    setLoadingPrescriptions(true);
    setError(null);

    try {
      const res = await getPrescriptionsByRecordApi(recordId);

      if (!res.ok) {
        setError(res.message);
        setPrescriptions([]);
        return res;
      }

      setPrescriptions(res.data.prescriptions || []);
      return res;
    } catch (err) {
      setError("Something went wrong");
      setPrescriptions([]);
      return { ok: false, message: "Something went wrong" };
    } finally {
      setLoadingPrescriptions(false);
    }
  };

  const getPrescriptionById = async (prescriptionId) => {
    setError(null);

    try {
      const res = await getPrescriptionByIdApi(prescriptionId);

      if (!res.ok) {
        setError(res.message);
        setSelectedPrescription(null);
        return res;
      }

      setSelectedPrescription(res.data.prescription || null);
      return res;
    } catch (err) {
      setError("Something went wrong");
      setSelectedPrescription(null);
      return { ok: false, message: "Something went wrong" };
    }
  };

  const createPrescription = async (recordId, prescriptionData) => {
    setError(null);

    try {
      const res = await createPrescriptionApi(recordId, prescriptionData);

      if (!res.ok) {
        setError(res.message);
        return res;
      }

      return {
        ...res,
        prescription: res.data.prescription,
      };
    } catch (err) {
      setError("Something went wrong");
      return { ok: false, message: "Something went wrong" };
    }
  };

  const updateLabResultImage = async (labResultId, recordId, file) => {
  const formData = new FormData();
  formData.append("lab_image", file);

  const res = await updateLabResultImageApi(labResultId, formData);

  if (!res.ok) {
    return false;
  }

  await getLabResultsByRecord(recordId);

  return res;
};

  const updatePrescription = async (prescriptionId, prescriptionData) => {
    setError(null);

    try {
      const res = await updatePrescriptionApi(prescriptionId, prescriptionData);

      if (!res.ok) {
        setError(res.message);
        return res;
      }

      return {
        ...res,
        prescription: res.data.prescription,
      };
    } catch (err) {
      setError("Something went wrong");
      return { ok: false, message: "Something went wrong" };
    }
  };

  const deletePrescription = async (prescriptionId) => {
    setError(null);

    try {
      const res = await deletePrescriptionApi(prescriptionId);

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

  // lab results
  const getLabResultsByRecord = async (recordId) => {
    setLoadingLabResults(true);
    setError(null);

    try {
      const res = await getLabResultsByRecordApi(recordId);

      if (!res.ok) {
        setError(res.message);
        setLabResults([]);
        return res;
      }

      setLabResults(res.data.labResults || []);
      return res;
    } catch (err) {
      setError("Something went wrong");
      setLabResults([]);
      return { ok: false, message: "Something went wrong" };
    } finally {
      setLoadingLabResults(false);
    }
  };

  const getLabResultById = async (resultId) => {
    setError(null);

    try {
      const res = await getLabResultByIdApi(resultId);

      if (!res.ok) {
        setError(res.message);
        setSelectedLabResult(null);
        return res;
      }

      setSelectedLabResult(res.data.labResult || null);
      return res;
    } catch (err) {
      setError("Something went wrong");
      setSelectedLabResult(null);
      return { ok: false, message: "Something went wrong" };
    }
  };

const createLabResult = async (recordId, formData) => {
  const res = await createLabResultApi(recordId, formData);

  if (!res.ok) {
    return false;
  }

  await getLabResultsByRecord(recordId);

  return res;
};

  const updateLabResult = async (resultId, labResultData) => {
    setError(null);

    try {
      const res = await updateLabResultApi(resultId, labResultData);

      if (!res.ok) {
        setError(res.message);
        return res;
      }

      return {
        ...res,
        labResult: res.data.labResult,
      };
    } catch (err) {
      setError("Something went wrong");
      return { ok: false, message: "Something went wrong" };
    }
  };

  const deleteLabResult = async (resultId) => {
    setError(null);

    try {
      const res = await deleteLabResultApi(resultId);

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

  // certificates
  const getCertificatesByRecord = async (recordId) => {
    setLoadingCertificates(true);
    setError(null);

    try {
      const res = await getCertificatesByRecordApi(recordId);

      if (!res.ok) {
        setError(res.message);
        setCertificates([]);
        return res;
      }

      setCertificates(res.data.certificates || []);
      return res;
    } catch (err) {
      setError("Something went wrong");
      setCertificates([]);
      return { ok: false, message: "Something went wrong" };
    } finally {
      setLoadingCertificates(false);
    }
  };

  const getCertificateById = async (certificateId) => {
    setError(null);

    try {
      const res = await getCertificateByIdApi(certificateId);

      if (!res.ok) {
        setError(res.message);
        setSelectedCertificate(null);
        return res;
      }

      setSelectedCertificate(res.data.certificate || null);
      return res;
    } catch (err) {
      setError("Something went wrong");
      setSelectedCertificate(null);
      return { ok: false, message: "Something went wrong" };
    }
  };

  const createCertificate = async (recordId, certificateData) => {
    setError(null);

    try {
      const res = await createCertificateApi(recordId, certificateData);

      if (!res.ok) {
        setError(res.message);
        return res;
      }

      return {
        ...res,
        certificate: res.data.certificate,
      };
    } catch (err) {
      setError("Something went wrong");
      return { ok: false, message: "Something went wrong" };
    }
  };

  const updateCertificate = async (certificateId, certificateData) => {
    setError(null);

    try {
      const res = await updateCertificateApi(certificateId, certificateData);

      if (!res.ok) {
        setError(res.message);
        return res;
      }

      return {
        ...res,
        certificate: res.data.certificate,
      };
    } catch (err) {
      setError("Something went wrong");
      return { ok: false, message: "Something went wrong" };
    }
  };

  const deleteCertificate = async (certificateId) => {
    setError(null);

    try {
      const res = await deleteCertificateApi(certificateId);

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

  const getMedicalRecordByAppointmentId = async (appointmentId) => {
  setLoadingMedicalRecordByAppointment(true);
  setError(null);

  try {
    const res = await getMedicalRecordByAppointmentIdApi(appointmentId);

    if (!res.ok) {
      setError(res.message);
      setMedicalRecordByAppointment(null);
      return res;
    }

    setMedicalRecordByAppointment(res.data.medicalRecord || null);
    return res;
  } catch (err) {
    setError("Something went wrong");
    setMedicalRecordByAppointment(null);
    return { ok: false, message: "Something went wrong" };
  } finally {
    setLoadingMedicalRecordByAppointment(false);
  }
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

    patientVisitHistory,
    getPatientVisitHistory,

    //added
        updateMedicalRecord,
    deleteMedicalRecord,

    prescriptions,
    selectedPrescription,
    loadingPrescriptions,
    getPrescriptionsByRecord,
    getPrescriptionById,
    createPrescription,
    updatePrescription,
    deletePrescription,

    labResults,
    selectedLabResult,
    loadingLabResults,
    getLabResultsByRecord,
    getLabResultById,
    createLabResult,
    updateLabResult,
    deleteLabResult,

    certificates,
    selectedCertificate,
    loadingCertificates,
    getCertificatesByRecord,
    getCertificateById,
    createCertificate,
    updateCertificate,
    deleteCertificate,

    medicalRecordByAppointment,
loadingMedicalRecordByAppointment,
getMedicalRecordByAppointmentId,

updateLabResultImage,
updateCertificateImage
    
  }}
>
      {children}
    </MedicalRecordsContext.Provider>
  );
};
