const computeAge = (dob) => {
  if (!dob) return "-";
  const birth = new Date(dob);
  const today = new Date();
  let age = today.getFullYear() - birth.getFullYear();
  const monthDiff = today.getMonth() - birth.getMonth();
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
    age--;
  }
  return age;
};

const formatDateValue = (date) => {
  if (!date) return "-";
  return new Date(date).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
};

function InfoField({ label, value }) {
  return (
    <div>
      <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">
        {label}
      </p>
      <p className="mt-1 text-sm font-medium text-gray-800">
        {value || "-"}
      </p>
    </div>
  );
}

export default function PatientInfoSidebar({ patientInfo, onUploadImage }) {
  if (!patientInfo) {
    return (
      <div className="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm">
        <p className="text-sm text-gray-500">Loading patient info...</p>
      </div>
    );
  }

  return (
    <div className="space-y-4 rounded-2xl border border-gray-200 bg-white p-4 shadow-sm">
      <h3 className="text-base font-semibold text-gray-800">Patient Info</h3>

      {/* Image Section */}
      <div className="flex flex-col items-center">
        {patientInfo.patient_img_path ? (
          <img
            src={`${import.meta.env.VITE_API_BASE}${patientInfo.patient_img_path}`}
            alt={patientInfo.full_name}
            className="h-32 w-32 rounded-full border-4 border-white object-cover shadow-lg"
          />
        ) : (
          <div className="flex h-32 w-32 items-center justify-center rounded-full border-2 border-dashed border-gray-300 bg-gray-50 text-center text-sm font-semibold text-gray-400">
            No Image
          </div>
        )}

        <label className="mt-3 cursor-pointer rounded-lg bg-blue-600 px-3 py-1.5 text-xs font-medium text-white transition hover:bg-blue-700">
          Upload Image
          <input
            type="file"
            accept="image/*"
            hidden
            onChange={onUploadImage}
          />
        </label>
      </div>

      {/* Patient Details */}
      <div className="space-y-3">
        <InfoField label="Name" value={patientInfo.full_name} />
        <InfoField label="Gender" value={patientInfo.gender} />
        <InfoField label="Age" value={computeAge(patientInfo.date_of_birth)} />
        <InfoField label="Date of Birth" value={formatDateValue(patientInfo.date_of_birth)} />
        <InfoField label="Contact" value={patientInfo.contact_number} />
        <InfoField label="Backup Contact" value={patientInfo.backup_contact} />
        <InfoField label="Email" value={patientInfo.email} />
        <div>
          <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">
            Priority
          </p>
          <span className="mt-1 inline-block rounded-full bg-blue-100 px-3 py-1 text-xs font-semibold text-blue-700">
            {patientInfo.priority_level || "Normal"}
          </span>
        </div>
        <InfoField label="Address" value={patientInfo.address} />
      </div>
    </div>
  );
}
