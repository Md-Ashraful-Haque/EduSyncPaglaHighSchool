import PropTypes from "prop-types";
import { useMarksInputBySubjectContext } from "ContextAPI/MarksInputBySubjectContext";

const MarksheetFooter = ({ showBangla, student }) => {
  const { bySubjectVars } = useMarksInputBySubjectContext();
  // console.log("student: ",student);
  return (
    // <div id="notTen" className="footer" >
    <div
        id="notTen"
        className={`footer ${
          student.class_name_in_english === "Ten-Voc" ||
          student.class_name_in_english === "Nine-Voc"
            ? "print:mb-20"
            : ""
        }`}
      >

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
              {bySubjectVars.isBangla ? "লেটার গ্রেড" : "Letter Grade"}  &nbsp;&nbsp;
            </div>
            <div className="value">{student.letter_grade}</div>
          </div>

          <div className="result-box gpa">
            <div className="text">
              {bySubjectVars.isBangla ? "জিপিএ" : "GPA(Without Optional)"} 
            </div>
            <div className="value">
              {bySubjectVars.isBangla
                ? showBangla(student.gpa_without_optional.toFixed(2))
                : student.gpa_without_optional.toFixed(2)}
            </div>
          </div> 
        </div>


        <div className="result-table"> 
          <div className="result-box rank">
            <div className="text">
              {/* {bySubjectVars.isBangla ? "মেধাক্রম(শ্রেণিতে)" : "Merit(Class)"} */}

              {/* {(student?.class_name_in_english != "Six" && student?.class_name_in_english != "Seven" && student?.class_name_in_english != "Eight" )? bySubjectVars.isBangla ? "মেধাক্রম(বিভাগে)" : "Merit(Group)" : bySubjectVars.isBangla ? "মেধাক্রম(শ্রেণিতে)" : "Merit(Class)" } */}
                {(() => {
                  const isClassLevel = ["Six", "Seven", "Eight"].includes(student?.class_name_in_english);
                  const label = isClassLevel
                    ? (bySubjectVars.isBangla ? "মেধাক্রম(শ্রেণিতে)" : "Merit(Class)")
                    : (bySubjectVars.isBangla ? "মেধাক্রম(বিভাগে)" : "Merit(Group)");
                  return label;
                })()}

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
            
          

          <div className="result-box gpa">
            <div className="text">
              {bySubjectVars.isBangla ? "জিপিএ" : "GPA(With Optional)"}  &nbsp;&nbsp;&nbsp; &nbsp;
            </div>
            <div className="value">
              {bySubjectVars.isBangla
                ? showBangla(student.gpa.toFixed(2))
                : student.gpa.toFixed(2)}
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
