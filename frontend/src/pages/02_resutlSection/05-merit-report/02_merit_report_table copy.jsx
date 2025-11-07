import React, { useState } from "react";
import PropTypes from "prop-types";
import MarksheetTableHeader from "./92_marksheet_table_header";
import MarksheetTableBody from "./93_marksheet_table_body";
////////////////////////////////////////////////////
////////////////////////////////////////////////////
const MeritReportTable = ({ results, highest_marks }) => {
  // Helper function to chunk array into groups of size n
  const chunkArray = (array, size) => {
    const chunks = [];
    for (let i = 0; i < array.length; i += size) {
      chunks.push(array.slice(i, i + size));
    }
    return chunks;
  };

  const merit_report_pages = chunkArray(results, 30);
  const no_of_pages = merit_report_pages.length;

  return ( 
    <React.Fragment>
      {merit_report_pages.map((chunk, index) => (
        <div key={index} className="tabulation-sheet-container">
          <div className="tabulation-sheet">
            <table className="min-w-full noto-bangla-regular ">
              <MarksheetTableHeader />

              <tbody>
                {chunk.map((student, index) => (
                  <MarksheetTableBody
                    highest_marks={highest_marks}
                    student={student}
                    index={index}
                    key={index}
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
  results: PropTypes.node.isRequired,
  highest_marks: PropTypes.any,
};

export default MeritReportTable;
