import PropTypes from "prop-types";

import showBangla from "../../../utils/utilsFunctions/engNumberToBang";

import { useMarksInputBySubjectContext } from "ContextAPI/MarksInputBySubjectContext";
import schoolLogo from "../../../assets/images/eduSyncLogo.svg"; 
const MarksheetTableBodyVocational = ({ singleMarksheetForStudent, highest_marks,instituteLogo }) => {
  const { bySubjectVars } = useMarksInputBySubjectContext();

  const allMarkTypes = Array.from(
    new Set(
      singleMarksheetForStudent.subjects
        .flatMap((subj) => subj.marks.map((m) => m.mark_type))
    )
  );

  // console.log(allMarkTypes);
  // console.log("highest_marks : ", highest_marks);

  

  return (
    <tbody style={{position: 'relative' }}> 
      {singleMarksheetForStudent.subjects.map(
        (subject, index) =>
          subject.total_marks > -1 && (
            <tr
              key={index}
              className={`text-center border  noto-bangla-regular !border-indigo-500 ${
                index % 2 == 0 ? "!bg-blue-100/80 " : ""
              } `} 
            >
              <td className="py-1 px-2 !min-w-[180px] max-w-[250px] text-left border !border-indigo-500">
                {bySubjectVars.isBangla
                  ? subject.subject_name_bangla
                  : subject.subject_name}
              </td>

              <td className="py-1 px-2 border !border-indigo-500">
                {bySubjectVars.isBangla
                  ? showBangla(subject.full_marks)
                  : subject.full_marks}
              </td>

              
              {/* <td className="py-1 px-2 border !border-indigo-500">
                {bySubjectVars.isBangla
                  ? showBangla(subject.pass_marks)
                  : subject.pass_marks}
              </td>
               */}

              {['CA', 'Theory','Practical'].map((type) => {
                const fallbackType = type === 'WR' ? 'CA' : null;
                const match = subject.marks.find((m) => m.mark_type === type) || (fallbackType && subject.marks.find((m) => m.mark_type === fallbackType));
                const mark = match ? (bySubjectVars.isBangla ? showBangla(match.marks) : match.marks) : '-';
                return (
                  <td key={type} className="py-1 px-2 border !border-indigo-500">
                    {mark}
                  </td>
                );
              })}




              <td className="py-1 px-2 border !border-indigo-500">
                {bySubjectVars.isBangla
                  ? showBangla(subject.total_marks)
                  : subject.total_marks}
              </td>
              <td>
                <span
                  className={`px-2 inline-flex items-center  text-xs font-semibold rounded-full min-w-[32px] ${
                    subject.grade_and_point[0] === "Fail"
                      ? "bg-red-100 text-red-800"
                      : "bg-green-100 text-green-800"
                  }`}
                >
                  {subject.grade_and_point[0]}
                </span>

                {/* {subject.grade_and_point[0]} */}
              </td>
              <td className="py-1 px-2 border !border-indigo-500">
                {bySubjectVars.isBangla
                  ? showBangla(subject.grade_and_point[1])
                  : subject.grade_and_point[1]}
              </td>
              <td
                className="py-1 px-2  border !border-indigo-500 fontSize-10 !min-w-[90px]"
                id="highest-marks"
              >
                {/* {highest_marks} */}
                {/* {bySubjectVars.isBangla
                  ? showBangla(highest_marks[index].highest_marks)
                  : highest_marks[index].highest_marks}{" "}
                (
                {bySubjectVars.isBangla
                  ? highest_marks[index].section_name_display
                  : highest_marks[index].section_name}{" "}
                ,{" "}
                {bySubjectVars.isBangla
                  ? showBangla(highest_marks[index].roll)
                  : highest_marks[index].roll}
                ) */}
                {highest_marks?.[index] ? (
                  <>
                    {bySubjectVars.isBangla
                      ? showBangla(highest_marks[index].highest_marks)
                      : highest_marks[index].highest_marks}{" "}
                    (
                    {bySubjectVars.isBangla
                      ? highest_marks[index].section_name_display
                      : highest_marks[index].section_name},{" "}
                    {bySubjectVars.isBangla
                      ? showBangla(highest_marks[index].roll)
                      : highest_marks[index].roll}
                    )
                  </>
                ) : (
                  <span>—</span> // Or any placeholder for missing data
                )}
              </td>
              {/* <td className="py-1 px-2 border !border-indigo-500">-</td> */}
            </tr>
          )
      )}
    </tbody>
  );
};

MarksheetTableBodyVocational.propTypes = {
  singleMarksheetForStudent: PropTypes.shape({
    subjects: PropTypes.arrayOf(
      PropTypes.shape({
        subject_name_bangla: PropTypes.string,
        full_marks: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
        pass_marks: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
        marks: PropTypes.arrayOf(
          PropTypes.shape({
            marks: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
            mark_type: PropTypes.string,
          })
        ),
        total_marks: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
        grade_and_point: PropTypes.array,
      })
    ),
  }).isRequired,
  highest_marks: PropTypes.array.isRequired,
};

export default MarksheetTableBodyVocational;
