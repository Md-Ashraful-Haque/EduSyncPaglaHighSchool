import { useState, useEffect, useCallback } from "react";
import { getPublicFormOptionData } from "FormFields"; // Using alias from vite.config.js
import { useMarksInputBySubjectContext } from "ContextAPI/MarksInputBySubjectContext";
const instituteCode = `${import.meta.env.VITE_INSTITUTE_CODE}`;


const PublicYearSelector = () => {
  const { bySubjectVars, updateBySubjectVars } = useMarksInputBySubjectContext();
  const [options, setOptions] = useState([]);

  const handleChange = (event) => {
    updateBySubjectVars("year", event.target.value);
  };

  // Fetch years without login
  const fetchYears = useCallback(async () => {
    const apiUrl = `${import.meta.env.VITE_API_URL}/public-years/`;
    const queryData = {
      instituteCode:instituteCode
    };

    try {
      return await getPublicFormOptionData(apiUrl, queryData);
    } catch (error) {
      console.error("Error fetching years (public):", error);
      return [];
    }
  }, []);

  useEffect(() => {
    fetchYears()
      .then(setOptions)
      .catch((error) => console.error("Error setting options:", error));
  }, [fetchYears]);

  return (
    <select
      name="session"
      id="current-session"
      value={bySubjectVars.year || ""}
      onChange={handleChange}
    >
      {options.map((option) => (
        <option key={option.id} value={option.year}>
          {option.year}
        </option>
      ))}
    </select>
  );
};

export default PublicYearSelector;
