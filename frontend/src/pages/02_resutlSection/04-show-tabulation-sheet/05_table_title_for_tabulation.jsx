import { useMarksInputBySubjectContext } from "ContextAPI/MarksInputBySubjectContext";
import PropTypes from "prop-types";
import React from "react";

const TableTitle = ({ subjectMarkTypes }) => {
  const { bySubjectVars } = useMarksInputBySubjectContext();

  return (
    <thead className="bg-gray-200">
      <tr className="text-center noto-bangla-regular">
        {/* <td rowSpan={2} className=" ">
          {bySubjectVars.isBangla ? "ক্রমিক নং" : "S.N"}
        </td> */}
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
              {/* { markTypes.length === 1 ? subjectName :subjectName} */}
              { 
                markTypes.length === 1 
                  ? subjectName
                      .split(" ")
                      .map(word => word.charAt(0))
                      .join("") 
                  : subjectName.slice(0, 25)
              }
            </td>
          )
        )}
        <td rowSpan={2} className=" ">
          {" "}
          {bySubjectVars.isBangla
            ? "মোট প্রাপ্ত নম্বর"
            : "Total marks"}{" "}
        </td>
        <td rowSpan={2} className=" ">
          {" "}
          {bySubjectVars.isBangla ? "জিপিএ" : "GPA"}{" "}
        </td>
        <td rowSpan={2} className=" ">
          {" "}
          {bySubjectVars.isBangla ? "ফলাফল(অকৃ.)" : "Result"}
        </td>
        {/* <td rowSpan={2} className=" ">
          {" "}
          {bySubjectVars.isBangla ? "অকৃতকার্য বিষয়" : "Failed subjects"}{" "}
        </td> */}
      </tr>

      <tr className="text-center noto-bangla-regular">
        {Object.entries(subjectMarkTypes).map(
          ([subjectName, markTypes], index) => (
            <React.Fragment key={`subject-${subjectName}-${index}`}>
              {markTypes.map((markType, i) => (
                <td key={`${subjectName}-${markType}-${i}`} className="relative h-[30px]">
                  <span className="absolute w-[30px] text-left pl-1 -translate-x-1/2 -translate-y-1/2 -rotate-90 origin-center" > {markType.slice(0, 4)} </span>
                </td>
              ))}
              {markTypes.length === 1 ? "" : 
              <td className="relative h-[30px]" >
                <span className="absolute w-[30px] text-left pl-1 -translate-x-1/2 -translate-y-1/2 -rotate-90 origin-center">
                  Total
                </span>
              </td>}
            </React.Fragment>
          )
        )}
      </tr>
    </thead>
  );
};

TableTitle.propTypes = {
  subjectMarkTypes: PropTypes.object.isRequired,
};

export default TableTitle;
