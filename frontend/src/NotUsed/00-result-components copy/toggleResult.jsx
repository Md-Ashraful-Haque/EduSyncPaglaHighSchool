
import PropTypes from "prop-types";

import { useMarksInputBySubjectContext } from "../../../ContextAPI/MarksInputBySubjectContext";

const ToggleLanguage = ( ) => {
  const context = useMarksInputBySubjectContext();
  if (!context) {
    throw new Error("ToggleLanguage must be used within a MarksInputBySubjectContextProvider");
  }

  const {bySubjectVars, updateBySubjectVars} = useMarksInputBySubjectContext();
  
  // Handler to toggle the isBangla state
  const toggleLanguage = () => {
    updateBySubjectVars("isBangla", !bySubjectVars.isBangla);
    // console.log("Language toggled to:", !bySubjectVars.isBangla ? "Bangla" : "English");
  };

  return (
    <div>
      <button
        onClick={toggleLanguage}
        className="button-1"
      >
        {bySubjectVars.isBangla ? "ইংরেজি" : "বাংলা"}
      </button>
    </div>
  );
};

ToggleLanguage.propTypes = {
  bySubjectVars: PropTypes.shape({
    isBangla: PropTypes.bool.isRequired,
  }).isRequired,
  updateBySubjectVars: PropTypes.func.isRequired,
};

export default ToggleLanguage;