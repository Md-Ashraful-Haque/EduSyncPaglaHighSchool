
import './ShowAllStudents.scss'

import DataSelectorFormFields from './DataSelectorForm' 


const ShowAllStudents = () => { 
  return (
    <div>
      <div className="main-wrap-container">
      {/* <div className="enter-marks-by-subject"> */}
        
        <DataSelectorFormFields/> 
        
      </div>
    </div>
  );
};

ShowAllStudents.propTypes = {
  
};

export default ShowAllStudents;