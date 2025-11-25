import { useState, useEffect, useCallback } from "react";
import { useAppContext } from "ContextAPI/AppContext";
import { useMarksInputBySubjectContext } from "ContextAPI/MarksInputBySubjectContext";
import { getFormOptionData } from "FormFields"; // Using alias from vite.config.js

const YearSelector = () => {
  const { createNewAccessToken } = useAppContext();
  const { bySubjectVars, updateBySubjectVars } =
    useMarksInputBySubjectContext();
  const [options, setOptions] = useState([]);

  // Handles changes to the select input
  const handleChange = (event) => {
    updateBySubjectVars("year", event.target.value);
  };

  // Fetches the list of years
  const fetchYears = useCallback(async () => {
    const apiUrl = `${import.meta.env.VITE_API_URL}/years/`;
    const queryData = {};

    try {
      return await getFormOptionData(apiUrl, queryData);
    } catch (error) {
      if (error.response?.status === 401) {
        await createNewAccessToken();
        return await getFormOptionData(apiUrl, queryData);
      }
      console.error("Error fetching years:", error);
      return [];
    }
  }, [createNewAccessToken]);

  // Fetch data on component mount
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
      {/* <option value="">সেশন নির্বাচন করুন</option> */}
      {options.map((option) => (
        <option key={option.id} value={option.year}>
          {option.year}
        </option>
      ))}
    </select>
  );
};

export default YearSelector;
