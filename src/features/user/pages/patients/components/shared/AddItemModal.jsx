import { useState, useEffect } from "react";

/* ================= CATEGORIZED OPTIONS ================= */

export const DIAGNOSIS_STANDARD_OPTIONS = [
  {
    category: "Certain Infectious or Parasitic Diseases",
    options: ["COVID-19", "Tuberculosis", "Dengue fever", "Malaria", "HIV/AIDS", "Influenza", "Hepatitis B", "Cholera", "Typhoid fever", "Rabies"],
  },
  {
    category: "Neoplasms",
    options: ["Breast cancer", "Lung cancer", "Leukemia", "Brain tumor", "Cervical cancer", "Prostate cancer", "Skin cancer", "Lymphoma", "Colon cancer", "Ovarian cancer"],
  },
  {
    category: "Diseases of the Circulatory System",
    options: ["Hypertension", "Heart attack", "Heart failure", "Coronary artery disease", "Arrhythmia", "Stroke", "Deep vein thrombosis", "Atherosclerosis", "Cardiomyopathy", "Peripheral artery disease"],
  },
  {
    category: "Diseases of the Respiratory System",
    options: ["Asthma", "Pneumonia", "Chronic bronchitis", "COPD", "Sinusitis", "Tuberculosis", "Lung fibrosis", "Pulmonary embolism", "Laryngitis", "Bronchiectasis"],
  },
  {
    category: "Diseases of the Digestive System",
    options: ["Gastritis", "Peptic ulcer", "GERD", "Appendicitis", "Hepatitis", "Irritable bowel syndrome", "Crohn disease", "Ulcerative colitis", "Gallstones", "Pancreatitis"],
  },
  {
    category: "Symptoms, Signs, or Clinical Findings",
    options: ["Fever", "Fatigue", "Chest pain", "Dizziness", "Weight loss", "Headache", "Nausea", "Abdominal pain", "Fainting", "Swelling"],
  },
];

export const TREATMENT_STANDARD_OPTIONS = [
  {
    category: "General Treatment",
    options: ["Medication", "Observation", "Follow-up consultation", "Lifestyle modification", "Rest and hydration", "Dietary advice"],
  },
  {
    category: "Respiratory Treatment",
    options: ["Nebulization", "Oxygen therapy", "Inhaler therapy", "Antibiotics", "Cough suppressant"],
  },
  {
    category: "Pain / Injury Treatment",
    options: ["Pain reliever", "Wound cleaning", "Dressing change", "Immobilization", "Physical therapy"],
  },
];

export const PRESCRIPTION_STANDARD_OPTIONS = [
  {
    category: "Common Medicines",
    options: ["Paracetamol", "Ibuprofen", "Amoxicillin", "Cetirizine", "Loperamide", "Omeprazole"],
  },
  {
    category: "Respiratory Medicines",
    options: ["Salbutamol", "Ambroxol", "Carbocisteine", "Montelukast", "Antihistamine"],
  },
  {
    category: "Maintenance Medicines",
    options: ["Losartan", "Amlodipine", "Metformin", "Atorvastatin", "Insulin"],
  },
];

export const LAB_RESULT_STANDARD_OPTIONS = [
  {
    category: "Blood Tests",
    options: ["Complete Blood Count", "Blood Chemistry", "Fasting Blood Sugar", "HbA1c", "Lipid Profile"],
  },
  {
    category: "Urine / Stool Tests",
    options: ["Urinalysis", "Stool Exam", "Pregnancy Test", "Drug Test"],
  },
  {
    category: "Imaging / Diagnostic Tests",
    options: ["X-ray", "Ultrasound", "ECG", "CT Scan", "MRI"],
  },
];

export const CERTIFICATE_STANDARD_OPTIONS = [
  {
    category: "Medical Certificates",
    options: ["Medical Certificate", "Fit to Work Certificate", "Fit to Study Certificate", "Return to Work Certificate", "Excuse Letter"],
  },
  {
    category: "Clearance",
    options: ["Health Clearance", "Pre-employment Clearance", "Travel Clearance", "Sports Clearance"],
  },
];

export const FEE_STANDARD_OPTIONS = [
  {
    category: "Consultation Fees",
    options: ["Consultation Fee", "Follow-up Consultation Fee", "Emergency Consultation Fee", "Specialist Consultation Fee"],
  },
  {
    category: "Service Fees",
    options: ["Medical Certificate Fee", "Laboratory Fee", "Procedure Fee", "Injection Fee", "Dressing Fee"],
  },
];

