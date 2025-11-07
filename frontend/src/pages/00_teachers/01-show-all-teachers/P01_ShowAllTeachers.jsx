
import './ShowAllTeachers.scss'

import DataSelectorFormFields from './DataSelectorForm' 


const ShowAllTeachers = () => { 
  return (
    <div>
      <div className="main-wrap-container">
      {/* <div className="enter-marks-by-subject"> */}
        
        <DataSelectorFormFields/> 
        
      </div>
    </div>
  );
};

ShowAllTeachers.propTypes = {
  
};

export default ShowAllTeachers;