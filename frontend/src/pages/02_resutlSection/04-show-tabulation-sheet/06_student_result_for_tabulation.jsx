import React from "react";
import PropTypes from "prop-types";
import showBangla from "../../../utils/utilsFunctions/engNumberToBang";
import { useMarksInputBySubjectContext } from "ContextAPI/MarksInputBySubjectContext";


// StudentResult component
const StudentResultForTabulation = ({ singleMarksheetForStudent, indexForColor,resultOption, serialNo }) => {
  // console.log(" singleMarksheetForStudent : ", singleMarksheetForStudent);
  const { bySubjectVars } = useMarksInputBySubjectContext();
  const resultOfOneStudent = singleMarksheetForStudent; 
  return (
    <tr
      className={`text-center noto-bangla-regular text-gray-800  ${
        indexForColor % 2 != 0 ? "!bg-blue-50" : ""
      }`}
    >
      {
      /*
      <td className=" ">
        {bySubjectVars.isBangla
          ? showBangla(serialNo)
          : serialNo}
      </td>
      */
      }

      <td className=" ">
        {bySubjectVars.isBangla
          ? showBangla(resultOfOneStudent.roll_number)
          : resultOfOneStudent.roll_number}
        {!resultOption.section && (
          <>({resultOfOneStudent.section_name_display})</>
        )}
      </td>

      <td className="max-w-[120px] text-left pl-2 pr-3 overflow-hidden text-ellipsis whitespace-nowrap">
        {bySubjectVars.isBangla
          ? showBangla(resultOfOneStudent.student_name)
          : resultOfOneStudent.student_name}
      </td>
      {/* <td className=" ">{showBangla(subject.subject_name_bangla)}</td> */}
      {resultOfOneStudent.subjects.map((subject, index) => (
        <React.Fragment key={index}>
          {/* {subject.marks.length === 1 ? <td className=" ">-</td> : ""} */}
          {subject.marks.map((mark, i) =>
            mark.marks > -1 ? (
              <td key={i} className=" ">
                <span
                  className={` ${
                    subject.grade_and_point_tabu[1] == 0 &&
                    subject.total_marks > -1 &&
                    subject.marks.length === 1 && mark.marks < 33
                      ? "underline bg-red-100 text-red-600 rounded-lg"
                      : ""
                  } `}
                >
                  {bySubjectVars.isBangla ? showBangla(mark.marks) : mark.marks}
                </span>
              </td>
            ) : (
              <td key={i} className=" ">
                A
              </td>
            )
          )}

          {/* /////////////////////////////// Total marks ///////////////////////////////////// */}
          {subject.marks.length === 1 ? (
            ""
          ) : (
            <td>
              {" "}
              <span
                className={` ${
                  subject.grade_and_point_tabu[1] == 0 && subject.total_marks > -1
                    ? "underline bg-red-100 text-red-600 rounded-lg"
                    : subject.grade_and_point_tabu[1] == 5
                    ? "underline bg-green-100 text-green-600 rounded-lg"
                    : ""
                } `}
              >
                {subject.total_marks > -1
                  ? bySubjectVars.isBangla
                    ? showBangla(subject.total_marks)
                    : subject.total_marks
                  : "-"}
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

      <td className="result-col">
        {resultOfOneStudent.letter_grade === "Fail"
          ? "F"
          : resultOfOneStudent.letter_grade}{" "}
        {resultOfOneStudent.letter_grade === "Fail"
          ? "(" + resultOfOneStudent.total_fail_subjects + ")"
          : ""}
      </td>
      {/* <td className=" ">
        {bySubjectVars.isBangla
          ? showBangla(resultOfOneStudent.total_fail_subjects)
          : resultOfOneStudent.total_fail_subjects}
      </td> */}
    </tr>
  );
};

StudentResultForTabulation.propTypes = {
  singleMarksheetForStudent: PropTypes.node.isRequired,
  indexForColor: PropTypes.isRequired,
};

export default StudentResultForTabulation;
