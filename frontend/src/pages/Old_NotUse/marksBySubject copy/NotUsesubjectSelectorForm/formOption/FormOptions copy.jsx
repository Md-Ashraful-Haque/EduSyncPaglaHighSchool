

import { useState, useEffect } from "react";
import PropTypes from "prop-types";
import './formOption.scss';

import {useMarksInputBySubjectContext} from 'ContextAPI/MarksInputBySubjectContext' 



const FormOption = ({ name, fetchData, valueKey , labelKey , dependencyKeys=[]}) => {
  const { bySubjectVars, updateBySubjectVars } = useMarksInputBySubjectContext();


  const [options, setOptions] = useState([]); 

  useEffect(() => {
    if (fetchData) {
      fetchData()
        .then((data) => setOptions(data))
        .catch((error) => console.error(`Error fetching ${name}:`, error));
    }
  }, [fetchData, name]);

  // Handle the change of the selected option
  const handleChange = (event, varName) => { 
    updateBySubjectVars( varName ,event.target.value); 
    // console.log("event.target.value: ", event.target.value);
  };

  return (
    <div id="option-component">
      <div className="option-label">{name}</div>
      <div className="option-value">
        <select value={bySubjectVars[labelKey]} onChange={(event) => {handleChange(event, labelKey)}}>
          <option value=""> {name} নির্বাচন করুন </option>
          {options && options.map((option) => (
            <option key={option[valueKey]} value={option[valueKey]}>
              {option[labelKey]}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
};

FormOption.propTypes = {
  name: PropTypes.string.isRequired,
  fetchData: PropTypes.func, // Function to fetch data from API
  valueKey: PropTypes.string, // Key to use for option values
  labelKey: PropTypes.string, // Key to use for option labels
  dependencyKeys: PropTypes.arrayOf(PropTypes.string), 
};

export default FormOption;
