import PropTypes from "prop-types";


const ClasswiseOrSectionwise = ({ Option, updateOption }) => {
  return (
    <div className="container-fluid">
        <div className="result-type-selector">
          <div className="result-creator-heading">ফলাফল দেখার ফর্ম</div>

          <div className="result-type">
            
            <button
              onClick={() => updateOption("class")}
              className={Option.class ? "active" : ""}
            >
              ক্লাস ভিত্তিক{" "}
            </button>
            <button
              onClick={() => updateOption("section")}
              className={Option.section ? "active" : ""}
            >
              শাখা ভিত্তিক
            </button>
          </div>
        </div>
      </div>
  );
}


ClasswiseOrSectionwise.propTypes = {
  Option: PropTypes.shape({
    class: PropTypes.bool.isRequired,
    section: PropTypes.bool.isRequired,
  }).isRequired,
  updateOption: PropTypes.func.isRequired,
};  

export default ClasswiseOrSectionwise;