/* ================= MODAL SHELL ================= */

export function ModalShell({ title, children, onClose }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
      <div
        className="absolute inset-0 bg-black/30 backdrop-blur-sm"
        onClick={onClose}
      />

      <div className="relative z-10 w-full max-w-md rounded-2xl border border-gray-200 bg-white p-6 shadow-xl space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-blue-700">{title}</h3>

          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 text-xl"
          >
            ×
          </button>
        </div>

        {children}
      </div>
    </div>
  );
}

/* ================= MODAL ACTIONS ================= */

export function ModalActions({ onClose, onSave, saveLabel }) {
  return (
    <div className="flex justify-end gap-3 pt-2">
      <button
        onClick={onClose}
        className="rounded-lg bg-gray-200 px-4 py-2 hover:bg-gray-300"
      >
        Cancel
      </button>

      <button
        onClick={onSave}
        className="rounded-lg bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
      >
        {saveLabel}
      </button>
    </div>
  );
}

/* ================= ADD TEXT MODAL ================= */

export function AddTextModal({
  isOpen,
  title,
  placeholder,
  loading,
  onClose,
  onSubmit,
  categorizedOptions = [],
}) {
  const [value, setValue] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");

  if (!isOpen) return null;

  const selectedOptions =
    categorizedOptions.find((item) => item.category === selectedCategory)
      ?.options || [];

  const handleSave = async () => {
    if (!value.trim()) return;
    const normalizedValue = value.trim().replace(/\s+/g, " ");
    const ok = await onSubmit(normalizedValue);

    if (ok) {
      setValue("");
      setSelectedCategory("");
      onClose();
    }
  };

  return (
    <ModalShell title={title} onClose={onClose}>
      <div className="space-y-3">
        {categorizedOptions.length > 0 && (
          <select
            value={selectedCategory}
            onChange={(e) => {
              setSelectedCategory(e.target.value);
              setValue("");
            }}
            className="w-full border rounded-lg px-3 py-2 bg-white"
          >
            <option value="">Select category</option>
            {categorizedOptions.map((item) => (
              <option key={item.category} value={item.category}>
                {item.category}
              </option>
            ))}
          </select>
        )}

        <input
          list={`${title}-options`}
          value={value}
          onChange={(e) => setValue(e.target.value)}
          placeholder={placeholder}
          className="w-full border rounded-lg px-3 py-2"
        />

        <datalist id={`${title}-options`}>
          {selectedOptions.map((option) => (
            <option key={option} value={option} />
          ))}
        </datalist>

        <p className="text-xs text-gray-500">
          You can choose from the dropdown or type your own custom value.
        </p>
      </div>

      <ModalActions
        onClose={onClose}
        onSave={handleSave}
        saveLabel={loading ? "Saving..." : "Save"}
      />
    </ModalShell>
  );
}

/* ================= ADD FEE MODAL ================= */

