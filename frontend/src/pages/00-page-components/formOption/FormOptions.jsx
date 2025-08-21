
import { useState, useEffect } from "react";
import PropTypes from "prop-types";
import "./formOption.scss";

import { useMarksInputBySubjectContext } from "ContextAPI/MarksInputBySubjectContext";

const FormOption = ({ name, fetchData, valueKey, labelKey, dependencyKeys = [] }) => {
  const { bySubjectVars, updateBySubjectVars } = useMarksInputBySubjectContext(); // Context API to manage state
  const [options, setOptions] = useState([]); // State to hold dropdown options

  useEffect(() => {
    // Fetch options when the component mounts or fetchData changes
    if (fetchData) {
      fetchData()
        .then((data) => setOptions(data)) // Update options on successful fetch
        .catch((error) => {
          // if (import.meta.env.MODE === "development") {
            console.error(`Error fetching ${name}:`, error);
          // }
        });
    }
  }, [fetchData, name]); // Dependency ensures effect runs on fetchData/name change

  // Handle dropdown value change
  const handleChange = (event, varName) => {
    const newValue = event.target.value; // Get the new selected value
    updateBySubjectVars(varName, newValue); // Update the current field in context

    // Reset dependent fields if the current value changes
    if (newValue && dependencyKeys.length > 0) {
      dependencyKeys.forEach((key) => updateBySubjectVars(key, "")); // Clear dependent values
    }
  };

  return (
    <div id="option-component">
      <div className="option-label">{name}</div>
      <div className="option-value">
        {/* Dropdown to select an option */}
        <select
          value={bySubjectVars[labelKey]} // Bind dropdown value to context
          onChange={(event) => handleChange(event, labelKey)} // Handle value changes
        >
          <option value="">{name} নির্বাচন করুন</option> {/* Default option */}
          {options &&
            options.map((option) => (
              <option key={option[valueKey]} value={option[valueKey]}>
                {option[labelKey]} {/* Render option label */}
              </option>
            ))}
        </select>
      </div>
    </div>
  );
};

FormOption.propTypes = {
  name: PropTypes.string.isRequired, // Label for the dropdown
  fetchData: PropTypes.func, // Function to fetch options data
  valueKey: PropTypes.string, // Key for option values
  labelKey: PropTypes.string, // Key for option labels
  dependencyKeys: PropTypes.array, // Keys for dependent fields to reset
};

export default FormOption;
