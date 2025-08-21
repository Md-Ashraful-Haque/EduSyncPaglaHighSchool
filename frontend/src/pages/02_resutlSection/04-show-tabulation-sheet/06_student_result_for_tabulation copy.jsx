import React from "react";
import PropTypes from "prop-types";
import showBangla from "../../../utils/utilsFunctions/engNumberToBang";
import { useMarksInputBySubjectContext } from "ContextAPI/MarksInputBySubjectContext";


// StudentResult component
const StudentResultForTabulation = ({ resultOfOneStudent, indexForColor }) => {
  const { bySubjectVars } = useMarksInputBySubjectContext();
  
  return (
    <tr
      className={`text-center noto-bangla-regular text-gray-800  ${
        indexForColor % 2 != 0 ? "!bg-blue-50" : ""
      }`}
    >
      <td className=" ">
        {bySubjectVars.isBangla
          ? showBangla(resultOfOneStudent.roll_number)
          : resultOfOneStudent.roll_number}
      </td>
      <td className="min-w-[120px] text-left pl-2">
        {bySubjectVars.isBangla
          ? showBangla(resultOfOneStudent.student_name)
          : resultOfOneStudent.student_name}
      </td>
      {/* <td className=" ">{showBangla(subject.subject_name_bangla)}</td> */}
      {resultOfOneStudent.subjects.map((subject, index) => (
        <React.Fragment key={index}>
          {/* {subject.marks.length === 1 ? <td className=" ">-</td> : ""} */}
          {subject.marks.map((mark, i) => (
            mark.marks > 0? (
            <td key={i} className=" ">
              {bySubjectVars.isBangla ? showBangla(mark.marks) : mark.marks}
            </td>
            ) : <td key={i} className=" ">-</td>
          ))}

          {/* /////////////////////////////// Total marks ///////////////////////////////////// */}
          {subject.marks.length === 1 ? (
            ""
          ) : (
            <td>
              {" "}
              <span
                className={` ${
                  subject.grade_and_point[1] == 0 && subject.total_marks > 0? "underline bg-red-100 text-red-600 rounded-lg p-1"
                    : ""
                } `}
              > 
                {subject.total_marks > 0 ? (
                bySubjectVars.isBangla
                  ? showBangla(subject.total_marks)
                  : subject.total_marks 

                  ) : "-" }
              </span>
            </td>
          )}
        </React.Fragment>
      ))}

      <td className="">
        {bySubjectVars.isBangla
          ? showBangla(resultOfOneStudent.total_obtained_marks)
          : resultOfOneStudent.total_obtained_marks}
      </td>
      <td className=" ">
        {bySubjectVars.isBangla
          ? showBangla(resultOfOneStudent.gpa.toFixed(2))
          : resultOfOneStudent.gpa.toFixed(2)}
      </td>
      <td className=" ">{resultOfOneStudent.letter_grade} { resultOfOneStudent.letter_grade === "Fail" ? " (" + resultOfOneStudent.total_fail_subjects + ")" : ""}</td>
      {/* <td className=" ">
        {bySubjectVars.isBangla
          ? showBangla(resultOfOneStudent.total_fail_subjects)
          : resultOfOneStudent.total_fail_subjects}
      </td> */}
    </tr>
  );
};

StudentResultForTabulation.propTypes = {
  resultOfOneStudent: PropTypes.node.isRequired,
  indexForColor: PropTypes.isRequired,
};

export default StudentResultForTabulation;
