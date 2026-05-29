import { useState, useCallback } from "react";
import {
  DIAGNOSIS_STANDARD_OPTIONS,
  TREATMENT_STANDARD_OPTIONS,
  PRESCRIPTION_STANDARD_OPTIONS,
  LAB_RESULT_STANDARD_OPTIONS,
  CERTIFICATE_STANDARD_OPTIONS,
  FEE_STANDARD_OPTIONS,
} from "../pages/patients/components/shared/AddItemModal";

const STORAGE_KEY = "fh_categorized_options";

const DEFAULTS = {
  diagnosis: DIAGNOSIS_STANDARD_OPTIONS,
  treatment: TREATMENT_STANDARD_OPTIONS,
  prescription: PRESCRIPTION_STANDARD_OPTIONS,
  labResult: LAB_RESULT_STANDARD_OPTIONS,
  certificate: CERTIFICATE_STANDARD_OPTIONS,
  fee: FEE_STANDARD_OPTIONS,
};

function loadAll() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) return JSON.parse(raw);
  } catch {}
  return { ...DEFAULTS };
}

function saveAll(data) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
}

export function useCategorizedOptions() {
  const [allOptions, setAllOptions] = useState(loadAll);

  const getOptions = useCallback(
    (key) => allOptions[key] || [],
    [allOptions]
  );

  /* ---- Category CRUD ---- */

  const addCategory = useCallback((key, categoryName) => {
    setAllOptions((prev) => {
      const next = { ...prev };
      const list = [...(next[key] || [])];
      list.push({ category: categoryName, options: [] });
      next[key] = list;
      saveAll(next);
      return next;
    });
  }, []);

  const renameCategory = useCallback((key, oldName, newName) => {
    setAllOptions((prev) => {
      const next = { ...prev };
      next[key] = (next[key] || []).map((cat) =>
        cat.category === oldName ? { ...cat, category: newName } : cat
      );
      saveAll(next);
      return next;
    });
  }, []);

  const deleteCategory = useCallback((key, categoryName) => {
    setAllOptions((prev) => {
      const next = { ...prev };
      next[key] = (next[key] || []).filter(
        (cat) => cat.category !== categoryName
      );
      saveAll(next);
      return next;
    });
  }, []);

  /* ---- Option CRUD ---- */

  const addOption = useCallback((key, categoryName, optionName) => {
    setAllOptions((prev) => {
      const next = { ...prev };
      next[key] = (next[key] || []).map((cat) =>
        cat.category === categoryName
          ? { ...cat, options: [...cat.options, optionName] }
          : cat
      );
      saveAll(next);
      return next;
    });
  }, []);

  const updateOption = useCallback(
    (key, categoryName, oldOption, newOption) => {
      setAllOptions((prev) => {
        const next = { ...prev };
        next[key] = (next[key] || []).map((cat) =>
          cat.category === categoryName
            ? {
                ...cat,
                options: cat.options.map((o) =>
                  o === oldOption ? newOption : o
                ),
              }
            : cat
        );
        saveAll(next);
        return next;
      });
    },
    []
  );

  const deleteOption = useCallback((key, categoryName, optionName) => {
    setAllOptions((prev) => {
      const next = { ...prev };
      next[key] = (next[key] || []).map((cat) =>
        cat.category === categoryName
          ? { ...cat, options: cat.options.filter((o) => o !== optionName) }
          : cat
      );
      saveAll(next);
      return next;
    });
  }, []);

  const resetToDefaults = useCallback(() => {
    setAllOptions({ ...DEFAULTS });
    saveAll({ ...DEFAULTS });
  }, []);

  return {
    allOptions,
    getOptions,
    addCategory,
    renameCategory,
    deleteCategory,
    addOption,
    updateOption,
    deleteOption,
    resetToDefaults,
  };
}
