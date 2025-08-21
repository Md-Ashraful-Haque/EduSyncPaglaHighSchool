import PropTypes from "prop-types";
import SubjectTable from "./04_subject_table";
import GraddingTable from "./03_gradding_table";
import MarksheetFooter from "./05_marksheet_footer";
import MarksheetSignature from "./06_marksheet_signature";

const Marksheet = ({ student, highest_marks, schoolLogo, showBangla,examAndInstituteInfo }) => {
  return (
    <>
      <div className="single-marksheet ">
        <div className="marksheet-header">
          <div className="school-info hind-siliguri-regular">
            <div className="logo">
              <img src={examAndInstituteInfo.institute_logo} alt="School Logo" /> 
            </div>
            <h3> {examAndInstituteInfo.institute_name} </h3>
            <h4> মার্কশিট</h4>
            <h6>{examAndInstituteInfo.exam_name}-{showBangla(examAndInstituteInfo.year)}</h6>
          </div>

          {/* Gradding Table with Marks Range */}
          <GraddingTable />
        </div>

        <div className="student-info hind-siliguri-bold">
          <div className="name"> নাম: {student.student_name} </div>
          <div className="roll_number">
            রোল: {showBangla(student.roll_number)}
          </div>
          <div className="class_name"> শ্রেণি: {student.class_name} </div>
          <div className="group_name"> বিভাগ: {student.group_name} </div>
          <div className="section"> শাখা: {student.section_name_display} </div>
        </div>

        <SubjectTable
          singleMarksheetForStudent={student}
          highest_marks={highest_marks}
        />

        <MarksheetFooter showBangla={showBangla} student={student} />

        <MarksheetSignature headTeacherSignature={examAndInstituteInfo.signature} />
      </div>
    </>
  );
};

Marksheet.propTypes = {
  student: PropTypes.object.isRequired,
  highest_marks: PropTypes.object.isRequired,
  schoolLogo: PropTypes.string.isRequired,
  showBangla: PropTypes.func.isRequired,
  examAndInstituteInfo: PropTypes.shape({
    institute_name: PropTypes.string.isRequired,
    institute_logo: PropTypes.string.isRequired,
    exam_name: PropTypes.string,
    year: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    signature: PropTypes.string.isRequired,
  }).isRequired,
};

export default Marksheet;