export function AddFeeModal({
  isOpen,
  loading,
  onClose,
  onSubmit,
  categorizedOptions = [],
}) {
  const [feeName, setFeeName] = useState("");
  const [amount, setAmount] = useState("");

  if (!isOpen) return null;

  const handleSave = async () => {
    if (!feeName.trim()) return;

    const ok = await onSubmit({
      fee_name: feeName.trim(),
      amount: Number(amount || 0),
    });

    if (ok) {
      setFeeName("");
      setAmount("");
      onClose();
    }
  };

  return (
    <ModalShell title="Add Fee" onClose={onClose}>
      <div className="space-y-3">
        <select
          onChange={(e) => setFeeName(e.target.value)}
          className="w-full border rounded-lg px-3 py-2 bg-white"
        >
          <option value="">Select fee category/value</option>
          {categorizedOptions.map((group) => (
            <optgroup key={group.category} label={group.category}>
              {group.options.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </optgroup>
          ))}
        </select>

        <input
          list="fee-options"
          value={feeName}
          onChange={(e) => setFeeName(e.target.value)}
          placeholder="Choose or enter fee name"
          className="w-full border rounded-lg px-3 py-2"
        />

        <datalist id="fee-options">
          {categorizedOptions.flatMap((group) =>
            group.options.map((option) => (
              <option key={option} value={option} />
            ))
          )}
        </datalist>

        <input
          type="number"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          placeholder="Enter amount"
          className="w-full border rounded-lg px-3 py-2"
        />
      </div>

      <ModalActions
        onClose={onClose}
        onSave={handleSave}
        saveLabel={loading ? "Saving..." : "Save"}
      />
    </ModalShell>
  );
}

/* ================= EDIT TEXT MODAL ================= */

export function EditTextModal({
  isOpen,
  title,
  placeholder,
  item,
  value: initialValue,
  loading,
  onClose,
  onSubmit,
  categorizedOptions = [],
}) {
  const [value, setValue] = useState(initialValue || "");
  const [selectedCategory, setSelectedCategory] = useState("");

  useEffect(() => {
    if (isOpen) {
      setValue(initialValue || "");
      setSelectedCategory("");
    }
  }, [isOpen, initialValue]);

  if (!isOpen || !item) return null;

  const selectedOptions =
    categorizedOptions.find((cat) => cat.category === selectedCategory)
      ?.options || [];

  const handleSave = async () => {
    if (!value.trim()) return;
    const normalizedValue = value.trim().replace(/\s+/g, " ");
    const ok = await onSubmit(normalizedValue);

    if (ok) {
      onClose();
    }
  };

  return (
    <ModalShell title={title} onClose={onClose}>
      <div className="space-y-3">
        {categorizedOptions.length > 0 && (
          <select
            value={selectedCategory}
            onChange={(e) => {
              setSelectedCategory(e.target.value);
              setValue("");
            }}
            className="w-full border rounded-lg px-3 py-2 bg-white"
          >
            <option value="">Select category</option>
            {categorizedOptions.map((cat) => (
              <option key={cat.category} value={cat.category}>
                {cat.category}
              </option>
            ))}
          </select>
        )}

        <input
          list={`${title}-edit-options`}
          value={value}
          onChange={(e) => setValue(e.target.value)}
          placeholder={placeholder}
          className="w-full border rounded-lg px-3 py-2"
        />

        <datalist id={`${title}-edit-options`}>
          {selectedOptions.map((option) => (
            <option key={option} value={option} />
          ))}
        </datalist>

        <p className="text-xs text-gray-500">
          You can choose from the dropdown or type your own custom value.
        </p>
      </div>

      <ModalActions
        onClose={onClose}
        onSave={handleSave}
        saveLabel={loading ? "Updating..." : "Update"}
      />
    </ModalShell>
  );
}

/* ================= EDIT FEE MODAL ================= */

export function EditFeeModal({
  isOpen,
  item,
  value: initialValue,
  amount: initialAmount,
  loading,
  onClose,
  onSubmit,
  categorizedOptions = [],
}) {
  const [feeName, setFeeName] = useState(initialValue || "");
  const [amount, setAmount] = useState(initialAmount ?? "");

  useEffect(() => {
    if (isOpen) {
      setFeeName(initialValue || "");
      setAmount(initialAmount ?? "");
    }
  }, [isOpen, initialValue, initialAmount]);

  if (!isOpen || !item) return null;

  const handleSave = async () => {
    if (!feeName.trim()) return;

    const ok = await onSubmit({
      fee_name: feeName.trim(),
      amount: Number(amount || 0),
    });

    if (ok) {
      onClose();
    }
  };

  return (
    <ModalShell title="Edit Fee" onClose={onClose}>
      <div className="space-y-3">
        <select
          onChange={(e) => setFeeName(e.target.value)}
          className="w-full border rounded-lg px-3 py-2 bg-white"
        >
          <option value="">Select fee category/value</option>
          {categorizedOptions.map((group) => (
            <optgroup key={group.category} label={group.category}>
              {group.options.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </optgroup>
          ))}
        </select>

        <input
          list="fee-edit-options"
          value={feeName}
          onChange={(e) => setFeeName(e.target.value)}
          placeholder="Choose or enter fee name"
          className="w-full border rounded-lg px-3 py-2"
        />

        <datalist id="fee-edit-options">
          {categorizedOptions.flatMap((group) =>
            group.options.map((option) => (
              <option key={option} value={option} />
            ))
          )}
        </datalist>

        <input
          type="number"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          placeholder="Enter amount"
          className="w-full border rounded-lg px-3 py-2"
        />
      </div>

      <ModalActions
        onClose={onClose}
        onSave={handleSave}
        saveLabel={loading ? "Updating..." : "Update"}
      />
    </ModalShell>
  );
}
