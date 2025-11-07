// import React, { useState } from "react";
// import PropTypes from "prop-types";
// import MarksheetTableHeader from "./92_marksheet_table_header";
// import MarksheetTableBody from "./93_marksheet_table_body";
// ////////////////////////////////////////////////////
// ////////////////////////////////////////////////////
// const MeritReportTable = ({ results, highest_marks }) => {
//   // Helper function to chunk array into groups of size n
//   const chunkArray = (array, size) => {
//     const chunks = [];
//     for (let i = 0; i < array.length; i += size) {
//       chunks.push(array.slice(i, i + size));
//     }
//     return chunks;
//   };

//   const merit_report_pages = chunkArray(results, 30);
//   const no_of_pages = merit_report_pages.length;

//   return ( 
//     <React.Fragment>
//       {merit_report_pages.map((chunk, index) => (
//         <div key={index} className="tabulation-sheet-container">
//           <div className="tabulation-sheet">
//             <table className="min-w-full noto-bangla-regular ">
//               <MarksheetTableHeader />

//               <tbody>
//                 {chunk.map((student, index) => (
//                   <MarksheetTableBody
//                     highest_marks={highest_marks}
//                     student={student}
//                     index={index}
//                     key={index}
//                   />
//                 ))}
//               </tbody>
//             </table>
//           </div>

//           <div className="page-number">
//             {index + 1} | {no_of_pages}
//           </div>
//         </div>
//       ))}
//     </React.Fragment>
//   );
// };

// MeritReportTable.propTypes = {
//   results: PropTypes.node.isRequired,
//   highest_marks: PropTypes.any,
// };

// export default MeritReportTable;
import React from "react";
import PropTypes from "prop-types";
import MarksheetTableHeader from "./92_marksheet_table_header";
import MarksheetTableBody from "./93_marksheet_table_body";

const MeritReportTable = ({ results, highest_marks }) => {
  // Custom pagination: 30 on first page, 45 on others
  const paginateResults = (array) => {
    const pages = [];
    let start = 0;

    // First page: 30 records
    pages.push(array.slice(start, start + 30));
    start += 30;

    // Other pages: 45 records each
    while (start < array.length) {
      pages.push(array.slice(start, start + 36));
      start += 45;
    }

    return pages;
  };

  const merit_report_pages = paginateResults(results);
  const no_of_pages = merit_report_pages.length;

  // console.log("results",results[0]);

  const classOrGroup = (results[0]?.class_name_in_english == "Ten" || results[0]?.class_name_in_english =="Nine") ? "Merit (Groupwise)": "Merit (Classwise)";

  return (
    <React.Fragment>
      {merit_report_pages.map((chunk, index) => (
        <div key={index} className="tabulation-sheet-container">
          <div className="tabulation-sheet">
            <table className="min-w-full noto-bangla-regular">
              <MarksheetTableHeader classOrGroup={classOrGroup}/>

              <tbody>
                {chunk.map((student, i) => (
                  <MarksheetTableBody
                    highest_marks={highest_marks}
                    student={student}
                    index={i}
                    key={i}
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
    </React.Fragment>
  );
};

MeritReportTable.propTypes = {
  results: PropTypes.array.isRequired, // should be array, not node
  highest_marks: PropTypes.any,
};

export default MeritReportTable;
