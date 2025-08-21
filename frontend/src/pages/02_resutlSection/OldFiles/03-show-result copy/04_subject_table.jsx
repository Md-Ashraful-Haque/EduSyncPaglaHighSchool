
import PropTypes from "prop-types";
import showBangla from "../../../../utils/utilsFunctions/engNumberToBang";

// StudentResult component
const SubjectTable = ({ singleMarksheetForStudent, highest_marks }) => {
  return (
    <>
        

        <table className="min-w-full bg-gray-100 border  !border-indigo-50 noto-bangla-regular ">
          {/* <table className="min-w-full bg-gray-50 border  !border-indigo-500 rounded-lg overflow-hidden"> */}
          <thead>
            <tr className="bg-gray-200 text-center !text-xs">
              <th className="py-1 px-2 border !border-indigo-500">বিষয়</th>
              <th className="py-1 px-2 border !border-indigo-500">
                পূর্ণ নম্বর
              </th>
              <th className="py-1 px-2 border !border-indigo-500 ">
                পাশ নম্বর
              </th>
              <th className="py-1 px-2 border !border-indigo-500">
                বহুনির্বাচনী / ব্যবহারিক
              </th>
              <th className="py-1 px-2 border !border-indigo-500 ">
                লিখিত / ধারা. মূল্যায়ন
              </th>
              <th className="py-1 px-2 border !border-indigo-500 ">
                মোট প্রাপ্ত নম্বর
              </th>
              <th className="py-1 px-2 border !border-indigo-500">
                প্রাপ্ত লেটার গ্রেড
              </th>
              <th className="py-1 px-2 border !border-indigo-500 ">
                প্রাপ্ত গ্রেড পয়েন্ট
              </th>
              <th className="py-1 px-2 border !border-indigo-500 min-w-[40px] ">
                সর্বোচ্চ প্রাপ্ত নম্বর
              </th>
              {/* <th className="py-1 px-2 border !border-indigo-500  min-w-[100px]">মন্তব্য</th> */}
            </tr>
          </thead>
          <tbody>
            {singleMarksheetForStudent.subjects.map((subject, index) => (
              <tr key={index} className={`text-center border  noto-bangla-regular !border-indigo-500 ${
                        index % 2 == 0
                          ? "!bg-blue-100" : ""} `}>
                <td className="py-1 px-2 !min-w-[180px] max-w-[250px] text-left border !border-indigo-500">
                  {subject.subject_name_bangla}
                </td>
                <td className="py-1 px-2 border !border-indigo-500">
                  {showBangla(subject.full_marks)}
                </td>
                <td className="py-1 px-2 border !border-indigo-500">
                  {showBangla(subject.pass_marks)}
                </td>
                {subject.marks.length == 1 ? (
                  <td className="py-1 px-2 border !border-indigo-500">-</td>
                ) : (
                  ""
                )}
                {subject.marks.map((mark, i) => (
                  <td key={i} className="py-1 px-2 border !border-indigo-500">
                    {showBangla(mark.marks)}
                    {/* {mark.mark_type}: {mark.marks} */}
                  </td>
                ))}

                <td className="py-1 px-2 border !border-indigo-500">
                  {showBangla(subject.total_marks)}
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
                  {showBangla(subject.grade_and_point[1])}
                </td>
                <td className="py-1 px-2  border !border-indigo-500 fontSize-10 !min-w-[90px]" id="highest-marks" >
                  
                  {/* {highest_marks} */}
                  {showBangla(highest_marks[index].highest_marks)} ({highest_marks[index].section_name}, { showBangla(highest_marks[index].roll)})
                </td>
                {/* <td className="py-1 px-2 border !border-indigo-500">-</td> */}
              </tr>
            ))}
          </tbody>
        </table>
        
    </>
  );
};

SubjectTable.propTypes = {
  highest_marks: PropTypes.node.isRequired,
  singleMarksheetForStudent: PropTypes.node.isRequired,
};

export default SubjectTable;
