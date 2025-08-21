import StudentResultForTabulation from "./06_student_result_for_tabulation";
import PropTypes from "prop-types";

import React from "react";
// import ToggleLanguage from "../00-result-components/toggleResult";

import TabulationHeader from "./04_tabulation_header";
import TableTitle from "./05_table_title_for_tabulation";
import { useState } from "react";
// import { useMarksInputBySubjectContext } from "../../../ContextAPI/MarksInputBySubjectContext";
import { useMarksInputBySubjectContext } from "../../../ContextAPI/MarksInputBySubjectContext";

const TabulationSheet = ({
  examAndInstituteInfo, 
  results,
  highest_marks,
  all_subject,
  resultOption,
}) => {
  const { bySubjectVars } =
    useMarksInputBySubjectContext();
  // updateBySubjectVars("isBangla", isBangla);
  // console.log("bySubjectVars", bySubjectVars);
  const firstStudent = results[0];
  // const [serialNo, setSerialNo] = useState(0);

  // Create an object with subject_name_bangla as key and array of mark_type as value
  const getSubjectMarkTypes = () => {
    const subjectMarkTypes = {};
    let subjectName = "";
    all_subject.forEach((subject) => {
      // Use subject_name_bangla as the key
      if (bySubjectVars.isBangla) {
        subjectName = subject.subject_name_bangla;
      } else {
        subjectName = subject.subject_name;
      }
      // Initialize array if not exists
      if (!subjectMarkTypes[subjectName]) {
        subjectMarkTypes[subjectName] = [];
      }
      // Add each mark_type to the array, avoiding duplicates
      subject.marks.forEach((mark) => {
        // console.log("subjectName", subjectName);
        if (!subjectMarkTypes[subjectName].includes(mark.mark_type)) {
          subjectMarkTypes[subjectName].push(mark.mark_type);
        }
      });
    });
    return subjectMarkTypes;
  };

  const subjectMarkTypes = getSubjectMarkTypes();

  // Helper function to chunk array into groups of size n
  const chunkArray = (array, size) => {
    const chunks = [];
    for (let i = 0; i < array.length; i += size) {
      chunks.push(array.slice(i, i + size));
    }
    return chunks;
  };

  const tabulation_pages = chunkArray(results, 20);
  const no_of_pages = tabulation_pages.length;
  let serialNo = 0;

  // setSerialNo(0);

  return (
    <React.Fragment>
      
      {tabulation_pages.map((chunk, index) => (
        <div key={index} className="tabulation-sheet-container">
          <TabulationHeader
            firstStudent={firstStudent}
            examAndInstituteInfo={examAndInstituteInfo}
            resultOption={resultOption} 
          />
          <div className="tabulation-sheet">
            <table className="min-w-full noto-bangla-regular ">
              <TableTitle subjectMarkTypes={subjectMarkTypes} />

              <tbody>
                {chunk.map((student, index) => (
                  <StudentResultForTabulation
                    key={1}
                    singleMarksheetForStudent={student}
                    highest_marks={highest_marks}
                    indexForColor={index} 
                    resultOption={resultOption}
                    serialNo={serialNo}

                  />
                ))}
              </tbody>
            </table>
          </div>

          <div className="page-number">
            {index + 1} | {no_of_pages}
          </div>
        </div>
      ))}

      <div className="summary">
          {/* { examAndInstituteInfo.examAndInstituteInfo.summary.total_examinee } */}
          <table>
            {/* <caption>Examination Summary Statistics</caption> */}
            <tr>
                <th> </th>
                <th>Studnets</th>
                <th>Grade</th>
                <th>Studnets</th>
                <th> </th>
                <th>Value</th>
            </tr>
            <tr>
                <td>Total Examinees</td>
                <td>{ examAndInstituteInfo.summary.total_examinee }</td>
                <td>A+</td>
                <td>{ examAndInstituteInfo.summary.grade_a_plus }</td>
                <td>Average Marks</td>
                <td>{ examAndInstituteInfo.summary.avg_marks.toFixed(2) }</td>
            </tr>
            <tr>
                <td>Appeared</td>
                <td>{ examAndInstituteInfo.summary.appeared }</td>
                <td>A</td>
                <td>{ examAndInstituteInfo.summary.grade_a }</td>
                <td>Highest Marks</td>
                <td>{ examAndInstituteInfo.summary.highest_marks }</td>
            </tr>
            <tr>
                <td>Total Pass</td>
                <td>{ examAndInstituteInfo.summary.total_pass }</td>
                <td>A-</td>
                <td>{ examAndInstituteInfo.summary.grade_a_minus }</td>
                <td>Lowest Marks</td>
                <td>{ examAndInstituteInfo.summary.lowest_marks }</td>
            </tr>
            <tr>
                <td>Total Fail</td>
                <td>{ examAndInstituteInfo.summary.total_fail }</td>
                <td>B</td>
                <td>{ examAndInstituteInfo.summary.grade_b }</td>
                <td>Pass Percentage</td>
                <td>{ examAndInstituteInfo.summary.pass_percentage.toFixed(2) }%</td>
            </tr>
            <tr>
                <td></td>
                <td> </td>
                <td>D</td>
                <td>{ examAndInstituteInfo.summary.grade_d }</td>
                <td>Attendance Percentage</td>
                <td>{ examAndInstituteInfo.summary.attendance_percentage.toFixed(2) }%</td>
            </tr>
            <tr>
                <td></td>
                <td></td>
                <td>C</td>
                <td>{ examAndInstituteInfo.summary.grade_c }</td>
                <td> </td>
                <td> </td>
            </tr>
        </table>
      </div>
    </React.Fragment>
  );
};

TabulationSheet.propTypes = {
  examAndInstituteInfo: PropTypes.shape({
    institute_logo: PropTypes.string,
    institute_name: PropTypes.string,
    institute_name_eng: PropTypes.string,
    exam_name: PropTypes.string,
    exam_name_in_english: PropTypes.string,
    year: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  }).isRequired,
  showBangla: PropTypes.func.isRequired,
  results: PropTypes.array.isRequired,
  highest_marks: PropTypes.any,
  all_subject: PropTypes.array.isRequired,
};

export default TabulationSheet;
