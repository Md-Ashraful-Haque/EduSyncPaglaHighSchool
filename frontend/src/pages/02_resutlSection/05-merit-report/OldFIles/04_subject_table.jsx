import PropTypes from "prop-types"; 


import MarksheetTableHeader from "./92_marksheet_table_header";
import MarksheetTableBody from "./93_marksheet_table_body";

// StudentResult component
const SubjectTable = ({ singleMarksheetForStudent, highest_marks,student, index }) => {
  

  return (
    <>
      <table className="min-w-full bg-gray-100 border  !border-indigo-50 noto-bangla-regular "> 
        <MarksheetTableHeader />
        <MarksheetTableBody 
          singleMarksheetForStudent={singleMarksheetForStudent}
          highest_marks={highest_marks}
          student={student}
          index={index}
        /> 
      </table>
    </>
  );
};

SubjectTable.propTypes = {
  highest_marks: PropTypes.node.isRequired,
  singleMarksheetForStudent: PropTypes.node.isRequired,
};

export default SubjectTable;
