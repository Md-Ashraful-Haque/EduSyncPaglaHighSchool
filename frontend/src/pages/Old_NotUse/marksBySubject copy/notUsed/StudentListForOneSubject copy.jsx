
import './EnterMarksBySubject.scss'

import { useEffect, useState } from 'react'; 
// import axios from "axios";
import { areAllFieldsFilled, saveFormData } from 'Utils/utilsFunctions/UtilFuntions'

import { useMarksInputBySubjectContext } from "ContextAPI/MarksInputBySubjectContext";
import {fetchData} from 'FormFields' 
import { useAppContext } from "ContextAPI/AppContext";


const StudentListForOneSubject = () => {
  const { createNewAccessToken } = useAppContext();
  const { bySubjectVars } = useMarksInputBySubjectContext();
  const [ showStudent, setShowStudent ] = useState(false);

  const [students, setStudents] = useState([]);
  const [marks, setMarks] = useState({});
  
  useEffect(() => {
    const isCompleted = areAllFieldsFilled(bySubjectVars);
    setShowStudent(isCompleted);
  
    // Fetch students only if all required fields are filled
    if (isCompleted) {
      fetchData(createNewAccessToken, "students-roll-name", {
        year: bySubjectVars.year,
        shift: bySubjectVars.shift,
        class_name: bySubjectVars.class_name,
        group_name: bySubjectVars.group_name_display,
        section_name: bySubjectVars.section_name_display,
      }).then(setStudents);
    } else {
      setStudents([]); // Clear student list if fields are incomplete
    }
  }, [bySubjectVars]);
  
  

  const handleMarksChange = (studentId, value) => {
    setMarks((prevMarks) => ({
      ...prevMarks,
      [studentId]: value,
    }));
  };


  // const handleSubmit = async (e) => {
  //   e.preventDefault();
  //   try {
  //     const response = await axios.post(`${import.meta.env.VITE_API_URL}/submit-marks-by-subject/`, {
  //       bySubjectVars,
  //       marks,
  //     });
  //     console.log("Marks submitted successfully:", response.data);
  //   } catch (error) {
  //     console.error("Error submitting marks:", error);
  //   }
  // };


  // const handleSubmit = async (e) => {
  //   e.preventDefault();
  
  //   const requestData = {
  //     ...bySubjectVars, // Data from the context API
  //     MarksForType: Object.entries(marks).map(([markType, value]) => ({
  //       mark_type: markType,
  //       marks: value,
  //     })),
  //   };
  
  //   try {
      
  //     fetchData(createNewAccessToken, "submit-marks-by-subject", requestData );
  //     const response = await axios.post(`${import.meta.env.VITE_API_URL}/submit-marks-by-subject/`, requestData);
  //     console.log("Marks submitted successfully:", response.data);


  //   } catch (error) {
  //     console.error("Error submitting marks:", error.response?.data || error.message);
  //   }
  // };

  const handleSubmit = async (e) => {
    
    e.preventDefault();
    console.log(marks);
    
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
    console.log(requestData);
  
    try {
      const response = await saveFormData(createNewAccessToken, "submit-marks-by-subject", requestData);
      console.log("Marks submitted successfully:", response);
    } catch (error) {
      console.error("Error submitting marks:", error.response?.data || error.message);
    }
  };
  
  




  
  
  return (
    <> 
        {
          showStudent ? (
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
                            <div className="col-xl-1">
                              <div className={`heading serial-no ${rowClass}`}>
                                {String(index + 1).padStart(2, "0")}
                              </div>
                            </div>
                            <div className="col-xl-7">
                              <div className={`heading name-heading ${rowClass}`}>{student.name}</div>
                            </div>
                            <div className="col-xl-1">
                              <div className={`heading roll-heading ${rowClass}`}>
                                {student.roll_number}
                              </div>
                            </div>
                            <div className="col-xl-3">
                              <div className={`heading marks-heading ${rowClass}`}>
                                <input
                                  type="number"
                                  value={marks[student.id] || ""}
                                  placeholder=''
                                  onChange={(e) => handleMarksChange(student.id, e.target.value)}
                                />
                              </div>
                            </div>
                          </div>
                        );
                      })}
                      <div className="save-button">
                        <button type="submit"> Save </button>
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