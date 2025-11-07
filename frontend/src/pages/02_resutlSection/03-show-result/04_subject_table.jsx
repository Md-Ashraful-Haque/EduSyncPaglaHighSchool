import PropTypes from "prop-types"; 


import MarksheetTableHeader from "./92_marksheet_table_header";
import MarksheetTableBody from "./93_marksheet_table_body";
import MarksheetTableHeaderVocational from "./92_marksheet_table_header_vocational";
import MarksheetTableBodyVocational from "./93_marksheet_table_body_vocational";
// import schoolLogo from "../../../assets/images/eduSyncLogo.svg"; 
// StudentResult component
const SubjectTable = ({ singleMarksheetForStudent, highest_marks, examAndInstituteInfo }) => {
  

  return (
    <>
      <table className="min-w-full bg-gray-100 border  !border-indigo-50 noto-bangla-regular ">
        {examAndInstituteInfo.education_type == "general_high_school" ? (
          <>
            
            <MarksheetTableHeader />
            <MarksheetTableBody
              singleMarksheetForStudent={singleMarksheetForStudent}
              highest_marks={highest_marks}
              instituteLogo={examAndInstituteInfo.institute_logo}
            />
          </>
        ) : (
          <>
            <MarksheetTableHeaderVocational />
            <MarksheetTableBodyVocational
              singleMarksheetForStudent={singleMarksheetForStudent}
              highest_marks={highest_marks}
              instituteLogo={examAndInstituteInfo.institute_logo}
            />
          </>
        )}
      </table>
    </>
  );
};

SubjectTable.propTypes = {
  highest_marks: PropTypes.node.isRequired,
  singleMarksheetForStudent: PropTypes.node.isRequired,
  examAndInstituteInfo: PropTypes.node.isRequired,
};

export default SubjectTable;
