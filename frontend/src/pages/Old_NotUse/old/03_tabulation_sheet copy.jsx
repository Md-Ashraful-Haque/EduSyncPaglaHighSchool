import StudentResultForTabulation from "../04_student_result_for_tabulation";
import PropTypes from "prop-types";

import React from "react";
// import ToggleLanguage from "../00-result-components/toggleResult";

// import { useMarksInputBySubjectContext } from "../../../ContextAPI/MarksInputBySubjectContext";
import { useMarksInputBySubjectContext } from "../../../../ContextAPI/MarksInputBySubjectContext";

const TabulationSheet = ({
  examAndInstituteInfo,
  showBangla,
  results,
  highest_marks,
  all_subject,
}) => {
  const { bySubjectVars, updateBySubjectVars } =
    useMarksInputBySubjectContext();
  // updateBySubjectVars("isBangla", isBangla);
  // console.log("bySubjectVars", bySubjectVars);
  const firstStudent = results[0];

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


  return (
    <div className="tabulation-sheet-container">

      <div className="tabulation-header">
        <div className="tabulation-student-info">
          <div className="class">
            <strong> {bySubjectVars.isBangla ? "শ্রেণি: " : "Class: "} </strong>{" "}
            {bySubjectVars.isBangla
              ? firstStudent.class_name
              : firstStudent.class_name_in_english}
          </div>
          <div className="group">
            <strong> {bySubjectVars.isBangla ? "বিভাগ: " : "Group: "} </strong>{" "}
            {bySubjectVars.isBangla
              ? firstStudent.group_name_in_bangla
              : firstStudent.group_name}
          </div>
          <div className="section">
            <strong> {bySubjectVars.isBangla ? "শাখা:: " : "Section: "}</strong>{" "}
            {bySubjectVars.isBangla
              ? firstStudent.section_name_display
              : firstStudent.section_name}
          </div>
        </div>
        <div className="title">
          <span>
            {" "}
            {bySubjectVars.isBangla ? "টেবুলেশন শীট" : "Tabulation Sheet"}{" "}
          </span>
        </div>

        <div className="tabulation-institute-info">
          <div className="logo">
            <img src={examAndInstituteInfo.institute_logo} alt="School Logo" />
          </div>
          <div className="institute-name">
            {bySubjectVars.isBangla
              ? examAndInstituteInfo.institute_name
              : examAndInstituteInfo.institute_name_eng}
          </div>
          <div className="tabulation-exam-name">
            {bySubjectVars.isBangla
              ? examAndInstituteInfo.exam_name +
                "-" +
                showBangla(examAndInstituteInfo.year)
              : examAndInstituteInfo.exam_name_in_english +
                "-" +
                examAndInstituteInfo.year}
          </div>
        </div>
      </div>

      <div className="tabulation-sheet">
        <table className="min-w-full bg-gray-100  noto-bangla-regular ">
          <thead>
            <tr className="text-center noto-bangla-regular">
              <td rowSpan={2} className=" ">
                {bySubjectVars.isBangla ? "রোল" : "Roll"}
              </td>
              <td rowSpan={2} className=" ">
                {bySubjectVars.isBangla ? "শিক্ষার্থীর নাম" : "Student Name"}
              </td>
              {Object.entries(subjectMarkTypes).map(
                ([subjectName, markTypes], index) => (
                  <td
                    key={`subject-${subjectName}-${index}`}
                    colSpan={markTypes.length === 1 ? 1 : markTypes.length + 1}
                    className=" "
                  >
                    {/* {bySubjectVars.isBangla ? subjectName : subjectName} */}
                    {subjectName}
                  </td>
                )
              )}
              <td rowSpan={2} className=" ">
                {" "}
                {bySubjectVars.isBangla
                  ? "মোট প্রাপ্ত নম্বর"
                  : "Total marks obtained"}{" "}
              </td>
              <td rowSpan={2} className=" ">
                {" "}
                {bySubjectVars.isBangla ? "জিপিএ" : "GPA"}{" "}
              </td>
              <td rowSpan={2} className=" ">
                {" "}
                {bySubjectVars.isBangla ? "ফলাফল" : "Result"}{" "}
              </td>
              <td rowSpan={2} className=" ">
                {" "}
                {bySubjectVars.isBangla
                  ? "অকৃতকার্য বিষয়"
                  : "Failed subjects"}{" "}
              </td>
              {/* <td rowSpan={2} className=" ">T.Mark</td>
            <td rowSpan={2} className=" ">GPA</td>
            <td rowSpan={2} className=" ">Result</td> */}
            </tr>

            <tr className="text-center noto-bangla-regular">
              {Object.entries(subjectMarkTypes).map(
                ([subjectName, markTypes], index) => (
                  <React.Fragment key={`subject-${subjectName}-${index}`}>
                    {markTypes.map((markType, i) => (
                      <td key={`${subjectName}-${markType}-${i}`}>
                        {markType.slice(0, 4)}{" "}
                        {/* Display first 4 characters of mark type */}
                      </td>
                    ))}
                    {markTypes.length === 1 ? "" : <td className=" ">Total</td>}
                    {/* <td className=" ">Total</td> */}
                  </React.Fragment>
                )
              )}
            </tr>
          </thead>

          <tbody>
            {results.map((student) => (
              <StudentResultForTabulation
                key={1}
                singleMarksheetForStudent={student}
                highest_marks={highest_marks}
              />
            ))}

            {/* {chunkArray(results, 3).map((chunk) => ( 
              <>
                {chunk.map((student) => (
                  <StudentResultForTabulation
                    key={1}
                    singleMarksheetForStudent={student}
                    highest_marks={highest_marks}
                  />

                )) }
                <span className="w-4"> ---------------------------- </span>
              </>
            ))}
             */}
          </tbody>
        </table>
      </div> 
    </div>
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
