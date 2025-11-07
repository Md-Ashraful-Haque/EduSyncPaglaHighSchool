import "./generate_result.scss";

import SelectFields from "pageComponents/SelectFields";
// import SelectFields from "../00-field_selector/SelectFields";
// import YearSelector from "./yearSelector/YearSelector";
import YearSelector from "pageComponents/yearSelector/YearSelector";

import { useMarksInputBySubjectContext } from "ContextAPI/MarksInputBySubjectContext";

// import { useEffect } from "react";
import { toast } from "react-toastify";

import { doAPIcall } from "Utils/utilsFunctions/UtilFuntions";
import { useAppContext } from "ContextAPI/AppContext";
import { useState } from "react";

import Loading_1 from "LoadingComponent/loading/Loading_1";

const DataSelectorFormFields = () => {
  const { createNewAccessToken } = useAppContext();
  const [isLoading, setIsLoading] = useState(false);

  const [resultOption, setResultOption] = useState({
    year: true,
    class: false,
    section: false,
  });
  const updateResultOption = (key) => {
    setResultOption({
      year: key === "year",
      class: key === "class",
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
    setIsLoading(true);

    const requestData = {
      ...bySubjectVars,
      year: bySubjectVars.year,
      exam_name: bySubjectVars.exam_name,
      shift: bySubjectVars.shift,
      class_name: bySubjectVars.class_name,
      // group: bySubjectVars.group_name_display,
      // section: bySubjectVars.section_name_display,
      year_type: resultOption.year,
      class_type: resultOption.class,
    };

    try {
      const response = await doAPIcall(
        createNewAccessToken,
        "generate-result",
        requestData
      );
      const successMessage =
        response.message || "Result Generated Successfully!";
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
        } else {
          errorMessage = JSON.stringify(error.response.data); // Fallback: stringify the entire response
        }
      } else {
        errorMessage = error.message; // Fallback to error.message if no response data
      }

      console.error(
        "Error generating Result:",
        error.response?.data || error.message
      );

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
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <>
        <div>
          <Loading_1 />
        </div>
      </>
    );
  }

  return (
    <>
      {/* <div className="enter-marks-by-subject-form"> */}
      <div className="container-fluid">
        <div className="result-type-selector">
          <div className="result-creator-heading">ফলাফল তৈরি ফর্ম</div>

          <div className="result-type">
            <button
              onClick={() => updateResultOption("year")}
              className={resultOption.year ? "active" : ""}
            >
              সাল ভিত্তিক
            </button>
            <button
              onClick={() => updateResultOption("class")}
              className={resultOption.class ? "active" : ""}
            >
              ক্লাস ভিত্তিক{" "}
            </button>
            {/* <button onClick={() => updateResultOption('section')} className={resultOption.section ? "active" : ""}>শাখা ভিত্তিক</button> */}
          </div>
        </div>
      </div>
      {/* <div className="container-fluid">
          <div className="row"> */}
      <form onSubmit={handleSubmit}>
        <div className="field-selector-form-container">
          <div className="field-selector-form">

            <div id="field-selector-form">
              <div id="option-component">
                <div className="option-label"> বছর </div>
                <div className="option-value">
                  <YearSelector />
                </div>
              </div>
            </div>
            
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
                      {/* <option value="afternoon">Afternoon</option> */}
                      {/* <option value="day">Day</option> */}
                      {/* <option value="evening">Evening</option> */}
                    </select>
                  </div>
                </div>
              </div>
            </div>


            {resultOption.year ? (
              <SelectFields fields={["exam-by-year"]} />
            ) : (
              <SelectFields fields={["class", "exam-by-year"]} />
            )}
          </div>
          <div className="result-generator-button">
            <button type="submit" className="generate-btn">
              ফলাফল তৈরি করুন
            </button>
          </div>
        </div>
      </form>
      {/* </div>
        </div> */}
      {/* </div> */}
    </>
  );
};

DataSelectorFormFields.propTypes = {};

export default DataSelectorFormFields;
