// import PropTypes from "prop-types";
// import SubjectTable from "./04_subject_table";
// import GraddingTable from "./03_gradding_table";
// import MarksheetFooter from "./05_marksheet_footer";
// import MarksheetSignature from "./06_marksheet_signature";
// import StudentInfoForMarksheet from "./92_student_info_for_marksheet";
// import { useMarksInputBySubjectContext } from "ContextAPI/MarksInputBySubjectContext";


// import MarksheetTableHeader from "./92_marksheet_table_header";
// import MarksheetTableBody from "./93_marksheet_table_body";



// const Marksheet = ({
//   student,
//   highest_marks, 
//   showBangla,
//   examAndInstituteInfo,
//   index
// }) => {
//   const { bySubjectVars } = useMarksInputBySubjectContext();
  
//   return (
//     <>
//       <div className="single-marksheet "> 

//         {/* <StudentInfoForMarksheet student={student} /> */}

//         {/* <SubjectTable
//           singleMarksheetForStudent={student}
//           highest_marks={highest_marks}
//           student={student}
//           index={index}
//         /> */}

//         <table className="min-w-full bg-gray-100 border  !border-indigo-50 noto-bangla-regular "> 
//           <MarksheetTableHeader />
//           <MarksheetTableBody  
//             highest_marks={highest_marks}
//             student={student}
//             index={index}
//           /> 
//         </table>


//         {/* <MarksheetFooter showBangla={showBangla} student={student} /> */}

//         {/* <MarksheetSignature
//           headTeacherSignature={examAndInstituteInfo.signature}
//         /> */}
//       </div>
//     </>
//   );
// };

// Marksheet.propTypes = {
//   student: PropTypes.object.isRequired,
//   highest_marks: PropTypes.object.isRequired, 
//   showBangla: PropTypes.func.isRequired,
//   examAndInstituteInfo: PropTypes.shape({
//     institute_name: PropTypes.string.isRequired,
//     institute_name_eng: PropTypes.string.isRequired,
//     institute_logo: PropTypes.string.isRequired,
//     exam_name: PropTypes.string,
//     exam_name_in_english: PropTypes.string,
//     year: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
//     signature: PropTypes.string.isRequired,
//   }).isRequired,
// };

// export default Marksheet;
