import React, { useState } from "react";
import PropTypes from "prop-types";
import showBangla from "../../../utils/utilsFunctions/engNumberToBang";
// import FullScreenModal from "pageComponents/02_full_screen_window";

// import SubjectTable from "./04_student_result_for_tabulation";

import { generatePDFLegal } from "../../../utils/utilsFunctions/pdfDownloadLegal";
// import Marksheet from "./02_marksheet";

import OpenNewTabWithHeader from "./07_marksheetWithNewTab";
import TabulationSheet from "./03_tabulation_sheet";
import { useMarksInputBySubjectContext } from "../../../ContextAPI/MarksInputBySubjectContext";
import ToggleLanguage from "pageComponents/toggleResult";
////////////////////////////////////////////////////
////////////////////////////////////////////////////
const ResultTable = ({
  results,
  highest_marks,
  schoolLogo,
  examAndInstituteInfo,
  resultOption,
  all_subject
}) => {

  const { bySubjectVars, updateBySubjectVars} = useMarksInputBySubjectContext();

  console.log("bySubjectVars", bySubjectVars);

  if (!results || results.length === 0) {
    return (
      <p className="font-hind-siliguri text-center mt-4">
        কোন ফলাফল পাওয়া যায়নি
      </p>
    );
  }


  // Construct filename from first student
  const firstStudent = results[0];
  const fileName = firstStudent
    ? `${firstStudent.class_name}-${firstStudent.group_name}-${firstStudent.section_name_display}-মার্কশীট.pdf`
    : "marksheets.pdf";

  return (
    <div className="mt-6 p-4 result-list">
      <div className="downloadFullResult">

        <TabulationSheet
          examAndInstituteInfo={examAndInstituteInfo}
          showBangla={showBangla}
          results={results}
          highest_marks={highest_marks}
          all_subject={all_subject}
          resultOption={resultOption}
        />

        <div className="print-button">
          <ToggleLanguage />
          {/* <button
            onClick={() =>
              generatePDFLegal(
                "result-list-container",
                "tabulation-sheet-container",
                fileName,
                "landscape", 
                "legal",
                355.6,
                215.9
              )
            }
            className="button-1"
          >
            ডাউনলোড টেবুলেশনশীট
          </button> */}

          {/* /////////// New window for Download high resulation Pdf ////////////////////// */}
          <OpenNewTabWithHeader
            examAndInstituteInfo={examAndInstituteInfo}
            showBangla={showBangla}
            results={results}
            highest_marks={highest_marks}
            all_subject={all_subject}
            // isBangla={bySubjectVars.isBangla}
            bySubjectVars={bySubjectVars}
            resultOption={resultOption}
          />
        </div>

      </div>
    </div>
  );
};

ResultTable.propTypes = {
  results: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
      student_name: PropTypes.string.isRequired,
      roll_number: PropTypes.string.isRequired,
      class_name: PropTypes.string.isRequired,
      classwise_merit: PropTypes.string.isRequired,
      sectionwise_merit: PropTypes.string.isRequired,
      group_name: PropTypes.string.isRequired,
      section_name_display: PropTypes.string.isRequired,
      gpa: PropTypes.number.isRequired,
      letter_grade: PropTypes.string.isRequired,
      total_obtained_marks: PropTypes.number.isRequired,
      total_fail_subjects: PropTypes.string.isRequired,
    })
  ).isRequired,
  highest_marks: PropTypes.object.isRequired,
  examAndInstituteInfo: PropTypes.shape({
    institute_name: PropTypes.string.isRequired,
    institute_logo: PropTypes.string.isRequired,
    exam_name: PropTypes.string,
    year: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    signature: PropTypes.string.isRequired,
    class_name: PropTypes.string.isRequired,
  }).isRequired,
  resultOption: PropTypes.object.isRequired, // Assuming resultOption is an object
};

export default ResultTable;
