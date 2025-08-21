import PropTypes from "prop-types";


const FormHeading = ({  heading }) => {
  return (
    <div className="container-fluid">
        <div className="result-type-selector">
          <div className="result-creator-heading">{heading}</div>

          <div className="result-type">
            
            <button 
              className="active"
            >
              ক্লাস ভিত্তিক 
            </button> 
          </div>
        </div>
      </div>
  );
}


FormHeading.propTypes = { 
  heading: PropTypes.func.isRequired,
};  

export default FormHeading;