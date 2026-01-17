"use client";

import { useState, type ChangeEvent } from "react";

export const useFormInput = <T extends object>(initialState: T) => {
  const [formData, setFormData] = useState<T>(initialState);

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const updateField = (field: keyof T, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const resetForm = () => {
    setFormData(initialState);
  };

  return {
    formData,
    handleChange,
    updateField,
    resetForm,
    setFormData,
  };
};
