import PropTypes from "prop-types";
import { useMarksInputBySubjectContext } from "ContextAPI/MarksInputBySubjectContext";

const MarksheetFooter = ({ showBangla, student }) => {
  const { bySubjectVars } = useMarksInputBySubjectContext();

  return (
    <div id="notTen" className="footer">
      <div className="result-and-grading-table">
        <div className="result-table">

          <div className="result-box rank">
            <div className="text">
              {bySubjectVars.isBangla
                ? "সর্বমোট প্নম্বর"
                : "Total Marks"}{" "}
            </div>
            <div className="value">
              {bySubjectVars.isBangla
                ? showBangla(student.total_obtained_marks)
                : student.total_obtained_marks}
            </div>
          </div>

          <div className="result-box letter-grade">
            <div className="text">
              {bySubjectVars.isBangla ? "লেটার গ্রেড" : "Letter Grade"}{" "}
            </div>
            <div className="value">{student.letter_grade}</div>
          </div>

          <div className="result-box gpa">
            <div className="text">
              {bySubjectVars.isBangla ? "জিপিএ" : "GPA"}
            </div>
            <div className="value">
              {bySubjectVars.isBangla
                ? showBangla(student.gpa.toFixed(2))
                : student.gpa.toFixed(2)}
            </div>
          </div>

          <div className="result-box rank">
            <div className="text">
              {bySubjectVars.isBangla
                ? "মেধাক্রম(শ্রেণিতে)"
                : "Merit(Class)"}
            </div>
            <div className="value">
              {bySubjectVars.isBangla
                ? showBangla(student.classwise_merit)
                : student.classwise_merit}
            </div>
          </div>

          <div className="result-box rank">
            <div className="text">
              {bySubjectVars.isBangla
                ? "মেধাক্রম(শাখায়)"
                : "Merit(Section)	"}
            </div>
            <div className="value">
              {bySubjectVars.isBangla
                ? showBangla(student.sectionwise_merit)
                : student.sectionwise_merit}
            </div>
          </div>


        </div> 
      </div>
    </div>
  );
};

MarksheetFooter.propTypes = {
  showBangla: PropTypes.func.isRequired,
  student: PropTypes.isRequired,
};

export default MarksheetFooter;
