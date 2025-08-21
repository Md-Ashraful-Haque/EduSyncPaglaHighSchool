
import './EnterMarksBySubject.scss'

import {useRef, useEffect, useState } from 'react'; 
// import axios from "axios";
import { areAllFieldsFilled, saveFormData, areAllFieldsFilledExceptMarkType } from 'Utils/utilsFunctions/UtilFuntions'

import { useMarksInputBySubjectContext } from "ContextAPI/MarksInputBySubjectContext";
import {fetchData} from 'FormFields' 
import { useAppContext } from "ContextAPI/AppContext";

import { toast } from 'react-toastify';
import MarkTypeCheckboxes from './MarkTypeCheckboxes'




const StudentListForOneSubject = () => {
  const { createNewAccessToken } = useAppContext();
  const { bySubjectVars } = useMarksInputBySubjectContext();
  const [ showStudent, setShowStudent ] = useState(false);
  const [ showAllMarkType, setShowAllMarkType ] = useState(false);
  const [markTypes, setMarkTypes] = useState([]);

  const [students, setStudents] = useState([]);
  const [marks, setMarks] = useState({});
  const [maxMarks, setMaxMarks] = useState(100);
  const inputRefs = useRef({}); // store multiple refs by student ID
  const [invalidInputs, setInvalidInputs] = useState({});
  const [selectedMarkTypes, setSelectedMarkTypes] = useState([]);
  
  
  useEffect(() => {
    const isCompleted = areAllFieldsFilled(bySubjectVars);
    setShowStudent(isCompleted);
    const isCompletedWithoutMarkType = areAllFieldsFilledExceptMarkType(bySubjectVars);
    setShowAllMarkType(isCompletedWithoutMarkType);

    // console.log("bySubjectVars: ", bySubjectVars);

  
    // Fetch students only if all required fields are filled
    if (isCompleted) {
      setInvalidInputs( {} );
      
      fetchData(createNewAccessToken, "students-roll-name", {
        year: bySubjectVars.year,
        shift: bySubjectVars.shift,
        class_name: bySubjectVars.class_name,
        group_name: bySubjectVars.group_name_bangla,
        section_name: bySubjectVars.section_name,
      }).then(setStudents);

      //Load previous marks from database

      fetchData(createNewAccessToken, "load-marks-by-roll", {
        year: bySubjectVars.year,
        shift: bySubjectVars.shift,
        class_name: bySubjectVars.class_name,
        group_name: bySubjectVars.group_name_bangla,
        section_name: bySubjectVars.section_name,
        exam_name: bySubjectVars.exam_name,
        subject_name: bySubjectVars.subject_name_display,
        mark_type_name: bySubjectVars.mark_type_display,
        // subject_name: bySubjectVars.subject_name_display,
        // mark_type_name: bySubjectVars.mark_type_display,
      }).then((data) => {
      setMarks(data[0]);
      setMaxMarks(data[1]);
      // console.log("Max marks: ", data);
      // console.log("Max data[1]: ", data[1]);
      });

    } else {
      setStudents([]); // Clear student list if fields are incomplete
      setInvalidInputs( {} );
      // console.log("Incomplete fields, not fetching students.");
    }


    if(isCompletedWithoutMarkType){
      fetchData(createNewAccessToken, "mark-types-by-subject", {
        subject_for_ims_id: bySubjectVars.subject_name_display,
      }).then(setMarkTypes);
    }
    

  }, [bySubjectVars]);
  
  

  const handleMarksChange = (studentId, value) => {
    setMarks((prevMarks) => ({
      ...prevMarks,
      [studentId]: value,
    }));
  };


  const handleSubmit = async (e) => {
    
    e.preventDefault();
    // console.log(marks);

    
    
    const markType = bySubjectVars.mark_type_display
    const requestData = {
      ...bySubjectVars,
      MarksForType: Object.entries(marks).map(([studentID, value]) => ({ 
        mark_type: markType,
        marks: value,
      })),
      Student: Object.entries(marks).map(([studentID, value]) => ({
        id: studentID, 
      })),
    };
    // console.log("requestData: ", requestData);
  
    try {
      const response = await saveFormData(createNewAccessToken, "submit-marks-by-subject", requestData);
      // Show success toast message
      //Documentation:  https://fkhadra.github.io/react-toastify/introduction/
      toast.success("Marks submitted successfully!", {
          position: "top-center",
          autoClose: 2000,
          hideProgressBar: false,
          closeOnClick: false,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
        }
      );
      // console.log("Marks submitted successfully:", response);
    } catch (error) {
      // console.error("Error submitting marks:", error.response?.data || error.message);
      // Show error toast message
      toast.error("Error submitting marks: " + ( error.message));
    }
  };
  
  
  const validateInput = (value,max) => {
    if (value === "") {
      return false;
    }

    // const num = Number(value);
    const num = parseInt(value, 10);
    const valid = isNaN(num) || num < -1 || num > max;
    return valid;
  };

  const handleBlur = (studentId, value, max) => {
    // const num = parseInt(value, 10);
    // const isInvalid = isNaN(num) || num < -1 || num > max || num === '';
    const isInvalid = validateInput(value, max);
  
    setInvalidInputs((prev) => ({
      ...prev,
      [studentId]: isInvalid,
    }));
  
    if (isInvalid) {
      toast.error("অনুগ্রহ করে -1 থেকে " + max + " এর মধ্যে একটি সংখ্যা প্রদান করুন।", {
          position: "top-right",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: false,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
        });
      setTimeout(() => {
        inputRefs.current[studentId]?.focus();
      }, 100);
    }
  };
  



  
  
  return (
    <> 
        <MarkTypeCheckboxes markTypes={markTypes} selectedMarkTypes={selectedMarkTypes} setSelectedMarkTypes={setSelectedMarkTypes}/>


        {
          showStudent ? (
            <div className="enter-marks-by-subject-form-query-fields">

              <div className="mark-entry-heading">
                {/* {bySubjectVars.subject_name_display} বাংলা বিষয়ের জন্য  */}
                মার্ক ইনপুট করুন। 
              </div>

              <div className="section-wise-student-marks-entry">
                <div className="marks-entry-for-one-subject">

                  <div className="container-fluid">

                    <div className="row">
                      <div className="col-2 d-none d-md-block">
                        <div className="heading serial-no">
                        ক্রমিক নং
                        </div>
                      </div>
                      <div className="col-7 col-md-6">
                        <div className="heading name-heading">
                          নাম
                        </div>
                      </div>
                      <div className="col-2 col-md-1">
                        <div className="heading roll-heading">
                        রোল
                        </div>
                      </div>
                      <div className="col-3">
                        <div className="heading marks-heading">
                          {bySubjectVars.mark_type_display}
                        </div>
                      </div>
                    </div> 
                    
                    <form onSubmit={handleSubmit}>
                      {students.map((student, index) => {
                        const isEven = index % 2 === 0;
                        const rowClass = isEven ? "data-even" : "data-odd";

                        return (
                          <div key={student.id} className="row">
                            <div className="col-2 d-none d-md-block">
                              <div className={`heading serial-no ${rowClass}`}>
                                {String(index + 1).padStart(2, "0")}
                              </div>
                            </div>
                            <div className="col-7 col-md-6">
                              <div className={`heading name-heading ${rowClass}`}>{student.name}</div>
                            </div>
                            <div className="col-2 col-md-1">
                              <div className={`heading roll-heading ${rowClass}`}>
                                {student.roll_number}
                              </div>
                            </div>
                            <div className="col-3">
                              <div className={`heading marks-heading ${rowClass}`}>
                                <input
                                  // className={`${marks[student.id] === -1? "!text-sm" :""}`}
                                  className={`
                                    ${marks[student.id] === -1 ? "!text-sm" : ""}
                                    ${invalidInputs[student.id] ? "!border-red-500 !bg-red-50" : null }
                                    border p-2
                                  `}
                                  
                                  type="number"
                                  // value={marks[student.id] === -1? "" : marks[student.id]}
                                  value={marks[student.id] === -1 || marks[student.id] === undefined ? "" : marks[student.id]}
                                  placeholder={` -1 থেকে ${maxMarks}`}
                                  min={-1}
                                  max={maxMarks}
                                  onWheel={(e) => e.target.blur()}
                                  onChange={(e) => handleMarksChange(student.id, e.target.value)}
                                  onBlur={(e) => handleBlur(student.id, e.target.value, maxMarks)}
                                  ref={(el) => {
                                    if (el) inputRefs.current[student.id] = el;
                                  }}
                                />
                              </div>
                            </div>
                          </div>
                        );
                      })}
                      <div className="save-button">
                        <button type="submit"> সংরক্ষণ করুন </button>
                      </div>
                    </form>


                    
                  </div>
                </div>
              </div> 
            </div>
          ) : (
            <div className="enter-marks-by-subject-form-query-fields"> 
              <div className="select-option-instruction">
                <h4>নম্বর ইনপুট করতে উপরের অপশন গুলো ঠিক করে পূরণ করুন। </h4>
              </div>
            </div>
          )
        }

        {/* <form onSubmit={handleSubmit}>
          <h2>Enter Marks</h2>
          {students.map((student) => (
            <div key={student.id} className="student-row">
              <span>{student.roll_number}</span>
              <span>{student.name}</span>
              <input
                type="number"
                placeholder="Enter marks"
                value={marks[student.id] || ""}
                onChange={(e) => handleMarksChange(student.id, e.target.value)}
              />
            </div>
          ))}
          <button type="submit">Submit Marks</button>
        </form>  */}
    </>
  );
};

StudentListForOneSubject.propTypes = {
  
};

export default StudentListForOneSubject;