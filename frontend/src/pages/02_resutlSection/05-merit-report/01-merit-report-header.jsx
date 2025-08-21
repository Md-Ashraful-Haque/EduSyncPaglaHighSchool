import PropTypes from "prop-types";

import showBangla from "../../../utils/utilsFunctions/engNumberToBang";
const MeritReportHeader = ({
  bySubjectVars,
  examAndInstituteInfo,
  firstStudent,
}) => {
  return (
    <div className="marksheet-header  min-w-full " id="merit-school-info">
      <div className="school-info hind-siliguri-regular">
        <div className="logo">
          <img src={examAndInstituteInfo.institute_logo} alt="School Logo" />
        </div>
        <h3>
          {bySubjectVars.isBangla
            ? examAndInstituteInfo.institute_name
            : examAndInstituteInfo.institute_name_eng}
        </h3>
        <h4> {bySubjectVars.isBangla ? "মেধা প্রতিবেদন" : "Merit Report "} </h4>

        <div className="flex gap-5 justify-center ">
          <div className="flex">
            <div className="label">
              {bySubjectVars.isBangla ? "সেশন" : "Session"}
            </div>
            <div className="value">
              :{" "}
              {bySubjectVars.isBangla
                ? showBangla(firstStudent.year)
                : firstStudent.year}
            </div>
          </div>
          <div className="flex">
            <div>{bySubjectVars.isBangla ? "শ্রেণি" : "Class"}</div>
            <div className="value">
              :{" "}
              {bySubjectVars.isBangla
                ? firstStudent.class_name
                : firstStudent.class_name_in_english}
            </div>
          </div>
          <div className="flex">
            <div className="label">
              {bySubjectVars.isBangla ? "বিভাগ" : "Group"}
            </div>
            <div className="value">
              :{" "}
              {bySubjectVars.isBangla
                ? firstStudent.group_name_in_bangla
                : firstStudent.group_name}
            </div>
          </div>
        </div>

        <div>
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
  );
};
MeritReportHeader.propTypes = {
  bySubjectVars: PropTypes.isRequired,
  examAndInstituteInfo: PropTypes.isRequired,
  firstStudent: PropTypes.isRequired,
};

export default MeritReportHeader;
