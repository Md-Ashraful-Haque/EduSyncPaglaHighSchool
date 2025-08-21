import { useMarksInputBySubjectContext } from "ContextAPI/MarksInputBySubjectContext";
import showBangla from "../../../utils/utilsFunctions/engNumberToBang";
import PropTypes from "prop-types";

const TabulationHeader = ({ firstStudent, examAndInstituteInfo, resultOption }) => {
  const { bySubjectVars } = useMarksInputBySubjectContext(); 
  return (
    <>
    <div className="tabulation-header">
      <div className="tabulation-student-info">
        <div className="year-shift">
          <div className="year">
            <div className="label">
              {bySubjectVars.isBangla ? "সেশন" : "Session"}
            </div>
            <div className="value">
              {" : "} 
              {bySubjectVars.isBangla
                ? showBangla(firstStudent.year)
                : firstStudent.year}
            </div>
          </div>

          <div className="shift">
            <div className="label">
              {bySubjectVars.isBangla ? "শিফট" : "Shift "}
            </div>
            <div className="value">
              {" : "}
              {bySubjectVars.isBangla
                ? showBangla(firstStudent.shift)
                : firstStudent.shift}
            </div>
          </div>
        </div>

        <div className="class-group-section">
          <div className="class">
            <div className="label">
              {bySubjectVars.isBangla ? "শ্রেণি" : "Class"}
            </div>
            <div className="value">
              {" : "}
              {bySubjectVars.isBangla
                ? firstStudent.class_name
                : firstStudent.class_name_in_english}
            </div>
          </div>
          <div className="group">
            <div className="label">
              {bySubjectVars.isBangla ? "বিভাগ" : "Group"}
            </div>
            <div className="value">
              {" : "}
              {bySubjectVars.isBangla
                ? firstStudent.group_name_in_bangla
                : firstStudent.group_name}
            </div>
          </div>
          {/* //////////////////////////////// show it if sectionwise //////////////////////// */}
          {resultOption.section &&(
            <div className="section">
              <div className="label">
                {bySubjectVars.isBangla ? "শাখা" : "Section"}
              </div>
              <div className="value">
                {" : "}
                {bySubjectVars.isBangla
                  ? firstStudent.section_name_display
                  : firstStudent.section_name}
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="title">
        <span>
          
          {bySubjectVars.isBangla ? "টেবুলেশন শীট" : "Tabulation Sheet"}
        </span>
      </div>

      <div className="tabulation-institute-info">
        <div className="logo">
          <img src={examAndInstituteInfo.institute_logo} alt="School Logo" />
        </div>
        <div className="institute-name">
          {bySubjectVars.isBangla
            ? examAndInstituteInfo.institute_name
            : examAndInstituteInfo.institute_name_eng}
        </div>
        <div className="tabulation-exam-name">
          {bySubjectVars.isBangla
            ? examAndInstituteInfo.exam_name +
              "-" +
              showBangla(examAndInstituteInfo.year)
            : examAndInstituteInfo.exam_name_in_english +
              "-" +
              examAndInstituteInfo.year}
        </div>
      </div>
    </div>
    
    
    </>
  );
};
TabulationHeader.propTypes = {
  firstStudent: PropTypes.object.isRequired,
  examAndInstituteInfo: PropTypes.object.isRequired,
};

export default TabulationHeader;
