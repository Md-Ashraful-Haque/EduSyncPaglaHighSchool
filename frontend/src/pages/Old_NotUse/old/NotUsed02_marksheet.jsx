import PropTypes from "prop-types";
import SubjectTable from "../04_student_result_for_tabulation"; 

const Marksheet = ({
  student,
  highest_marks, 
}) => {
  return (
    <> 
      <SubjectTable
        singleMarksheetForStudent={student}
        highest_marks={highest_marks}
      />
    </>
  );
};

Marksheet.propTypes = {
  student: PropTypes.object.isRequired,
  highest_marks: PropTypes.object.isRequired, 
};

export default Marksheet;
