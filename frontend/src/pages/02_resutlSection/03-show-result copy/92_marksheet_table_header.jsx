import PropTypes from "prop-types";

import { useMarksInputBySubjectContext } from "ContextAPI/MarksInputBySubjectContext";

const MarksheetTableHeader = () => {
  const { bySubjectVars } = useMarksInputBySubjectContext();
  return (
    <thead>
      {/* <tr className="bg-gray-800 text-white text-center !text-xs"> */}
      <tr className="bg-gray-400 text-center !text-xs">
        <th className="py-1 px-2 border !border-indigo-500">
          {bySubjectVars.isBangla ? "বিষয়" : "Subject"}
        </th>
        <th className="py-1 px-2 border !border-indigo-500">
          {bySubjectVars.isBangla ? "পূর্ণ নম্বর" : "Full Marks"}
        </th>
        <th className="py-1 px-2 border !border-indigo-500 ">
          {bySubjectVars.isBangla ? "পাস নম্বর" : "Pass Marks"}
        </th>

        <th className="py-1 px-2 border !border-indigo-500 ">
          {bySubjectVars.isBangla
            ? "লিখিত / ধা.মূল্যায়ন"
            : "Written / C. Assessment"}
        </th>
        
        <th className="py-1 px-2 border !border-indigo-500">
          {bySubjectVars.isBangla
            ? "বহুনির্বাচনী"
            : "MCQ"}
        </th>

          
        <th className="py-1 px-2 border !border-indigo-500">
          {bySubjectVars.isBangla
            ? "ব্যবহারিক"
            : "Practical"}
        </th>



        <th className="py-1 px-2 border !border-indigo-500 ">
          {bySubjectVars.isBangla
            ? "মোট নম্বর"
            : "Total Marks"}
        </th>
        <th className="py-1 px-2 border !border-indigo-500">
          {bySubjectVars.isBangla
            ? "লেটার গ্রেড"
            : "Letter Grade"}
        </th>
        <th className="py-1 px-2 border !border-indigo-500 ">
          {bySubjectVars.isBangla
            ? "গ্রেড পয়েন্ট"
            : "Grade Point"}
        </th>
        <th className="py-1 px-2 border !border-indigo-500 min-w-[40px] ">
          {bySubjectVars.isBangla
            ? "ক্লাসে প্রাপ্ত সর্বোচ্চ নম্বর"
            : "Highest Marks"}
        </th>
      </tr>
    </thead>
  );
};

MarksheetTableHeader.propTypes = {
  bySubjectVars: PropTypes.isRequired,
};

export default MarksheetTableHeader;
