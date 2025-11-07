import PropTypes from "prop-types";
import SubjectTable from "./04_subject_table";
import GraddingTable from "./03_gradding_table";
import MarksheetFooter from "./05_marksheet_footer";
import MarksheetSignature from "./06_marksheet_signature";
import StudentInfoForMarksheet from "./92_student_info_for_marksheet";
import { useMarksInputBySubjectContext } from "ContextAPI/MarksInputBySubjectContext";
import schoolLogo from "../../../assets/images/eduSyncLogo.svg"; 
const Marksheet = ({
  student,
  highest_marks, 
  showBangla,
  examAndInstituteInfo,
}) => {
  const { bySubjectVars } = useMarksInputBySubjectContext();

  return (
    <>
      <div className="single-marksheet  ">
        <div
          style={{
            backgroundImage: `url(${examAndInstituteInfo.institute_logo})`, 
            backgroundSize: 'contain',
            backgroundRepeat: 'no-repeat',
            backgroundPosition: 'center',
            opacity: 0.1,
            position: 'absolute',
            width: '60%',
            height: '60%',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)', // Perfect centering
            zIndex: 0,
          }}
        />
        <div className="marksheet-header">
          <div className="school-info hind-siliguri-regular">
            <div className="logo">
              <img
                src={examAndInstituteInfo.institute_logo}
                alt="School Logo"
              />
            </div>
            <h3>
              {bySubjectVars.isBangla
                ? examAndInstituteInfo.institute_name
                : examAndInstituteInfo.institute_name_eng}
            </h3>
            <h4> {bySubjectVars.isBangla ? "মার্কশিট" : "Marksheet"} </h4>
            <h6>
              {bySubjectVars.isBangla
                ? examAndInstituteInfo.exam_name +
                  "-" +
                  showBangla(examAndInstituteInfo.year)
                : examAndInstituteInfo.exam_name_in_english +
                  "-" +
                  examAndInstituteInfo.year}
            </h6>
          </div>

          {/* Gradding Table with Marks Range */}
          <GraddingTable />
        </div>

        <StudentInfoForMarksheet student={student} />

        <SubjectTable
          singleMarksheetForStudent={student}
          highest_marks={highest_marks}
          examAndInstituteInfo={examAndInstituteInfo}
        />

        <MarksheetFooter showBangla={showBangla} student={student} />

        <MarksheetSignature
          examAndInstituteInfo={examAndInstituteInfo}
          bySubjectVars={bySubjectVars}
        />
      </div>
    </>
  );
};

Marksheet.propTypes = {
  student: PropTypes.object.isRequired,
  highest_marks: PropTypes.object.isRequired, 
  showBangla: PropTypes.func.isRequired,
  examAndInstituteInfo: PropTypes.shape({
    institute_name: PropTypes.string.isRequired,
    institute_name_eng: PropTypes.string.isRequired,
    institute_logo: PropTypes.string.isRequired,
    exam_name: PropTypes.string,
    exam_name_in_english: PropTypes.string,
    year: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    signature: PropTypes.string.isRequired,
  }).isRequired,
};

export default Marksheet;
