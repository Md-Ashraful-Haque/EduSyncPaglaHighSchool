import PropTypes from "prop-types";

import showBangla from "../../../utils/utilsFunctions/engNumberToBang";

import { useMarksInputBySubjectContext } from "ContextAPI/MarksInputBySubjectContext";
import schoolLogo from "../../../assets/images/eduSyncLogo.svg";
import React, { useMemo } from "react";

const MarksheetTableBody = ({
  singleMarksheetForStudent,
  highest_marks,
  instituteLogo,
}) => {
  const { bySubjectVars } = useMarksInputBySubjectContext();

  const allMarkTypes = Array.from(
    new Set(
      singleMarksheetForStudent.subjects.flatMap((subj) =>
        subj.marks.map((m) => m.mark_type)
      )
    )
  );

  // console.log('singleMarksheetForStudent: ', singleMarksheetForStudent);
  // console.log("highest_marks : ", highest_marks);
  const highestMarksMap = useMemo(() => {
    return highest_marks.reduce((acc, item) => {
      acc[item.subject] = item;
      return acc;
    }, {});
  }, [highest_marks]);

  // Helper function to calculate total marks for a pair of subjects (First Paper + Second Paper)
  const calculatePairTotalMarks = (
    subjects,
    firstPaperCode,
    secondPaperCode
  ) => {
    let totalSum = 0;

    const relevantSubjects = subjects.filter(
      (subject) =>
        subject.subject_code === firstPaperCode ||
        subject.subject_code === secondPaperCode
      // subject.subject_name_bangla === firstPaperCode ||
      // subject.subject_name_bangla === secondPaperCode
    );

    relevantSubjects.forEach((subject) => {
      ["WR", "MCQ", "Practical"].forEach((type) => {
        const fallbackType = type === "WR" ? "CA" : null;
        const fallbackType2 = type === "WR" ? "Theory" : null;

        const match = subject.marks.find(
          (m) =>
            m.mark_type === type ||
            (fallbackType && m.mark_type === fallbackType) ||
            (fallbackType2 && m.mark_type === fallbackType2)
        );

        const mark = match ? match.marks : 0;
        if (mark !== "-" && mark !== -1 && typeof mark === "number") {
          totalSum += mark;
        }
      });
    });

    return totalSum;
  };

  // Check if adjustments are needed for each language pair
  // Bangla First Paper and Bangla Second Paper Code
  const banglaTotal = calculatePairTotalMarks(
    singleMarksheetForStudent.subjects,
    "g-91001",
    "g-91002"
  );

  // English First Paper and English Second Paper Code
  const englishTotal = calculatePairTotalMarks(
    singleMarksheetForStudent.subjects,
    "g-91003",
    "g-91004"
  );

  const needsBanglaAdjustment = banglaTotal === 159;
  const needsEnglishAdjustment = englishTotal === 159;

  // Helper function to check if current subject is first paper of a language pair
  const isFirstPaper = (subject) => {
    // console.log("Subject subject_code: ",subject.subject_code);
    return (
      subject.subject_code === "g-91001" || subject.subject_code === "g-91003"
      // subject.subject_name === "Bangla First Paper" ||
      // subject.subject_name === "English First Paper" ||
      // subject.subject_name_bangla === "বাংলা ১ম পত্র" || // Add Bangla names if needed
      // subject.subject_name_bangla === "ইংরেজি ১ম পত্র"
    );
  };

  return (
    <tbody style={{ position: "relative" }}>
      {singleMarksheetForStudent.subjects.map(
        (subject, index) =>
          (subject.total_marks > -1 ||
            subject.pass_marks == 50 ||
            !subject.is_optional) && (
            <tr
              key={index}
              className={`text-center border  noto-bangla-regular !border-indigo-500 ${
                index == 0 || index == 1 || (index % 2 == 0 && index > 3)
                  ? "!bg-blue-200/80 "
                  : ""
              } `}
            >
              <td className="py-1 px-2 !min-w-[180px] max-w-[250px] text-left border !border-indigo-500">
                {bySubjectVars.isBangla
                  ? subject.subject_name_bangla
                  : subject.subject_name}
                {/* -{subject.id} */}
                {/* -{subject.is_optional} */}
              </td>
              <td className="py-1 px-2 border !border-indigo-500">
                {bySubjectVars.isBangla
                  ? showBangla(subject.full_marks)
                  : subject.full_marks}
              </td>

              {/* //////////////////// Pass marks ///////////////////////////////// */}

              {subject.is_displayed_on_marksheet && (
                // <td  rowSpan={subject.is_combined ? 2 : 1} className="py-1 px-2 border !border-indigo-500">
                //   {bySubjectVars.isBangla && subject.total_marks >= 0
                //     ? showBangla(subject.combined_total_marks)
                //     : subject.combined_total_marks < 0
                //     ? "-"
                //     : subject.combined_total_marks}
                // </td>

                <td
                  rowSpan={subject.is_combined ? 2 : 1}
                  className="py-1 px-2 border !border-indigo-500"
                >
                  {bySubjectVars.isBangla
                    ? showBangla(subject.pass_marks)
                    : subject.pass_marks}
                </td>
              )}

              {/* /////////////////////////////////////////////////////////////////////////////////////////
              /////////////////////////////////// Without Adjustment //////////////////////////////////
              ///////////////////////////////////////////////////////////////////////////////////////// */}

              {/* {["WR", "MCQ", "Practical"].map((type) => {
                const fallbackType = type === "WR" ? "CA" : null;
                const fallbackType2 = type === "WR" ? "Theory" : null;
                
                const match = subject.marks.find(
                  (m) =>
                    m.mark_type === type ||
                    (fallbackType && m.mark_type === fallbackType) ||
                    (fallbackType2 && m.mark_type === fallbackType2)
                );

                const mark = match ? match.marks : "-";
                const finalMarks = mark === -1 ? "A" : mark;

                const displayMarks = bySubjectVars.isBangla
                  ? finalMarks !== "A" && finalMarks !== "-"
                    ? showBangla(finalMarks)
                    : finalMarks
                  : finalMarks;
                // totalMarksofAllType = totalMarksofAllType + displayMarks;
                return (
                  <td
                    key={type}
                    className="py-1 px-2 border !border-indigo-500"
                  >
                    {displayMarks}
                  </td>
                );
              })} */}

              {/* /////////////////////////////////////////////////////////////////////////////////////////
              /////////////////////////////////// With Adjustment //////////////////////////////////
              ///////////////////////////////////////////////////////////////////////////////////////// */}
              {["WR", "MCQ", "Practical"].map((type) => {
                const fallbackType = type === "WR" ? "CA" : null;
                const fallbackType2 = type === "WR" ? "Theory" : null;

                const match = subject.marks.find(
                  (m) =>
                    m.mark_type === type ||
                    (fallbackType && m.mark_type === fallbackType) ||
                    (fallbackType2 && m.mark_type === fallbackType2)
                );

                let mark = match ? match.marks : "-";

                // Add +1 to written marks based on language pair totals
                if (
                  type === "WR" &&
                  mark !== "-" &&
                  mark !== -1 &&
                  typeof mark === "number" &&
                  isFirstPaper(subject)
                ) {
                  // Only adjust first paper to avoid double adjustment

                  // Check if this is Bangla and needs adjustment
                  if (
                    subject.subject_code?.includes("g-91001") &&
                    needsBanglaAdjustment
                  ) {
                    mark = mark + 1;
                  }
                  // Check if this is English and needs adjustment
                  else if (
                    subject.subject_code?.includes("g-91003") &&
                    needsEnglishAdjustment
                  ) {
                    mark = mark + 1;
                  }
                }

                const finalMarks = mark === -1 ? "A" : mark;

                const displayMarks = bySubjectVars.isBangla
                  ? finalMarks !== "A" && finalMarks !== "-"
                    ? showBangla(finalMarks)
                    : finalMarks
                  : finalMarks;

                return (
                  <td
                    key={type}
                    className="py-1 px-2 border !border-indigo-500"
                  >
                    {displayMarks}
                  </td>
                );
              })}

              {subject.is_displayed_on_marksheet && (
                <td
                  rowSpan={subject.is_combined ? 2 : 1}
                  className="py-1 px-2 border !border-indigo-500"
                >
                  {bySubjectVars.isBangla && subject.total_marks >= 0
                    ? showBangla(subject.combined_total_marks)
                    : subject.combined_total_marks < 0
                    ? "-"
                    : subject.combined_total_marks}
                </td>
              )}

              {/* Show Letter Grade */}

              {subject.is_displayed_on_marksheet && (
                <td rowSpan={subject.is_combined ? 2 : 1}>
                  <span
                    className={`px-2 inline-flex items-center  text-xs font-semibold rounded-full min-w-[32px] ${
                      subject.total_marks > 0
                        ? subject.grade_and_point[0] === "Fail"
                          ? "bg-red-100 text-red-800"
                          : "bg-green-100 text-green-800"
                        : ""
                    }`}
                  >
                    {subject.total_marks >= 0
                      ? subject.grade_and_point[0]
                      : "-"}
                  </span>
                </td>
              )}

              {/* Show Grade Point */}
              {subject.is_displayed_on_marksheet && (
                <td
                  rowSpan={subject.is_combined ? 2 : 1}
                  className="py-1 px-2 border !border-indigo-500"
                >
                  {subject.total_marks > 0
                    ? bySubjectVars.isBangla
                      ? showBangla(subject.grade_and_point[1])
                      : subject.grade_and_point[1]
                    : "-"}
                </td>
              )}

              <td
                className="py-1 px-2  border !border-indigo-500 fontSize-10 !min-w-[90px]"
                id="highest-marks"
              >
                {(() => {
                  const highestData = highestMarksMap[subject.id];

                  return highestData ? (
                    <>
                      {bySubjectVars.isBangla
                        ? showBangla(highestData.highest_marks)
                        : highestData.highest_marks}{" "}
                      (
                      {bySubjectVars.isBangla
                        ? highestData.section_name_display
                        : highestData.section_name}
                      ,{" "}
                      {bySubjectVars.isBangla
                        ? showBangla(highestData.roll)
                        : highestData.roll}
                      {/* -{highestData.subject} */})
                    </>
                  ) : (
                    <span>—</span>
                  );
                })()}
              </td>
              {/* <td className="py-1 px-2 border !border-indigo-500">-</td> */}
            </tr>
          )
      )}
    </tbody>
  );
};

MarksheetTableBody.propTypes = {
  singleMarksheetForStudent: PropTypes.shape({
    subjects: PropTypes.arrayOf(
      PropTypes.shape({
        subject_name_bangla: PropTypes.string,
        full_marks: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
        pass_marks: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
        marks: PropTypes.arrayOf(
          PropTypes.shape({
            marks: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
            mark_type: PropTypes.string,
          })
        ),
        total_marks: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
        grade_and_point: PropTypes.array,
      })
    ),
  }).isRequired,
  highest_marks: PropTypes.array.isRequired,
};

export default MarksheetTableBody;
