
import "./EnterMarksBySubject.scss";

import SelectFields from "pageComponents/SelectFields";

// import SubjectSelectorForm from "./NotUsesubjectSelectorForm/SubjectSelectorForm";
// import YearSelector from "./NotUsedyearSelector/YearSelector";
import YearSelector from "pageComponents/yearSelector/YearSelector";

import { useMarksInputBySubjectContext } from "ContextAPI/MarksInputBySubjectContext";
// import { useEffect } from "react";


const DataSelectorFormFields = () => {
  const { bySubjectVars, updateBySubjectVars } = useMarksInputBySubjectContext();

  const handleChange = (event, varName) => {
    updateBySubjectVars(varName, event.target.value);
    updateBySubjectVars("class_name", "");
  };

  
  return (
    <>
      <div className="enter-marks-by-subject-form">
        <div className="container-fluid"> 

          <div className="row">
            <div className="subject-selector-form-container">
              <div className="subject-selector-form current-session-header shift-and-session-header">
                <div className="session-and-shift">
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

                  <div id="field-selector-form">
                    <div id="option-component">
                      <div className="option-label"> বছর </div>
                      <div className="option-value">
                        <YearSelector />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              {/* <div className="subject-selector-form current-session-header">
                <SelectFields fields={["class", "group", "section", "exam", "subject"]}/>

                
              </div> */}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

DataSelectorFormFields.propTypes = {};

export default DataSelectorFormFields;
