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
            {/* <DatePicker
              // ref={dateRef}
              selected={bySubjectVars.date ? new Date(bySubjectVars.date) : null}
              onChange={(date) => {
                const formatted = date.toISOString().split("T")[0]; // YYYY-MM-DD 
                updateBySubjectVars("date", formatted)
              }}
              dateFormat="dd/MM/yyyy"
              placeholderText="dd/mm/yyyy"
              className="calendar-input"
            /> */}

            <DatePicker
              selected={bySubjectVars.date ? new Date(bySubjectVars.date) : null}
              onChange={(date) => {
                const formatted = date.toISOString().split("T")[0]; // YYYY-MM-DD
                updateBySubjectVars("date", formatted);
              }}
              dateFormat="dd/MM/yyyy"
              placeholderText="dd/mm/yyyy"
              className="calendar-input"

              // ✅ THIS IS THE KEY PART
              dayClassName={(date) => {
                const day = date.getDay(); // 0=Sunday, 5=Friday, 6=Saturday

                if (day === 5) return "datepicker-friday";   // ✅ Friday
                if (day === 6) return "datepicker-saturday"; // ✅ Saturday

                return undefined;
              }}
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
