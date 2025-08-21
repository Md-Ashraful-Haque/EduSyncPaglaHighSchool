import "./show_result.scss";

import SelectFields from "../00-result-components/SelectFields";
// import SelectFields from "../00-field_selector/SelectFields";
import YearSelector from "../00-result-components/yearSelector/YearSelector";

import { useMarksInputBySubjectContext } from "ContextAPI/MarksInputBySubjectContext";
import StudentResult  from "./result_table";
import FullScreenModal  from './full_screen_window';

import { toast } from 'react-toastify';

import {doGetAPIcall } from 'Utils/utilsFunctions/UtilFuntions'
import { useAppContext } from "ContextAPI/AppContext";
import { useState } from 'react';

////////////////////////////////////////////////////////////////////////////////
const DataSelectorFormFields = () => {
  const { createNewAccessToken } = useAppContext();
  const [results, setResults] = useState([]); // State for serializer data
  const [highest_marks, setHighest_marks] = useState([]); // State for serializer data
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleModalClose = () => {
    // setIsModalOpen(false);
    // setResults([]); // Clear results on close
    // setIsModalOpen(true);
    setIsModalOpen(!isModalOpen); 
  };
  
  const [resultOption, setResultOption] = useState({
      year: true,
      class: true,
      section: false, 
    });
    
  const updateResultOption = (key) => {
    setResultOption({
      year: key === 'year',
      class: key === 'class', 
      section: key === 'section', 
    });
  };

  const { bySubjectVars, updateBySubjectVars } =
    useMarksInputBySubjectContext();

  const handleChange = (event, varName) => {
    updateBySubjectVars(varName, event.target.value);
    updateBySubjectVars("class_name", "");
  };

const handleSubmit = async (e) => {
    e.preventDefault();

    const requestData = {
      ...bySubjectVars,
      year: bySubjectVars.year, 
      exam_name: bySubjectVars.exam_name, 
      shift: bySubjectVars.shift, 
      class_name: bySubjectVars.class_name, 
      group: bySubjectVars.group_name_display, 
      section: bySubjectVars.section_name_display, 
      year_type:resultOption.year,
      class_type:resultOption.class, 
      section_type:resultOption.section, 

    };

    try {
      
      const response = await doGetAPIcall(createNewAccessToken, "show-result", requestData); 
      const successMessage = response.message || "Result Generated Successfully!";
      setResults(response.results || response); // Store serializer data
      setHighest_marks(response.highest_marks || response); // Store serializer data

      setIsModalOpen(!isModalOpen); 
      // console.log(response)
      // Show success toast message
      toast.success(successMessage, {
        position: "top-center",
        autoClose: 1000,
        hideProgressBar: false,
        closeOnClick: false,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
    } catch (error) {
      // Extract the error message from the backend response
      let errorMessage = "An unexpected error occurred";

      if (error.response && error.response.data) {
        // Check for different error response formats from your backend
        if (error.response.data.message) {
          errorMessage = error.response.data.message; // For {"message": "..."}
        } else if (error.response.data.error) {
          errorMessage = error.response.data.error; // For {"error": "..."}
        } else if (error.response.data.success === false && error.response.data.message) {
          errorMessage = error.response.data.message; // For {"success": false, "message": "..."}
        } else {
          errorMessage = JSON.stringify(error.response.data); // Fallback: stringify the entire response
        }
      } else {
        errorMessage = error.message; // Fallback to error.message if no response data
      }

      console.error("Error generating Result:", error.response?.data || error.message);

      // Show error toast message with the exact backend error
      toast.error(`Error Generating Result: ${errorMessage}`, {
        position: "top-center",
        autoClose: 3000, // Longer duration for errors to ensure readability
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
    }
  };

  


  return (
    <>
      {/* <div className="enter-marks-by-subject-form"> */}
      <div className="container-fluid">
        <div className="result-type-selector">
          <div className="result-creator-heading">ফলাফল দেখার ফর্ম</div>

          <div className="result-type">
            {/* <button
              onClick={() => updateResultOption("year")}
              className={resultOption.year ? "active" : ""}
            >
              সাল ভিত্তিক
            </button> */}
            <button
              onClick={() => updateResultOption("class")}
              className={resultOption.class ? "active" : ""}
            >
              ক্লাস ভিত্তিক{" "}
            </button>
            <button
              onClick={() => updateResultOption("section")}
              className={resultOption.section ? "active" : ""}
            >
              শাখা ভিত্তিক
            </button>
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="field-selector-form-container">
          <div className="field-selector-form">
            <div id="field-selector-form">
              <div id="option-component">
                <div className="option-label"> শিফট </div>
                <div className="option-value">
                  <div className="shift-section">
                    <select
                      name="session"
                      id="shitf-name"
                      value={bySubjectVars.shift}
                      onChange={(event) => {
                        handleChange(event, "shift");
                      }}
                    >
                      <option value="morning">Morning</option>
                      <option value="day">Day</option>
                      <option value="evening">Evening</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>

            <div id="field-selector-form">
              <div id="option-component">
                <div className="option-label"> বছর </div>
                <div className="option-value">
                  <YearSelector />
                </div>
              </div>
            </div>

            {resultOption.class ? (
              <SelectFields fields={["class", "group", "exam-by-year"]} />
            ) : (
              <SelectFields
                fields={["class", "group", "section", "exam-by-year"]}
              />
            )}

            {/* {resultOption.year ? (
              <SelectFields fields={["exam-by-year"]} />
            ) : resultOption.class ? (
              <SelectFields fields={["class", "group", "exam-by-year"]} />
            ) : (
              <SelectFields
                fields={["class", "group", "section", "exam-by-year"]}
              />
            )} */}
          </div>
          <div className="result-generator-button">
            <button type="submit" className="generate-btn">
              ফলাফল দেখুন
            </button>
          </div>
        </div>
      </form>

      {results.length > 0 && (
        <FullScreenModal isOpen={isModalOpen} onClose={handleModalClose}>
          <StudentResult results={results} highest_marks={highest_marks} />
        </FullScreenModal>
      )}
      {/* {results.length > 0 && <StudentResult results={results} />} */}

      {/* </div> */}
    </>
  );
};

DataSelectorFormFields.propTypes = {};

export default DataSelectorFormFields;
