
import PropTypes from 'prop-types';


import React from "react";

import FullScreenModal from "pageComponents/02_full_screen_window";
import showBangla from "../../../utils/utilsFunctions/engNumberToBang";
import {ArrowsPointingOutIcon,ArrowsPointingInIcon } from '@heroicons/react/24/solid';
import schoolLogo from "../../../assets/images/eduSyncLogo.svg"; 
import Marksheet from './02_marksheet';

import { useMarksInputBySubjectContext } from "ContextAPI/MarksInputBySubjectContext";  

const TableBody = ({ results, highest_marks, examAndInstituteInfo, expandedRows,isModalOpen, handleModalClose , toggleRow}) => { 

  const { bySubjectVars, updateBySubjectVars} = useMarksInputBySubjectContext(); 
  return (
   <>
    <tbody >
      {results.map((student) => (
        <React.Fragment key={student.id}>
          <tr className=" text-center">
            <td className="py-2 px-3  text-left">
              {student.student_name}
            </td>
            <td className="py-2 px-3 ">
              {bySubjectVars.isBangla? showBangla(student.roll_number) : student.roll_number}
            </td>
            <td className="py-2 px-3 ">
              {bySubjectVars.isBangla?  showBangla(student.classwise_merit): student.classwise_merit}
            </td>
            <td className="py-2 px-3 ">
              {bySubjectVars.isBangla?  showBangla(student.sectionwise_merit): student.sectionwise_merit}
            </td>
            <td className="py-2 px-3 ">{bySubjectVars.isBangla?  student.group_name_in_bangla: student.group_name }</td>
            <td className="py-2 px-3 ">{ bySubjectVars.isBangla?  student.section_name_display : student.section_name }</td>
            <td className="py-2 px-3 ">
              {bySubjectVars.isBangla?  showBangla(student.gpa.toFixed(2)) : student.gpa.toFixed(2)}
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
              {bySubjectVars.isBangla?  showBangla(student.total_obtained_marks) : student.total_obtained_marks}
            </td>
            <td className="py-2 px-3 ">
              <span
                className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                  student.total_fail_subjects != "0"
                    ? "bg-red-100 text-red-800"
                    : " "
                }`}
              >
                { bySubjectVars.isBangla?  showBangla(student.total_fail_subjects) : student.total_fail_subjects} 
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
   </>
  );
}
TableBody.propTypes = {
  results: PropTypes.array.isRequired,
  highest_marks: PropTypes.any,
  examAndInstituteInfo: PropTypes.object.isRequired,
  expandedRows: PropTypes.object,
  isModalOpen: PropTypes.bool,
  handleModalClose: PropTypes.func,
  toggleRow: PropTypes.func,
};

export default TableBody;