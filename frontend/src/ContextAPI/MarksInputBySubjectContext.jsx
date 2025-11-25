/*eslint no-unused-vars: ["error", { "caughtErrors": "none" }]*/

import { createContext, useState, useContext } from 'react';
import PropTypes from "prop-types";


const MarksInputBySubjectContext = createContext();
const instituteCode = `${import.meta.env.VITE_INSTITUTE_CODE}`;
// Create a Provider Component
export const ResultContextAPIProvider = ({ children, initialValues = {} }) => {

  const [bySubjectVars, setBySubjectVars] = useState({
    instituteCode:instituteCode,
    year: initialValues.year || new Date().getFullYear(),
    shift: initialValues.shift || 'morning',
    class_name: initialValues.class_name || '',
    group_name_bangla: initialValues.group_name_bangla || '', 
    section_name: initialValues.section_name || '',
    exam_name: initialValues.exam_name || '',
    subject_name_display: initialValues.subject_name_display || '',
    // mark_type_display: initialValues.mark_type_display || '',
    isBangla: initialValues.isBangla || false,
  });

  // Update specific variable in the `vars` object
  const updateBySubjectVars = (key, value) => {
    setBySubjectVars((prev) => ({
      ...prev,
      [key]: value, // Dynamically update the key
    }));
  }; 

  
  return (
    <MarksInputBySubjectContext.Provider
      value={{
        bySubjectVars,
        updateBySubjectVars, 
      }}
    >
      {children}
    </MarksInputBySubjectContext.Provider>
  );
};

ResultContextAPIProvider.propTypes = {
  children: PropTypes.string.isRequired,
};

export const useMarksInputBySubjectContext = () => useContext(MarksInputBySubjectContext);

