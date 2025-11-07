
import PropTypes from "prop-types";
import React, { useMemo, useState, useEffect } from "react";
import showBangla from "../../../utils/utilsFunctions/engNumberToBang";
import { useMarksInputBySubjectContext } from "ContextAPI/MarksInputBySubjectContext";
import { useAppContext } from "ContextAPI/AppContext";
import axios from "axios";
import { doGetAPIcall } from "Utils/utilsFunctions/UtilFuntions";
const MarksheetTableBody = ({ singleMarksheetForStudent, highest_marks }) => {
  const { bySubjectVars } = useMarksInputBySubjectContext();
  const { createNewAccessToken } = useAppContext();
  const [adjustments, setAdjustments] = useState({});

  // console.log("createNewAccessToken: ",createNewAccessToken);

  const highestMarksMap = useMemo(
    () =>
      highest_marks.reduce((acc, item) => {
        acc[item.subject] = item;
        return acc;
      }, {}),
    [highest_marks]
  );

  const apiUrl = import.meta.env.VITE_API_URL;

  useEffect(() => {
    const getAdjustMarks = async (e) => {
      try {
        const res = await doGetAPIcall(
          createNewAccessToken,
          "marks-adjustments",
          {}
        );
        // console.log("marks adjustment return:", res);
        const data = res.results || null;
        const rules = {};

        data.forEach((item) => {
          rules[item.target_marks] = item.adjustment;
        });

        setAdjustments(rules);

        // console.log("marks adjustment return:", data);
        // console.log("marks adjustment rules:", rules);
      } catch (error) {
        console.log("marks adjustment Error:", error);
      }
    };

    getAdjustMarks();
  }, []);

  const allMarkTypes = ["WR", "MCQ", "Practical"];

  // --- Helper to calculate subject pair totals (e.g. Bangla, English) ---
  const calculatePairTotalMarks = (subjects, codes) =>
    subjects
      .filter((s) => codes.includes(s.subject_code))
      .reduce((sum, subject) => {
        allMarkTypes.forEach((type) => {
          const fallbackTypes = type === "WR" ? ["CA", "Theory"] : [];
          const match = subject.marks.find(
            (m) => m.mark_type === type || fallbackTypes.includes(m.mark_type)
          );
          const mark = match?.marks ?? 0;
          if (mark !== "-" && mark !== -1 && typeof mark === "number") {
            sum += mark;
          }
        });
        return sum;
      }, 0);

  // --- Adjustment checker (from backend rules) ---
  const applyAdjustment = (total, adjustments) =>
    adjustments[total] ? total + adjustments[total] : total;

  // Example: adjustments passed from API
  // const adjustments = {
  //   79: 1,
  //   99: 1,
  //   119: 1,
  //   139: 1,
  //   159: 1,
  // };

  // Example pair totals
  const banglaTotal = calculatePairTotalMarks(
    singleMarksheetForStudent.subjects,
    ["g-91001", "g-91002"]
  );
  const englishTotal = calculatePairTotalMarks(
    singleMarksheetForStudent.subjects,
    ["g-91003", "g-91004"]
  );

  return (
    <tbody>
      {singleMarksheetForStudent.subjects.map((subject, index) => {
        const bgClass =
          index === 0 || index === 1 || (index % 2 === 0 && index > 3)
            ? "!bg-blue-200/80"
            : "";

        return (
          (subject.total_marks > -1 ||
            subject.pass_marks == 50 ||
            !subject.is_optional) && (
            <tr
              key={index}
              className={`text-center border noto-bangla-regular !border-indigo-500 ${bgClass}`}
            >
              {/* Subject Name */}
              <td className="py-1 px-2 !min-w-[180px] max-w-[250px] text-left border !border-indigo-500">
                {bySubjectVars.isBangla
                  ? subject.subject_name_bangla
                  : subject.subject_name}
              </td>

              {/* Full Marks */}
              <td className="py-1 px-2 border !border-indigo-500">
                {bySubjectVars.isBangla
                  ? showBangla(subject.full_marks)
                  : subject.full_marks}
              </td>

              {/* Pass Marks */}
              {subject.is_displayed_on_marksheet && (
                <td
                  rowSpan={subject.is_combined ? 2 : 1}
                  className="py-1 px-2 border !border-indigo-500"
                >
                  {bySubjectVars.isBangla
                    ? showBangla(subject.pass_marks)
                    : subject.pass_marks}
                </td>
              )}

              {/* Marks per Type with adjustment */}
              {allMarkTypes.map((type) => {
                const fallbackTypes = type === "WR" ? ["CA", "Theory"] : [];
                const match = subject.marks.find(
                  (m) =>
                    m.mark_type === type || fallbackTypes.includes(m.mark_type)
                );

                let mark = match ? match.marks : "-";

                if (
                  type === "WR" &&
                  mark !== "-" &&
                  mark !== -1 &&
                  typeof mark === "number"
                ) {
                  const total = subject.subject_code?.includes("g-91001")
                    ? banglaTotal
                    : subject.subject_code?.includes("g-91003")
                    ? englishTotal
                    : subject.total_marks;
                  
                  /////////////////////////////////////////
                  // add adjustment ///////////////////////
                  /////////////////////////////////////////
                  mark =
                    applyAdjustment(total, adjustments) !== total
                      ? mark + adjustments[total]
                      : mark;
                }

                const finalMarks = mark === -1 ? "A" : mark;
                const displayMarks =
                  bySubjectVars.isBangla &&
                  finalMarks !== "A" &&
                  finalMarks !== "-"
                    ? showBangla(finalMarks)
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

              {/* Combined Total */}
              {subject.is_displayed_on_marksheet && (
                <td
                  rowSpan={subject.is_combined ? 2 : 1}
                  className="py-1 px-2 border !border-indigo-500"
                >
                  {subject.combined_total_marks >= 0
                    ? bySubjectVars.isBangla
                      ? showBangla(subject.combined_total_marks)
                      : subject.combined_total_marks
                    : "-"}
                </td>
              )}

              {/* Grade */}
              {subject.is_displayed_on_marksheet && (
                <td rowSpan={subject.is_combined ? 2 : 1}>
                  <span
                    className={`px-2 inline-flex items-center text-xs font-semibold rounded-full min-w-[32px] ${
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

              {/* Grade Point */}
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

              {/* Highest Marks */}
              <td className="py-1 px-2 border !border-indigo-500 fontSize-10 !min-w-[90px]">
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
                      )
                    </>
                  ) : (
                    <span>—</span>
                  );
                })()}
              </td>
            </tr>
          )
        );
      })}
    </tbody>
  );
};

MarksheetTableBody.propTypes = {
  singleMarksheetForStudent: PropTypes.shape({
    subjects: PropTypes.array.isRequired,
  }).isRequired,
  highest_marks: PropTypes.array.isRequired,
};

export default MarksheetTableBody;
