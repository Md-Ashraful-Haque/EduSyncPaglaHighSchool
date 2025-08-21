import PropTypes from 'prop-types';

const YearAndShiftSelector = ({ bySubjectVars, handleChange, YearSelector }) => {
  return (
    <>
      <div id="field-selector-form">
        <div id="option-component">
          <div className="option-label"> শিফট </div>
          <div className="option-value">
            <div className="shift-section">
              <select
                name="session"
                id="shitf-name"
                value={bySubjectVars.shift}
                onChange={(event) => {
                  handleChange(event, "shift");
                }}
              >
                <option value="morning">Morning</option>
                <option value="day">Day</option>
                {/* <option value="afternoon">Afternoon</option> */}
                {/* <option value="evening">Evening</option> */}
              </select>
            </div>
          </div>
        </div>
      </div>

      <div id="field-selector-form">
        <div id="option-component">
          <div className="option-label"> বছর </div>
          <div className="option-value">
            <YearSelector />
          </div>
        </div>
      </div>
    </>
  );
};


YearAndShiftSelector.propTypes = {
  bySubjectVars: PropTypes.shape({
    shift: PropTypes.string.isRequired,
  }).isRequired,
  handleChange: PropTypes.func.isRequired,
  YearSelector: PropTypes.elementType.isRequired,
};

export default YearAndShiftSelector;