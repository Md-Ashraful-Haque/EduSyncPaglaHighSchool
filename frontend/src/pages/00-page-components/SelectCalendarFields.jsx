import "./select_fields.scss"; 
// import { useAppContext } from "ContextAPI/AppContext";
import { useMarksInputBySubjectContext } from "ContextAPI/MarksInputBySubjectContext"; 
// import PropTypes from "prop-types";
// import dayjs from 'dayjs';
import { Save, Upload } from "lucide-react";
import { BookOpen, Calendar, Clock, Trash2, Check } from "lucide-react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

const SelectCalendarFields = () => {
  const { bySubjectVars,updateBySubjectVars } = useMarksInputBySubjectContext(); 
  return (
    <div id="field-selector-form">
      <div id="option-component">
        <div className="option-label"> তারিখ </div>
        <div className="option-value">
          <div className="input-calendar">
            {/* <input
              type="date"
              value={bySubjectVars.date}
              onChange={(e) => updateBySubjectVars("date", e.target.value)} 
            /> */}
            <DatePicker
              // ref={dateRef}
              selected={bySubjectVars.date ? new Date(bySubjectVars.date) : null}
              onChange={(date) => {
                const formatted = date.toISOString().split("T")[0]; // YYYY-MM-DD 
                updateBySubjectVars("date", formatted)
              }}
              dateFormat="dd/MM/yyyy"
              placeholderText="dd/mm/yyyy"
              className="calendar-input"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

// SelectCalendarFields.propTypes = {
//   fields: PropTypes.arrayOf(PropTypes.oneOf(["shift","year","class", "group", "section", "exam", "subject", "type","exam-by-year"])),
// };

export default SelectCalendarFields;
