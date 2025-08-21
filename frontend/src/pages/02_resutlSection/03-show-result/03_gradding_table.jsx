
import { useMarksInputBySubjectContext } from "ContextAPI/MarksInputBySubjectContext";

const GraddingTable = () => {
  const { bySubjectVars } = useMarksInputBySubjectContext();

  const gradingData = [
    { rangeEn: "80-100", rangeBn: "৮০-১০০", letterGrade: "A+", gradePointEn: "5.0", gradePointBn: "৫.০" },
    { rangeEn: "70-79", rangeBn: "৭০-৭৯", letterGrade: "A", gradePointEn: "4.0", gradePointBn: "৪.০" },
    { rangeEn: "60-69", rangeBn: "৬০-৬৯", letterGrade: "A-", gradePointEn: "3.5", gradePointBn: "৩.৫" },
    { rangeEn: "50-59", rangeBn: "৫০-৫৯", letterGrade: "B", gradePointEn: "3.0", gradePointBn: "৩.০" },
    { rangeEn: "40-49", rangeBn: "৪০-৪৯", letterGrade: "C", gradePointEn: "2.0", gradePointBn: "২.০" },
    { rangeEn: "33-39", rangeBn: "৩৩-৩৯", letterGrade: "D", gradePointEn: "1.0", gradePointBn: "১.০" },
    { rangeEn: "00-32", rangeBn: "০০-৩২", letterGrade: "Fail", gradePointEn: "0.0", gradePointBn: "০.০" },
  ];

  return (
    <div className="grading-table"> 
      <table className="w-full border-collapse bg-white border border-gray-50 rounded-lg ">
        <thead>
          <tr className="bg-blue-100 text-blue-1000">
            <th className=" text-center">Range</th>
            <th className=" text-center">L. Grade</th>
            <th className=" text-center">G. Point</th>
          </tr>
        </thead>
        <tbody>
          {gradingData.map((grade, index) => (
            <tr key={index} className="hover:bg-gray-100 even:bg-gray-50">
              <td className=" text-center">
                {bySubjectVars.isBangla ? grade.rangeBn : grade.rangeEn}
              </td>
              <td className=" text-center">{grade.letterGrade}</td>
              <td className=" text-center">
                {bySubjectVars.isBangla ? grade.gradePointBn : grade.gradePointEn}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default GraddingTable;



// import { useMarksInputBySubjectContext } from "ContextAPI/MarksInputBySubjectContext";


// const GraddingTable = () => {
// const { bySubjectVars } = useMarksInputBySubjectContext();

//   return (
//     <div className="grading-table">
//       <table>
//         <tr className="!bg-blue-100">
//           <th className="result-box-width"> Range </th>
//           <th className="result-box-width">L. Grade</th>
//           <th className="result-box-width">G. Point</th>
//         </tr>
//         <tr>
//           <td className="ta-center">{bySubjectVars.isBangla ? "৮০-১০০" : "80-100"}</td>
//           <td className="result-box-width">A+&nbsp;</td>
//           <td className="result-box-width">{bySubjectVars.isBangla ? "৫.০" : "5.0"</td>
//         </tr>
//         <tr>
//           <td className="ta-center">70-79</td>
//           <td>A &nbsp;&nbsp;</td>
//           <td>4.0</td>
//         </tr>
//         <tr>
//           <td className="ta-center">60-69</td>
//           <td>A- &nbsp;</td>
//           <td>3.5</td>
//         </tr>
//         <tr>
//           <td className="ta-center">50-59</td>
//           <td>B &nbsp;&nbsp;</td>
//           <td>3.0</td>
//         </tr>
//         <tr>
//           <td className="ta-center">40-49</td>
//           <td>C &nbsp;&nbsp;</td>
//           <td>2.0</td>
//         </tr>
//         <tr>
//           <td className="ta-center">33-39</td>
//           <td>D &nbsp;&nbsp;</td>
//           <td>1.0</td>
//         </tr>
//         <tr>
//           <td className="ta-center">0 - 32</td>
//           <td>Fail</td>
//           <td>0</td>
//         </tr>
//       </table>
//     </div>
//   );
// };

// export default GraddingTable;


// import { useMarksInputBySubjectContext } from "ContextAPI/MarksInputBySubjectContext";

// const GraddingTable = () => {
//   const { bySubjectVars } = useMarksInputBySubjectContext();

//   return (
//     <div className="grading-table">
//       <table>
//         <tr className="!bg-blue-100">
//           <th className="result-box-width"> Range </th>
//           <th className="result-box-width">L. Grade</th>
//           <th className="result-box-width">G. Point</th>
//         </tr>
//         <tr>
//           <td className="ta-center">{bySubjectVars.isBangla ? "৮০-১০০" : "80-100"}</td>
//           <td className="result-box-width">A+ </td>
//           <td className="result-box-width">{bySubjectVars.isBangla ? "৫.০" : "5.0"}</td>
//         </tr>
//         <tr>
//           <td className="ta-center">{bySubjectVars.isBangla ? "৭০-৭৯" : "70-79"}</td>
//           <td className="result-box-width">A </td>
//           <td className="result-box-width">{bySubjectVars.isBangla ? "৪.০" : "4.0"}</td>
//         </tr>
//         <tr>
//           <td className="ta-center">{bySubjectVars.isBangla ? "৬০-৬৯" : "60-69"}</td>
//           <td className="result-box-width">A- </td>
//           <td className="result-box-width">{bySubjectVars.isBangla ? "৩.৫" : "3.5"}</td>
//         </tr>
//         <tr>
//           <td className="ta-center">{bySubjectVars.isBangla ? "৫০-৫৯" : "50-59"}</td>
//           <td className="result-box-width">B </td>
//           <td className="result-box-width">{bySubjectVars.isBangla ? "৩.০" : "3.0"}</td>
//         </tr>
//         <tr>
//           <td className="ta-center">{bySubjectVars.isBangla ? "৪০-৪৯" : "40-49"}</td>
//           <td className="result-box-width">C </td>
//           <td className="result-box-width">{bySubjectVars.isBangla ? "২.০" : "2.0"}</td>
//         </tr>
//         <tr>
//           <td className="ta-center">{bySubjectVars.isBangla ? "৩৩-৩৯" : "33-39"}</td>
//           <td className="result-box-width">D </td>
//           <td className="result-box-width">{bySubjectVars.isBangla ? "১.০" : "1.0"}</td>
//         </tr>
//         <tr>
//           <td className="ta-center">{bySubjectVars.isBangla ? "০-৩২" : "0-32"}</td>
//           <td className="result-box-width">Fail</td>
//           <td className="result-box-width">{bySubjectVars.isBangla ? "০" : "0"}</td>
//         </tr>
//       </table>
//     </div>
//   );
// };

// export default GraddingTable;