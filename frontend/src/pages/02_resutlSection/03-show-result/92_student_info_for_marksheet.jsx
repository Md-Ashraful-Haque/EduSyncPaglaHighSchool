import { useMarksInputBySubjectContext } from "ContextAPI/MarksInputBySubjectContext";
import showBangla from "../../../utils/utilsFunctions/engNumberToBang";
import PropTypes from "prop-types";

const StudentInfoForMarksheet = ({ student }) => {
  const { bySubjectVars } = useMarksInputBySubjectContext();

  return (
    <div className="student-info hind-siliguri-medium"> 
      <div className="roll_number mb-2 ">
        <div className="label" > {bySubjectVars.isBangla ? "নাম" : "Name"}  </div>: 
        <div className="text-[18px] font-bold italic pl-2">
          {student.student_name}
        </div>

      </div>

    {(student.student_fathers_name || student.student_mothers_name) &&(
      <div className="roll_number mb-2 !flex flex-row gap-12 align-center border-b border-dotted border-gray-800 mb-1">
        {student.student_fathers_name && (
        <div className=" flex align-center">
          <div className="label" > {bySubjectVars.isBangla ? "নাম" : "Father's Name"}  </div>: 
          <div className="text-[18px]  pl-2">
            {student.student_fathers_name}
          </div>
        </div>
         )} 

         {student.student_mothers_name && ( 
        <div className=" flex align-center">
          <div className="label" > {bySubjectVars.isBangla ? "নাম" : "Mother's Name"}  </div>: 
          <div className="text-[18px]  pl-2">
            {student.student_mothers_name}
          </div>
        </div>
          )} 

      </div>
        )} 

      <div className="roll-to-shift flex items-start border-b border-dotted border-gray-800 mb-1">
        <div className="roll_number">
          <div className="label" >{bySubjectVars.isBangla ? "রোল " : "Roll "}  </div>:  {" "}
          {bySubjectVars.isBangla
            ? showBangla(student.roll_number)
            : student.roll_number}
        </div>

        <div className="roll_number">
          <div  className="label" >{bySubjectVars.isBangla ? "সেশন" : "Year"}  </div>:  {" "}
          {bySubjectVars.isBangla ? showBangla(student.year) : student.year}
        </div>

        <div className="roll_number">
          <div  className="label" > {bySubjectVars.isBangla ? "শিফট" : "Shift "}  </div> : {" "}
          {bySubjectVars.isBangla ? showBangla(student.shift) : student.shift}
        </div> 
      </div>





      <div className="roll-to-shift flex items-start border-b border-dotted border-gray-800">
        
        <div className="class_name">
          <div  className="label" > {bySubjectVars.isBangla ? "শ্রেণি " : "Class "} </div>:  {" "}
          {bySubjectVars.isBangla
            ? student.class_name
            : student.class_name_in_english}
        </div>
        <div className="group_name">
          <div  className="label" > {bySubjectVars.isBangla ? "বিভাগ " : "Group "} </div>:  {" "}
          {bySubjectVars.isBangla
            ? student.group_name_in_bangla
            : student.group_name}
        </div>
        <div className="section">
          <div  className="label" > {bySubjectVars.isBangla ? "শাখা " : "Section "} </div>:  {" "}
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
    student_fathers_name: PropTypes.string,
    student_mothers_name: PropTypes.string,
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
