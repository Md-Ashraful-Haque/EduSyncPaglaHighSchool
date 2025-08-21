// import PropTypes from 'prop-types';
// import TestFile from '../TestFile'
import './EnterMarksBySubject.scss'

import SubjectSelectorForm from './subjectSelectorForm/SubjectSelectorForm'


import {useMarksInputBySubjectContext} from 'ContextAPI/MarksInputBySubjectContext'
import YearSelector from './yearSelector/YearSelector'


const EnterMarksBySubject = () => {
  const { bySubjectVars, updateBySubjectVars } = useMarksInputBySubjectContext(); 

  const handleChange = (event,varName) => {
    updateBySubjectVars(varName,event.target.value);
  };




  return (
    <div>
      <div className="enter-marks-by-subject">
        <div className="enter-marks-by-subject-form">

          <div className="container-fluid">

            <div className="row">
              <div className="col-md-4">
                <div className="current-session-header">

                  <div className="session-section">
                    <span>Current Session:</span>
                    <YearSelector />
                  </div>
                  
                </div>
              </div>
              <div className="col-md-4">
                <div className="current-session-header">
                  <div className="heading-container">
                    <div className="heading">
                      মার্ক ইনপুট করতে নীচের তথ্য পূরণ করুন।
                    </div>
                  </div>
                </div>
              </div>
              <div className="col-md-4">
                <div className="current-session-header">
                  <div className="shift-section">

                    <div className="shift">
                      <span>Shift:</span>

                      <select name="session" id="shitf-name" value={bySubjectVars.shift} onChange={(event) => {handleChange(event,"shift")}}>
                        <option value="morning">Morning</option>
                        <option value="day">Day</option>
                        <option value="evening">Evening</option>
                      </select>
                    </div>

                    <div className="current-sesstion-button">
                      <div className="button">
                        <button> - </button>
                      </div>
                      <div className="button">
                        <button> x </button>
                      </div>
                    </div>

                  </div>
                </div>
              </div>
            </div>

            <div className="row">
              <div className="subject-selector-form-container">
                <div className="subject-selector-form"> 
                    <SubjectSelectorForm />   
                </div>
              </div>
            </div>

          </div>
          
        </div>

        <div className="enter-marks-by-subject-form-query-fields">

          <div className="mark-entry-heading">
            বাংলা বিষয়ের জন্য মার্ক ইনপুট করুন। 
          </div>

          <div className="section-wise-student-marks-entry">
            <div className="marks-entry-for-one-subject">

              <div className="container-fluid">

                <div className="row">
                  <div className="col-xl-1">
                    <div className="heading serial-no">
                    ক্রমিক নং
                    </div>
                  </div>
                  <div className="col-xl-7">
                    <div className="heading name-heading">
                      নাম
                    </div>
                  </div>
                  <div className="col-xl-1">
                    <div className="heading roll-heading">
                    রোল
                    </div>
                  </div>
                  <div className="col-xl-3">
                    <div className="heading marks-heading">
                      Marks heading come from react
                    </div>
                  </div>
                </div>

                <div className="row">
                  <div className="col-xl-1">
                    <div className="heading serial-no data-even">
                      01
                    </div>
                  </div>
                  <div className="col-xl-7">
                    <div className="heading name-heading data-even">
                      নাম
                    </div>
                  </div>
                  <div className="col-xl-1">
                    <div className="heading roll-heading data-even ">
                    রোল
                    </div>
                  </div>
                  <div className="col-xl-3">
                    <div className="heading marks-heading data-even">
                      <input type="text" />
                    </div>
                  </div>
                </div>

                <div className="row">
                  <div className="col-xl-1">
                    <div className="heading serial-no data-odd">
                      02
                    </div>
                  </div>
                  <div className="col-xl-7">
                    <div className="heading name-heading data-odd">
                      নাম
                    </div>
                  </div>
                  <div className="col-xl-1">
                    <div className="heading roll-heading data-odd ">
                    রোল
                    </div>
                  </div>
                  <div className="col-xl-3">
                    <div className="heading marks-heading data-odd">
                      <input type="text" />
                    </div>
                  </div>
                </div> 

                
              </div>
            </div>
          </div> 
        </div>


      </div>
    </div>
  );
};

EnterMarksBySubject.propTypes = {
  
};

export default EnterMarksBySubject;