import PropTypes from 'prop-types';

const MarksheetFooter = ({showBangla, student}) => {
  return (
    <div id="notTen" className="footer">
      <div className="result-and-grading-table">
        <div className="result-table">
          <div className="result-box rank">
            <div className="text">সর্বমোট প্রাপ্ত নম্বর: </div>
            <div className="value">
              {showBangla(student.total_obtained_marks)}
            </div>
          </div>

          <div className="result-box letter-grade">
            <div className="text">লেটার গ্রেড: </div>
            <div className="value">{student.letter_grade}</div>
          </div>

          <div className="result-box gpa">
            <div className="text">জিপিএ: </div>
            <div className="value">{showBangla(student.gpa.toFixed(2))}</div>
          </div>

          <div className="result-box rank">
            <div className="text">মেধাক্রম(নিজ শ্রেণিতে): </div>
            <div className="value">{showBangla(student.classwise_merit)}</div>
          </div>

          <div className="result-box rank">
            <div className="text">মেধাক্রম(নিজ শাখায়): </div>
            <div className="value">{showBangla(student.sectionwise_merit)}</div>
          </div>
        </div>
      </div>
    </div>
  );
};

MarksheetFooter.propTypes = {
  showBangla: PropTypes.func.isRequired,
  student: PropTypes.isRequired,
};

export default MarksheetFooter;
