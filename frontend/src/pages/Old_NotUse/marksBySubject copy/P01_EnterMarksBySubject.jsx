
import './EnterMarksBySubject.scss'

import DataSelectorFormFields from './DataSelectorForm'
import StudentListForOneSubject from './StudentListForOneSubject'


const EnterMarksBySubject = () => { 
  return (
    <div>
      <div className="enter-marks-by-subject">
        
        <DataSelectorFormFields/>
        <StudentListForOneSubject/>

      </div>
    </div>
  );
};

EnterMarksBySubject.propTypes = {
  
};

export default EnterMarksBySubject;