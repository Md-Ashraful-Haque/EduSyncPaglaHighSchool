import PropTypes from "prop-types";

import { useMarksInputBySubjectContext } from "ContextAPI/MarksInputBySubjectContext";

const MarksheetTableHeader = ({classOrGroup}) => {
  const { bySubjectVars } = useMarksInputBySubjectContext();
  return (
    <thead>
      <tr className="bg-gray-200 text-center !text-xs">
        <th className="py-1 px-2 border !border-indigo-500">
          {bySubjectVars.isBangla ?  classOrGroup =="Merit (Groupwise)"? "মেধাক্রম (নিজ বিভাগে )":"মেধাক্রম (নিজ শ্রেণিতে )" : classOrGroup }
        </th>
        <th className="py-1 px-2 border !border-indigo-500">
          {bySubjectVars.isBangla ? "শিক্ষার্থীর নাম" : "Student Name"}
        </th>
        <th className="py-1 px-2 border !border-indigo-500 ">
          {bySubjectVars.isBangla ? "রোল" : "Roll"}
        </th>
        <th className="py-1 px-2 border !border-indigo-500">
          {bySubjectVars.isBangla
            ? "শিফট"
            : "Shift"}
        </th>
        <th className="py-1 px-2 border !border-indigo-500 ">
          {bySubjectVars.isBangla
            ? "শাখা"
            : "Section"}
        </th>
        <th className="py-1 px-2 border !border-indigo-500 ">
          {bySubjectVars.isBangla
            ? "মেধাক্রম (নিজ শাখায়)"
            : "Merit (Sectionwise)"}
        </th>
        <th className="py-1 px-2 border !border-indigo-500 ">
          {bySubjectVars.isBangla
            ? "জিপিএ"
            : "GPA"}
        </th>
        <th className="py-1 px-2 border !border-indigo-500 whitespace-nowrap">
          {bySubjectVars.isBangla
            ? "লেটার গ্রেড"
            : "Letter Grade"}
        </th> 
        <th className="py-1 px-2 border !border-indigo-500 min-w-[40px] ">
          {bySubjectVars.isBangla
            ? "মোট প্রাপ্ত নম্বর"
            : "Total Marks"}
        </th>
      </tr>
    </thead>
  );
};

MarksheetTableHeader.propTypes = {
  bySubjectVars: PropTypes.isRequired,
};

export default MarksheetTableHeader;
