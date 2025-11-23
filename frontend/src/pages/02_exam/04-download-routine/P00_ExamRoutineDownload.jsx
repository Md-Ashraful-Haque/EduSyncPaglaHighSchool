
import "./ExamRoutineDownload.scss"; 
import React from "react";
import SelectFields from "pageComponents/SelectFields";
// import SelectFields from "../00-field_selector/SelectFields";
import YearSelector from "pageComponents/yearSelector/YearSelector";

import { useMarksInputBySubjectContext } from "ContextAPI/MarksInputBySubjectContext";
// import ResultTable from "./01_result_table";
import FullScreenModal from "pageComponents/02_full_screen_window";
// import Marksheet from "./02_marksheet";
// import showBangla from "../../../utils/utilsFunctions/engNumberToBang";
// import schoolLogo from "../../../assets/images/eduSyncLogo.svg";
// import ToggleLanguage from "pageComponents/toggleResult";
// import { generatePDF } from "../../../utils/utilsFunctions/pdfDownload";
import OpenNewTabWithHeader from "./ExamRoutineDownloadNewTab";
// import { ResultContextAPIProvider } from "ContextAPI/MarksInputBySubjectContext";
import Loading_1 from "LoadingComponent/loading/Loading_1";
// import MarksheetTableHeader from "./92_marksheet_table_header";
import ExamRoutineDownloadPrinter from "./ExamRoutineDownloadPrinter"; 

import { toast } from "react-toastify";

import { doGetAPIcall } from "Utils/utilsFunctions/UtilFuntions";
import { useAppContext } from "ContextAPI/AppContext";
import { useState } from "react";

import ClasswiseOrSectionwise from "pageComponents/classwise-or-sectionwise/ClasswiseOrSectionwise";

// import MeritReportHeader from "./01-merit-report-header";
// import MeritReportTable from "./02_merit_report_table";
////////////////////////////////////////////////////////////////////////////////
const ExamRoutineDownload = () => {
  const { createNewAccessToken } = useAppContext();
  const [students, setStudents] = useState([]); // State for serializer data
  const [studentsCommonInfo, setStudentsCommonInfo] = useState(null); // State for serializer data
  const [HeadSignature, setHeadSignature] = useState(null); // State for serializer data
  const [instituteInfo, setInstituteInfo] = useState(null); // State for serializer data


  // const [examAndInstituteInfo, setExamAndInstituteInfo] = useState({}); // State for serializer data
  // const [results, setResults] = useState([]); // State for serializer data
  // const [highest_marks, setHighest_marks] = useState([]); // State for serializer data
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [examRoutine, setExamRoutine] = useState([]);


  const handleModalClose = () => {
    setIsModalOpen(!isModalOpen);
  };

  const [resultOption, setResultOption] = useState({
    year: true,
    class: true,
    section: false,
  });

  const updateResultOption = (key) => {
    setResultOption({
      year: key === "year",
      class: key === "class",
      section: key === "section",
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
      group: bySubjectVars.group_name_bangla,
      section: bySubjectVars.section_name_display,
      year_type: resultOption.year,
      class_type: resultOption.class,
      section_type: resultOption.section,
    };

    try {
      const response = await doGetAPIcall(
        createNewAccessToken,
        "exam-attendance",
        requestData
      );

      // console.log("institute_info: ", response.institute_info);
      // console.log("student_list: ", response.student_list);
      // console.log("student_common_info: ", response.student_common_info);
      // console.log("head_master_signature: ", response.head_master_signature);
      setInstituteInfo(response.institute_info || response); 
      setStudents(response.student_list || response); 
      setStudentsCommonInfo(response.student_common_info || response); 
      setHeadSignature(response.head_master_signature || response); 
      setExamRoutine(response.exam_routine || []);   // ⭐ ADD THIS


      setIsModalOpen(!isModalOpen);
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
      // Show error toast message with the exact backend error
      toast.error(`Error: ${errorMessage}`, {
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
  

  // Construct filename from first student
  // const firstStudent = results[0];
  // const fileName = firstStudent
  //   ? `${firstStudent.class_name}-${firstStudent.group_name}-${firstStudent.section_name_display}-মার্কশীট.pdf`
  //   : "marksheets.pdf";

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
    <div className="generate-result">
      <ClasswiseOrSectionwise
        Option={resultOption}
        updateOption={updateResultOption}
        heading={"পরীক্ষার রুটিন ডাউনলোড ফর্ম"}
      />
      {/* see result using the form below */}
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
                      {/* <option value="afternoon">Afternoon</option> */}
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

            {resultOption.class ? (
              <SelectFields fields={["class", "group", "exam-by-year"]} />
            ) : (
              <SelectFields
                fields={["class", "group", "section", "exam-by-year"]}
              />
            )}
          </div> 
          <div className="result-generator-button">
            <button type="submit" className="generate-btn">
              পরীক্ষার রুটিন দেখুন
            </button>
          </div>
        </div>
      </form>

      <div className="downloadFullResult">
        {students.length > 0 && (
          <React.Fragment>
            <FullScreenModal isOpen={isModalOpen} onClose={handleModalClose}>

              <ExamRoutineDownloadPrinter
                students={students}
                studentsCommonInfo={studentsCommonInfo}
                HeadSignature={HeadSignature}
                instituteInfo={instituteInfo}
                examRoutine={examRoutine}
              /> 

              <div className="download-button">
                <div className="print-button">
                  {/* <ToggleLanguage />  */}

                  <OpenNewTabWithHeader
                    students={students}
                    studentsCommonInfo={studentsCommonInfo}
                    HeadSignature={HeadSignature}
                    instituteInfo={instituteInfo}
                    examRoutine={examRoutine}
                  /> 
                </div>
              </div>
            </FullScreenModal>
          </React.Fragment>
        )}
      </div>
      {/* {results.length > 0 && <ResultTable results={results} />} */}

      {/* </div> */}
    </div>
  );
};

ExamRoutineDownload.propTypes = {};

export default ExamRoutineDownload;
