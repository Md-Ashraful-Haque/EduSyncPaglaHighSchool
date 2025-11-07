
import './generate_result.scss'

import DataSelectorFormFields from './DataSelectorForm'
// import StudentListForOneSubject from './StudentListForOneSubject'


const EnterMarksBySubject = () => { 
  return (
    <div>
      <div className="generate-result">
        
        <DataSelectorFormFields/>  
        
      </div>
    </div>
  );
};

EnterMarksBySubject.propTypes = {
  
};

export default EnterMarksBySubject;