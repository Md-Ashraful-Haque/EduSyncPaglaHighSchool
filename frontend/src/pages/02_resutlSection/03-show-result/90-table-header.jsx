
import PropTypes from 'prop-types';


const TableHeader = ({ bySubjectVars }) => { 

  return (
   <thead>
      <tr className="bg-gradient-to-r from-blue-500 to-purple-600 text-white text-center hind-siliguri-regular">
        <th className="py-2 px-3 ">{bySubjectVars.isBangla? "নাম": "Name" }</th>
        <th className="py-2 px-3 ">{bySubjectVars.isBangla? "রোল": "Roll" }</th>
        <th className="py-2 px-3 ">{bySubjectVars.isBangla? "ক্লাস মেধা": "Merit (Classwise)" }</th>
        <th className="py-2 px-3 ">{bySubjectVars.isBangla? "শাখা মেধা": "Merit (Sectionwise)" }</th>
        <th className="py-2 px-3 ">{bySubjectVars.isBangla? "বিভাগ": "Group" }</th>
        <th className="py-2 px-3 ">{bySubjectVars.isBangla? "শাখা": "Section" }</th>
        <th className="py-2 px-3 ">{bySubjectVars.isBangla? "জিপিএ": "GPA" }</th>
        <th className="py-2 px-3 ">{bySubjectVars.isBangla? "গ্রেড": "Grade" }</th>
        <th className="py-2 px-3 ">{bySubjectVars.isBangla? "মোট নম্বর": "Total" }</th>
        <th className="py-2 px-3 ">{bySubjectVars.isBangla? "ফেল বিষয়": "Fail Subjects" }</th>
        <th className="py-2 px-3 ">{bySubjectVars.isBangla? "বিস্তারিত": "Details" }</th> 
      </tr>
    </thead>
  );
}
TableHeader.propTypes = {
  bySubjectVars: PropTypes.isRequired, 
};

export default TableHeader;