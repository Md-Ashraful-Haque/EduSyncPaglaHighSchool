import React, { useState } from "react";
import PropTypes from "prop-types";
// import FullScreenModal  from './02_full_screen_window';
import FullScreenModal from "pageComponents/02_full_screen_window";
import showBangla from "../../../../utils/utilsFunctions/engNumberToBang";
// import SingleMarksheet from './subject_table';
import {ArrowsPointingOutIcon,ArrowsPointingInIcon } from '@heroicons/react/24/solid';
import schoolLogo from "../../../assets/images/eduSyncLogo.svg";

import { generatePDF } from '../../../../utils/utilsFunctions/pdfDownload';
import Marksheet from './02_marksheet';

import OpenNewTabWithHeader from './07_marksheetWithNewTab';
// StudentResult component
// import './print-pdf.scss';

////////////////////////////////////////////////////
////////////////////////////////////////////////////
const StudentResult = ({ results, highest_marks, examAndInstituteInfo, resultOption}) => {
  const [expandedRows, setExpandedRows] = useState({});

  const [isModalOpen, setIsModalOpen] = useState(false);
  
  const [sdtID, setStdID] = useState("");
  
  const handleModalClose = () => {
      setIsModalOpen(!isModalOpen);
      console.log("handleModalClose: ", isModalOpen);
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
    : 'marksheets.pdf';
  

  return (
    <div className="mt-6 p-8 result-list">
      <h5 className="text-sm hind-siliguri-bold mb-4 ">
          {resultOption.class? "শ্রেণি ভিত্তিক":"শাখা ভিত্তিক"} ফলাফল : <span className="text-blue-500">{examAndInstituteInfo.class_name}</span>
        </h5>
      <div className="overflow-x-auto rounded-lg overflow-hidden shadow-lg bg-white border border-gray-200">
        <table className="min-w-full bg-white border border-gray-200 rounded-lg overflow-hidden ">
          <thead>
            <tr className="bg-gradient-to-r from-blue-500 to-purple-600 text-white text-center hind-siliguri-regular">
              <th className="py-2 px-3 ">নাম</th>
              <th className="py-2 px-3 ">রোল</th>
              <th className="py-2 px-3 ">ক্লাস মেধা</th>
              <th className="py-2 px-3 ">শাখা মেধা</th>
              <th className="py-2 px-3 ">বিভাগ</th>
              <th className="py-2 px-3 ">শাখা</th>
              <th className="py-2 px-3 ">জিপিএ</th>
              <th className="py-2 px-3 ">গ্রেড</th>
              <th className="py-2 px-3 ">মোট নম্বর</th>
              <th className="py-2 px-3 ">ফেল বিষয়</th>
              <th className="py-2 px-3 ">বিস্তারিত</th>
            </tr>
          </thead>
          <tbody>
            {results.map((student) => (
              <React.Fragment key={student.id}>
                <tr className=" text-center">
                  <td className="py-2 px-3  text-left">
                    {student.student_name}
                  </td>
                  <td className="py-2 px-3 ">
                    {showBangla(student.roll_number)}
                  </td>
                  <td className="py-2 px-3 ">
                    {showBangla(student.classwise_merit)}
                  </td>
                  <td className="py-2 px-3 ">
                    {showBangla(student.sectionwise_merit)}
                  </td>
                  <td className="py-2 px-3 ">{student.group_name}</td>
                  <td className="py-2 px-3 ">{student.section_name_display}</td>
                  <td className="py-2 px-3 ">
                    {showBangla(student.gpa.toFixed(2))}
                  </td>
                  <td className={"py-2  "}>
                    <span
                      className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        student.letter_grade === "Fail"
                          ? "bg-red-100 text-red-800"
                          : "bg-green-100 text-green-800"
                      }`}
                    >
                      {student.letter_grade}
                    </span>

                    {/* {student.letter_grade} */}
                  </td>
                  <td className="py-2 px-3 ">
                    {showBangla(student.total_obtained_marks)}
                  </td>
                  <td className="py-2 px-3 ">
                    <span
                      className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        student.total_fail_subjects != "0"
                          ? "bg-red-100 text-red-800"
                          : " "
                      }`}
                    >
                      {showBangla(student.total_fail_subjects)}
                    </span>
                  </td>
                  <td className="py-2 px-3 ">
                    <button
                      onClick={() => toggleRow(student.id)}
                      className="text-blue-500 hover:underline flex items-center justify-center mx-auto px-4 py-1"
                    >
                      {expandedRows[student.id] ? (
                        <ArrowsPointingInIcon className="h-5 w-5" />
                      ) : (
                        <ArrowsPointingOutIcon className="h-5 w-5" />
                      )}
                    </button>
                  </td>
                </tr>
                {expandedRows[student.id] && (
                  ////////////////////////// Subject Based Result ////////////////////////////////////
                  <tr>
                    <td colSpan="11" className="py-2 px-4 ">
                      <div className="font-hind-siliguri">
                        {/* <h6 className="hind-siliguri-bold mb-2">
                          বিষয় ভিত্তিক ফলাফল
                        </h6> */}

                        <FullScreenModal
                          isOpen={isModalOpen}
                          onClose={handleModalClose}
                        >
                          <Marksheet
                            student={student}
                            highest_marks={highest_marks}
                            schoolLogo={schoolLogo}
                            showBangla={showBangla}
                            examAndInstituteInfo={examAndInstituteInfo}
                          />
                        </FullScreenModal>
                      </div>
                    </td>
                  </tr>
                )}
              </React.Fragment>
            ))}
          </tbody>
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

            <div className="download-button">
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
            </div>
          </FullScreenModal>
        )}

        <button
          onClick={() => toggleRow("full_marksheet")} // Toggle for full marksheet and let here id is "full_marksheet"
          className="button-1"
        >
          সকল মার্কশীট দেখুন
        </button>

        <OpenNewTabWithHeader divContent={ results.map((student) => (
              <Marksheet
                key={1}
                student={student}
                highest_marks={highest_marks}
                schoolLogo={schoolLogo}
                showBangla={showBangla}
                examAndInstituteInfo={examAndInstituteInfo}
              />
            ))} />
      </div>
    </div>
  );
};

StudentResult.propTypes = {
  results: PropTypes.node.isRequired,
};

export default StudentResult;
