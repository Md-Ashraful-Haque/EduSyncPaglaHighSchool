import { useState } from "react";
import PropTypes from "prop-types";
// import FullScreenModal  from './02_full_screen_window';
import FullScreenModal from "pageComponents/02_full_screen_window";
import showBangla from "../../../utils/utilsFunctions/engNumberToBang";
// import SingleMarksheet from './subject_table';
// import {ArrowsPointingOutIcon,ArrowsPointingInIcon } from '@heroicons/react/24/solid';
import schoolLogo from "../../../assets/images/eduSyncLogo.svg";

import { generatePDF } from "../../../utils/utilsFunctions/pdfDownload";
import Marksheet from "./02_marksheet";
import { useMarksInputBySubjectContext } from "ContextAPI/MarksInputBySubjectContext";
import ToggleLanguage from "pageComponents/toggleResult";
import OpenNewTabWithHeader from "./07_marksheetWithNewTab";

import TableHeader from "./90-table-header";
import TableBody from "./91-table-body";

import { ResultContextAPIProvider } from "ContextAPI/MarksInputBySubjectContext";
// ResultTable component
// import './print-pdf.scss';

////////////////////////////////////////////////////
////////////////////////////////////////////////////
const ResultTable = ({
  results,
  highest_marks,
  examAndInstituteInfo,
  resultOption,
}) => {
  const { bySubjectVars } = useMarksInputBySubjectContext();

  const [expandedRows, setExpandedRows] = useState({});
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [sdtID, setStdID] = useState("");

  const handleModalClose = () => {
    setIsModalOpen(!isModalOpen);
    // console.log("handleModalClose: ", isModalOpen);
    toggleRow(sdtID);
    setStdID("");
  };

  const toggleRow = (studentId) => {
    setExpandedRows((prev) => ({
      ...prev,
      [studentId]: !prev[studentId],
    }));

    setIsModalOpen(!isModalOpen);
    setStdID(studentId);
    // console.log("toggleRow: ", isModalOpen);
  };

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
    <div className="mt-6 p-8 result-list">
      <h5 className="text-sm hind-siliguri-bold mb-4 ">
        {resultOption.class ? "শ্রেণি ভিত্তিক" : "শাখা ভিত্তিক"} ফলাফল :{" "}
        <span className="text-blue-500">{examAndInstituteInfo.class_name}</span>
      </h5>
      <div className="overflow-x-auto rounded-lg overflow-hidden shadow-lg bg-white border border-gray-200">
        <table className="min-w-full bg-white border border-gray-200 rounded-lg overflow-hidden ">
          <TableHeader bySubjectVars={bySubjectVars} />
          <TableBody
            results={results}
            highest_marks={highest_marks}
            examAndInstituteInfo={examAndInstituteInfo}
            expandedRows={expandedRows}
            isModalOpen={isModalOpen}
            handleModalClose={handleModalClose}
            toggleRow={toggleRow}
          />
        </table>
      </div>

      <div className="downloadFullResult">
        {expandedRows["full_marksheet"] && (
          <FullScreenModal isOpen={isModalOpen} onClose={handleModalClose}>
            {results.map((student) => (
              <Marksheet
                key={1}
                student={student}
                highest_marks={highest_marks}
                schoolLogo={schoolLogo}
                showBangla={showBangla}
                examAndInstituteInfo={examAndInstituteInfo}
              />
            ))}

            {/* <div className="download-button">
              <ToggleLanguage />
              
              <button
                onClick={() =>
                  generatePDF(
                    "result-list-container",
                    "single-marksheet",
                    fileName
                  )
                }
                className="button-1"
              >
                ডাউনলোড মার্কশীট
              </button>


            </div> */}
          </FullScreenModal>
        )}

        <div className="print-button">
          {/* print-button scss in 04-show-tabulation-sheet folder */}
          <ToggleLanguage />
          <button
            onClick={() => toggleRow("full_marksheet")} // Toggle for full marksheet and let here id is "full_marksheet"
            className="button-1"
          >
            সকল মার্কশীট দেখুন
          </button>
          <OpenNewTabWithHeader
            divContent={
              <ResultContextAPIProvider initialValues={bySubjectVars}>
                {results.map((student) => (
                  <Marksheet
                    key={1}
                    student={student}
                    highest_marks={highest_marks}
                    schoolLogo={schoolLogo}
                    showBangla={showBangla}
                    examAndInstituteInfo={examAndInstituteInfo}
                  />
                ))}
              </ResultContextAPIProvider>
            }
          />
        </div>
      </div>
    </div>
  );
};

ResultTable.propTypes = {
  results: PropTypes.node.isRequired,
  highest_marks: PropTypes.any,
  examAndInstituteInfo: PropTypes.object.isRequired,
  resultOption: PropTypes.object.isRequired,
};

export default ResultTable;
