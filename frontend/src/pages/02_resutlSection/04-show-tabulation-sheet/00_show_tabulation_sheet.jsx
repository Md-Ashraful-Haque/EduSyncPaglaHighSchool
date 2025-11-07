import "./show_tabulation_sheet.scss";

import SelectFields from "pageComponents/SelectFields";

import YearSelector from "pageComponents/yearSelector/YearSelector";

import { useMarksInputBySubjectContext } from "ContextAPI/MarksInputBySubjectContext";
import ResultTable from "./01_result_table";
import FullScreenModal from "pageComponents/02_full_screen_window";

import { toast } from "react-toastify";

import { doGetAPIcall } from "Utils/utilsFunctions/UtilFuntions";
import { useAppContext } from "ContextAPI/AppContext";
import { useState } from "react";

import ClasswiseOrSectionwise from "pageComponents/classwise-or-sectionwise/ClasswiseOrSectionwise";
import YearAndShiftSelector from "pageComponents/year-and-shift-selector/YearAndShiftSelector";
import Loading_1 from "LoadingComponent/loading/Loading_1";

const ShowTabulationSheet = () => {
  const { createNewAccessToken } = useAppContext();
  const [examAndInstituteInfo, setExamAndInstituteInfo] = useState({}); // State for serializer data
  const [results, setResults] = useState([]); // State for serializer data
  const [highest_marks, setHighest_marks] = useState([]); // State for serializer data
  const [all_subject, setAllSubject] = useState([]); // State for serializer data
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

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
        "show-result",
        requestData
      );
      
      setResults(response.results || response); // Store serializer data
      setHighest_marks(response.highest_marks || response); // Store serializer data
      setExamAndInstituteInfo(response.exam_and_institute_info || response); // Store serializer data
      setAllSubject(response.all_subject_serializer || response); // Store serializer data

      // const sortedResults = [...all_subject].sort((a, b) => {
      //   return parseInt(a.roll_number, 10) - parseInt(b.roll_number, 10);
      // });

      // setAllSubject(sortedResults);

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
      <div className="generate-result ">
        <ClasswiseOrSectionwise
          Option={resultOption}
          updateOption={updateResultOption}
          heading={"টেবুলেশন শীট দেখার ফর্ম"}
        />

        <form onSubmit={handleSubmit}>
          <div className="field-selector-form-container">
            <div className="field-selector-form">
              <YearAndShiftSelector
                bySubjectVars={bySubjectVars}
                handleChange={handleChange}
                YearSelector={YearSelector}
              />

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
                টেবুলেশনশীট দেখুন
              </button>
            </div>
          </div>
        </form>

        {results.length > 0 && (
          <FullScreenModal isOpen={isModalOpen} onClose={handleModalClose}>
            <ResultTable
              results={results}
              highest_marks={highest_marks}
              examAndInstituteInfo={examAndInstituteInfo}
              resultOption={resultOption}
              all_subject={all_subject}
            />
          </FullScreenModal>
        )}
      </div>
    </>
  );
};

export default ShowTabulationSheet;
