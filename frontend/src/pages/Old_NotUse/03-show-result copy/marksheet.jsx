import PropTypes from "prop-types";
import SubjectTable from "./subject_table";
import GraddingTable from "./gradding_table";
import MarksheetFooter from "./marksheet_footer";
import MarksheetSignature from "./marksheet_signature";

const Marksheet = ({ student, highest_marks, schoolLogo, showBangla }) => {
  return (
    <>
      <div className="single-marksheet ">
        <div className="marksheet-header">
          <div className="school-info hind-siliguri-regular">
            <div className="logo">
              <img src={schoolLogo} alt="School Logo" />
            </div>
            <h3>কেরানিরহাট হাই স্কুল ও কলেজ, রংপুর </h3>
            <h4> মার্কশিট</h4>
            <h6>বার্ষিক/নির্বাচনী পরীক্ষা-2025</h6>
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

        <MarksheetSignature schoolLogo={schoolLogo} />
      </div>
    </>
  );
};

Marksheet.propTypes = {
  student: PropTypes.object.isRequired,
  highest_marks: PropTypes.object.isRequired,
  schoolLogo: PropTypes.string.isRequired,
  showBangla: PropTypes.func.isRequired,
};

export default Marksheet;
