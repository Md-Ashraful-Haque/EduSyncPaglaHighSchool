import PropTypes from "prop-types";

import showBangla from "../../../utils/utilsFunctions/engNumberToBang";

import { useMarksInputBySubjectContext } from "ContextAPI/MarksInputBySubjectContext";
import React from "react";

const MarksheetTableBody = ({ highest_marks, student, index }) => {
  const { bySubjectVars } = useMarksInputBySubjectContext();
  // console.log(student);
  return (
    <React.Fragment>
      
        <tr
          className={`text-center border  noto-bangla-regular !border-indigo-500 ${
            index % 2 == 0 ? "!bg-blue-100" : ""
          } `}
        >
          <td className="py-1 px-2  border !border-indigo-500">
            {bySubjectVars.isBangla
              ? showBangla(student.classwise_merit)
              : student.classwise_merit}
          </td>
          <td className="py-1 px-2 border !min-w-[180px] max-w-[250px] text-left  !border-indigo-500">
            {student.student_name}
          </td>
          <td className="py-1 px-2 border !border-indigo-500">
            {bySubjectVars.isBangla
              ? showBangla(student.roll_number)
              : student.roll_number}
          </td>
          <td className="py-1 px-2 border !border-indigo-500">
            {bySubjectVars.isBangla ? showBangla(student.shift) : student.shift}
          </td>

          <td className="py-1 px-2 border !border-indigo-500">
            {bySubjectVars.isBangla
              ? student.section_name_display
              : student.section_name}
          </td>

          <td className="py-1 px-2 border !border-indigo-500">
            {bySubjectVars.isBangla
              ? showBangla(student.sectionwise_merit)
              : student.sectionwise_merit}
          </td>
          <td className="py-1 px-2 border !border-indigo-500">
            <span
              className={`px-2 inline-flex items-center  text-xs font-semibold rounded-full min-w-[32px] ${
                student.gpa == 0.0
                  ? "bg-red-100 text-red-800"
                  : "bg-green-100 text-green-800"
              }`}
            >
              {bySubjectVars.isBangla
                ? showBangla(student.gpa.toFixed(2))
                : student.gpa.toFixed(2)}
            </span>
          </td>
          <td className="py-1 px-2 border !border-indigo-500">
            {student.letter_grade}{ student.letter_grade === "Fail" ? " (" + student.total_fail_subjects + ")" : ""}
          </td>
          <td
            className="py-1 px-2  border !border-indigo-500 fontSize-10 !min-w-[90px]"
            id="highest-marks"
          >
            {bySubjectVars.isBangla
              ? showBangla(student.total_obtained_marks)
              : student.total_obtained_marks}
          </td>
        </tr> 
    </React.Fragment>
  );
};

MarksheetTableBody.propTypes = {
  highest_marks: PropTypes.array.isRequired,
  student: PropTypes.isRequired,
};

export default MarksheetTableBody;
