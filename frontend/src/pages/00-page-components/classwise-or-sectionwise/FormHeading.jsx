import PropTypes from "prop-types";


const FormHeading = ({  heading, groupwise="ক্লাস ভিত্তিক" }) => {
  return (
    <div className="container-fluid">
        <div className="result-type-selector">
          <div className="result-creator-heading">{heading}</div>

          <div className="result-type">
            
            <button 
              className="active"
            >
              {groupwise}
            </button> 
          </div>
        </div>
      </div>
  );
}


FormHeading.propTypes = { 
  heading: PropTypes.func.isRequired,
  groupwise: PropTypes.func.isRequired,
};  

export default FormHeading;