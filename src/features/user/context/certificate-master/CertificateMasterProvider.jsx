import { useState } from "react";

import { CertificateMasterContext } from "./CertificateMasterContext.jsx";

import {
  getAllCertificateMastersApi,
  createCertificateMasterApi,
  updateCertificateMasterApi,
  deleteCertificateMasterApi,
} from "../../api/certificateMasterApi.js";

export const CertificateMasterProvider = ({ children }) => {
  const [certificates, setCertificates] = useState([]);

  const [loadingCertificates, setLoadingCertificates] = useState(false);

  const [certificateActionLoading, setCertificateActionLoading] =
    useState(false);

  const [certificateError, setCertificateError] = useState(null);

  const getAllCertificateMasters = async () => {
    setLoadingCertificates(true);
    setCertificateError(null);

    const res = await getAllCertificateMastersApi();

    if (!res.ok) {
      setCertificateError(res.message);
      setLoadingCertificates(false);
      return;
    }

    setCertificates(res.data.certificates || []);

    setLoadingCertificates(false);
  };

  const createCertificateMaster = async (certificate_name) => {
    setCertificateActionLoading(true);
    setCertificateError(null);

    const res = await createCertificateMasterApi({
      certificate_name,
    });

    if (!res.ok) {
      setCertificateError(res.message);
      setCertificateActionLoading(false);
      return false;
    }

    await getAllCertificateMasters();

    setCertificateActionLoading(false);

    return true;
  };

  const updateCertificateMaster = async (
    certificateId,
    certificate_name,
  ) => {
    setCertificateActionLoading(true);
    setCertificateError(null);

    const res = await updateCertificateMasterApi(certificateId, {
      certificate_name,
    });

    if (!res.ok) {
      setCertificateError(res.message);
      setCertificateActionLoading(false);
      return false;
    }

    await getAllCertificateMasters();

    setCertificateActionLoading(false);

    return true;
  };

  const deleteCertificateMaster = async (certificateId) => {
    setCertificateActionLoading(true);
    setCertificateError(null);

    const res = await deleteCertificateMasterApi(certificateId);

    if (!res.ok) {
      setCertificateError(res.message);
      setCertificateActionLoading(false);
      return false;
    }

    await getAllCertificateMasters();

    setCertificateActionLoading(false);

    return true;
  };

  return (
    <CertificateMasterContext.Provider
      value={{
        certificates,

        loadingCertificates,
        certificateActionLoading,

        certificateError,

        getAllCertificateMasters,
        createCertificateMaster,
        updateCertificateMaster,
        deleteCertificateMaster,
      }}
    >
      {children}
    </CertificateMasterContext.Provider>
  );
};