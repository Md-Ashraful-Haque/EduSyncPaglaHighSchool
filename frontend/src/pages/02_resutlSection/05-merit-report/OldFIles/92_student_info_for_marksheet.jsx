import { useMarksInputBySubjectContext } from "ContextAPI/MarksInputBySubjectContext";
import showBangla from "../../../../utils/utilsFunctions/engNumberToBang";
import PropTypes from "prop-types";

const StudentInfoForMarksheet = ({ student }) => {
  const { bySubjectVars } = useMarksInputBySubjectContext();

  return (
    <div className="student-info hind-siliguri-medium">
      <div className="name mb-2 w-full text-start">
        <strong> {bySubjectVars.isBangla ? "নাম" : "Name"} : </strong>
        <span className="border-b"> {student.student_name} </span>
      </div>

      <div className="roll-to-shift flex items-start justify-between w-full">
        <div className="roll_number">
          <strong>{bySubjectVars.isBangla ? "রোল " : "Roll "} : </strong>
          {bySubjectVars.isBangla
            ? showBangla(student.roll_number)
            : student.roll_number}
        </div>

        <div className="roll_number">
          <strong>{bySubjectVars.isBangla ? "সেশন" : "Year/Session"} : </strong>
          {bySubjectVars.isBangla ? showBangla(student.year) : student.year}
        </div>

        <div className="roll_number">
          <strong> {bySubjectVars.isBangla ? "শিফট" : "Shift "} : </strong>
          {bySubjectVars.isBangla ? showBangla(student.shift) : student.shift}
        </div>
        <div className="class_name">
          <strong> {bySubjectVars.isBangla ? "শ্রেণি " : "Class "} : </strong>
          {bySubjectVars.isBangla
            ? student.class_name
            : student.class_name_in_english}
        </div>
        <div className="group_name">
          <strong> {bySubjectVars.isBangla ? "বিভাগ " : "Group "} : </strong>
          {bySubjectVars.isBangla
            ? student.group_name_in_bangla
            : student.group_name}
        </div>
        <div className="section">
          <strong> {bySubjectVars.isBangla ? "শাখা " : "Section "} : </strong>
          {bySubjectVars.isBangla
            ? student.section_name_display
            : student.section_name}
        </div>
      </div>
    </div>
  );
};

StudentInfoForMarksheet.propTypes = {
  student: PropTypes.shape({
    student_name: PropTypes.string,
    shift: PropTypes.string,
    year: PropTypes.string,
    roll_number: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    class_name: PropTypes.string,
    class_name_in_english: PropTypes.string,
    group_name_in_bangla: PropTypes.string,
    group_name: PropTypes.string,
    section_name_display: PropTypes.string,
    section_name: PropTypes.string,
  }).isRequired,
};

export default StudentInfoForMarksheet;
