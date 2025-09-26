import "./EnterMarksBySubject.scss";

import { useRef, useEffect, useState } from "react";
// import axios from "axios";
import {
  areAllFieldsFilled,
  saveFormData,
  areAllFieldsFilledExceptMarkType,
  markTypeBangla,
} from "Utils/utilsFunctions/UtilFuntions";

import { useMarksInputBySubjectContext } from "ContextAPI/MarksInputBySubjectContext";
import { fetchData } from "FormFields";
import { useAppContext } from "ContextAPI/AppContext";

import { toast } from "react-toastify";
import MarkTypeCheckboxes from "./MarkTypeCheckboxes";
import SelectFields from "pageComponents/SelectFields";



const StudentListForOneSubject = () => {
  const { createNewAccessToken,vars } = useAppContext();
  const { bySubjectVars} = useMarksInputBySubjectContext();
  const [showStudent, setShowStudent] = useState(false);
  const [showAllMarkType, setShowAllMarkType] = useState(false);
  const [markTypes, setMarkTypes] = useState([]);

  const [students, setStudents] = useState([]);
  const [marks, setMarks] = useState({});
  const [selectedMarkTypes, setSelectedMarkTypes] = useState([]);
  const [maxMarks, setMaxMarks] = useState(100);
  const inputRefs = useRef({}); // store multiple refs by student ID
  const [invalidInputs, setInvalidInputs] = useState({});
  const [selectedFile, setSelectedFile] = useState(null);
  const fileInputRef = useRef(null);

  

  useEffect(() => {
    // console.log("bySubjectVars: ", bySubjectVars);
    // console.log("vars: ", vars);
    const isCompleted = areAllFieldsFilled(bySubjectVars);
    // console.log("isCompleted: ", isCompleted);
    setShowStudent(isCompleted);
    const isCompletedWithoutMarkType =
      areAllFieldsFilledExceptMarkType(bySubjectVars);
    setShowAllMarkType(isCompletedWithoutMarkType);

    // console.log("bySubjectVars: ", bySubjectVars);

    // Fetch students only if all required fields are filled
    if (isCompletedWithoutMarkType) {
      setInvalidInputs({});

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
        // mark_type_name: bySubjectVars.mark_type_display,
        // subject_name: bySubjectVars.subject_name_display,
        // mark_type_name: bySubjectVars.mark_type_display,
      }).then((data) => {
        setMarks(data.marks);
        setMaxMarks(data.max_marks);
        // console.log("marks: ", data.marks);
        // console.log("max_marks: ", data.max_marks);
      });
    } else {
      setStudents([]); // Clear student list if fields are incomplete
      setInvalidInputs({});
      // console.log("Incomplete fields, not fetching students.");
    }

    setSelectedMarkTypes([]);
    // if (isCompletedWithoutMarkType) {
    //   fetchData(createNewAccessToken, "mark-types-by-subject", {
    //     subject_for_ims_id: bySubjectVars.subject_name_display,
    //   }).then(setMarkTypes);
    // }

    if (isCompletedWithoutMarkType) {
      fetchData(createNewAccessToken, "mark-types-by-subject", {
        subject_for_ims_id: bySubjectVars.subject_name_display,
      }).then((data) => {
        setMarkTypes(data);

        // সবগুলো mark_type initial select
        if (data?.all_mark_types?.length > 0) {
          const allTypes = data.all_mark_types.map((mt) => mt.mark_type);
          setSelectedMarkTypes(allTypes);
        }
      });
    }


    ////////////////////////////////// Reset file selection //////////

    // console.log("selectedFile: ", selectedFile)
    setSelectedFile(null); // state reset
    if (fileInputRef.current) {
      fileInputRef.current.value = ""; // file input reset
    }
  }, [bySubjectVars]);

  // const handleMarksChange = (studentId, value) => {
  //   setMarks((prevMarks) => ({
  //     ...prevMarks,
  //     [studentId]: value,
  //   }));
  // };

  const handleMarksChange = (studentId, markType, value) => {
  setMarks(prevMarks => {
    // Get previous marks for the student or empty object
    const studentMarks = prevMarks[studentId] || {};

    // Update the specific markType with new value
    const updatedStudentMarks = {
      ...studentMarks,
      [markType]: value === '' ? -1 : Number(value)  // convert to number, keep '' for empty input
    };

    return {
      ...prevMarks,
      [studentId]: updatedStudentMarks,
    };
  });
};
 
  const handleSubmitForSaveOrUpdateMarks = async (e) => {
    e.preventDefault();
    // console.log("Save able marks: ",marks);

    const filteredMarks = Object.fromEntries(
        Object.entries(marks).map(([studentId, markTypes]) => [
          studentId,
          Object.fromEntries(
            Object.entries(markTypes).filter(([type]) =>
              selectedMarkTypes.includes(type)
            )
          )
        ])
      );

      // console.log(filteredMarks);


    // console.log("filteredMarks: ",filteredMarks);

    const markType = bySubjectVars.mark_type_display;
    const requestData = {
      ...bySubjectVars,
      MarksForType: Object.entries(marks).map(([studentID, value]) => ({
        mark_type: markType,
        marks: value,
      })),
      Student: Object.entries(marks).map(([studentID, value]) => ({
        id: studentID,
      })),

      all_marks_with_student_id: filteredMarks,
      all_mark_types: selectedMarkTypes,
    };
    // console.log("requestData: ", requestData);

    try {
      const response = await saveFormData(
        createNewAccessToken,
        "submit-multiple-marks-type-by-subject",
        requestData
      );
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
      });
      // console.log("Marks submitted successfully:", response);
    } catch (error) {
      // console.error("Error submitting marks:", error.response?.data || error.message);
      // Show error toast message

      toast.error( error.response.data.detail);
    }
  };

  const validateInput = (value, max) => {
    if (value === "") {
      return false;
    }

    // const num = Number(value);
    const num = parseInt(value, 10);
    const valid = isNaN(num) || num < -1 || num > max;
    return valid;
  };

  const handleBlur = (studentId,markType, value, max) => {
    // const num = parseInt(value, 10);
    // const isInvalid = isNaN(num) || num < -1 || num > max || num === '';
    const isInvalid = validateInput(value, max);

    setInvalidInputs((prev) => ({
      ...prev,
      // [studentId]: isInvalid,
      [`${studentId}_${markType}`]: isInvalid,
    })); 
    if (isInvalid) {
      toast.error(
        "অনুগ্রহ করে -1 থেকে " + max + " এর মধ্যে একটি সংখ্যা প্রদান করুন।",
        {
          position: "top-right",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: false,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
        }
      );

      setTimeout(() => {
        // Focus the specific input element for this student and markType
        if (inputRefs.current[studentId] && inputRefs.current[studentId][markType]) {
          inputRefs.current[studentId][markType].focus();
        }
      }, 100);
    }

  };


  const handleCSVUpload = (event) => {
    const file = event.target.files[0];
    if (!file) return;
    setSelectedFile(file);

    const reader = new FileReader();

    reader.onload = (e) => {
      const text = e.target.result;

      // লাইন ভেঙে array বানানো
      const lines = text.split("\n").map((line) => line.trim()).filter(Boolean);

      if (lines.length < 2) {
        console.error("CSV does not have enough data.");
        return;
      }

      // প্রথম লাইন → headers
      const headers = lines[0].split(",").map((h) => h.trim());
      // console.log("Headers:", headers);

      // বাকিগুলো → data rows
      const rows = lines.slice(1).map((line) => {
        const values = line.split(",").map((v) => v.trim());
        return headers.reduce((obj, header, i) => {
          obj[header] = values[i];
          return obj;
        }, {});
      });

      // console.log("Parsed Rows:", rows);

      // এখন roll number দিয়ে student match করব
      const updatedMarks = {};

      students.forEach((student) => {
        const row = rows.find(
          (r) => Number(r.Roll) === Number(student.roll_number)
        );

        // if (row["Section"] != bySubjectVars.section_name) { // Here section_name is id of section
        //   alert( bySubjectVars.section_name);
        //   return 0;
        // }

        if (row) {
          updatedMarks[student.id] = {};

          selectedMarkTypes.forEach((markType) => {
            // console.log("markType: ", markType); 
            let markTypeMap = markType === "WR"? "Written": markType;
            updatedMarks[student.id][markType] = row[markTypeMap] ? Number(row[markTypeMap]) : -1;
          });
        }else{
          updatedMarks[student.id] = {};

          selectedMarkTypes.forEach((markType) => { 
            updatedMarks[student.id][markType] = marks[student.id][markType];
          });
        }
      });

      // console.log("updatedMarks:", updatedMarks);
      setMarks(updatedMarks);
    };

    reader.readAsText(file);
  };


  return (
    <>
      <div className="subject-selector-form-container p-2">
        <div className="subject-selector-form current-session-header">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 m-2 sm:!m-4 xl:!m-8">
            <SelectFields fields={["class"]} />
            <SelectFields fields={["group"]} />
            <SelectFields fields={["section"]} />
            <SelectFields fields={["exam"]} />
            <SelectFields fields={["subject"]} />
            {/* <SelectFields
            fields={["class", "group", "section", "exam", "subject"]} 
          /> */}

            <div id="field-selector-form">
              <div className="form-fields">
                <div id="option-component" className="border">
                  <div className="option-label">CSV:</div>
                  <div className="option-value">
                    {/* <input
                      className="w-full"
                      type="file"
                      accept=".csv"
                      onChange={handleCSVUpload}
                    /> */}

                    <div className="relative">
                      <input
                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                        type="file"
                        accept=".csv"
                        onChange={handleCSVUpload}
                      />
                      <div className="w-full px-3 py-2  bg-white text-sm">
                        {selectedFile ? selectedFile.name : 'Choose file'}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <MarkTypeCheckboxes
        markTypes={markTypes}
        selectedMarkTypes={selectedMarkTypes}
        setSelectedMarkTypes={setSelectedMarkTypes}
      />

      {showAllMarkType && selectedMarkTypes.length > 0 ? (
        <div className="enter-marks-by-subject-form-query-fields">
          <div className="mark-entry-heading">
            {/* {bySubjectVars.subject_name_display} বাংলা বিষয়ের জন্য  */}
            মার্ক ইনপুট করুন।
          </div>

          <div className="section-wise-student-marks-entry">
            <div className="marks-entry-for-one-subject">
              <div className="container-fluid overflow-auto">
                 <div className="row flex-nowrap !min-w-[574px]"> {/*/////////////////////////////// */}
                  <div className="col-1 d-none d-lg-block">
                    <div className="heading serial-no">ক্রমিক নং</div>
                  </div>
                  <div className="col-6 col-md-3">
                    <div className="heading name-heading">নাম</div>
                  </div>
                  <div className="col-2 col-md-1">
                    <div className="heading roll-heading">রোল</div>
                  </div>

                  {markTypes?.all_mark_types?.length > 0 ? (
                    markTypes.all_mark_types.map((type) => {
                      return selectedMarkTypes.includes(type.mark_type) ? (
                        <div className="col-2" key={type.id}>
                          <div className="heading">
                            {markTypeBangla(type.mark_type_display)} (
                            {type.max_marks})
                          </div>
                        </div>
                      ) : null;
                    })
                  ) : (
                    <p>No mark types found.</p>
                  )}

                  <div className="col-1 col-md-2 col-lg-1">
                    <div className="heading">মোট</div>
                  </div>

                </div>

                {/* <form onSubmit={handleSubmit}> */}
                <form onSubmit={handleSubmitForSaveOrUpdateMarks} className="!min-w-[550px] mb-32 ">
                  {students.map((student, index) => {
                    const isEven = index % 2 === 0;
                    const rowClass = isEven ? "data-even" : "data-odd";

                    // Get the marks object for this student, or empty object if none
                    const studentMarks = marks[student.id] || {};

                    // console.log("studentMarks", studentMarks);

                    return (
                      <div key={student.id} className="row flex-nowrap">
                        <div className="col-1 d-none d-lg-block">
                          <div className={`heading serial-no ${rowClass}`}>
                            {String(index + 1).padStart(2, "0")}
                          </div>
                        </div>
                        <div className="col-6 col-md-3">
                          <div className={`heading name-heading ${rowClass}`}>
                            {student.name}
                          </div>
                        </div>
                        <div className="col-2 col-md-1">
                          <div className={`heading roll-heading ${rowClass}`}>
                            {student.roll_number}
                          </div>
                        </div>

                        {/* Iterate over mark types for this student */}
                        {Object.entries(studentMarks).map(
                          ([markType, markValue]) =>
                            selectedMarkTypes.includes(markType) ? (
                              <div key={markType} className="col-2">
                                <div
                                  className={`heading marks-heading ${rowClass}`}
                                >



                                  <input
                                    className={`
                                        ${markValue === -1 ? "!text-sm" : ""}
                                        ${
                                          invalidInputs[
                                            `${student.id}_${markType}`
                                          ]
                                            ? "!border-red-500 !bg-red-50"
                                            : ""
                                        }
                                        border p-2
                                      `}
                                    type="number"
                                    value={
                                      markValue === -1 ||
                                      markValue === undefined
                                        ? ""
                                        : markValue
                                    }
                                    disabled={vars.is_staff ? false : true}
                                    placeholder={`-1 থেকে ${maxMarks[markType]}`}
                                    min={-1}
                                    max={maxMarks[markType]}
                                    onWheel={(e) => e.target.blur()}
                                    onChange={(e) =>
                                      handleMarksChange(
                                        student.id,
                                        markType,
                                        e.target.value
                                      )
                                    }
                                    onBlur={(e) =>
                                      handleBlur(
                                        student.id,
                                        markType,
                                        e.target.value,
                                        maxMarks[markType]
                                      )
                                    } //studentId,markType, value, max
                                    ref={(el) => {
                                      if (el) {
                                        if (!inputRefs.current[student.id])
                                          inputRefs.current[student.id] = {};
                                        inputRefs.current[student.id][
                                          markType
                                        ] = el;
                                      }
                                    }}
                                  />



                                </div>
                              </div>
                            ) : null
                        )} 
                        {/* /////////////////////////////////////////////////////////////////////////
                        ///////////////////////////////////////////////////////////////////////// */}
                        <div className="col-1 col-md-2 col-lg-1">
                          {(() => {
                            const sum = Object.entries(studentMarks)
                              .filter(([markType]) => selectedMarkTypes.includes(markType))
                              .reduce((acc, [, markValue]) => {
                                const num = Number(markValue);
                                return acc + (isNaN(num) || num === -1 ? 0 : num);
                              }, 0);

                            // check special cases
                            const highlightRed = [39, 49, 59, 69, 79].includes(sum) || sum < 33;
                            // console.log("===========highlightRed: ", highlightRed);
                            return (
                              <div
                                className={`heading ${
                                  highlightRed ? "!bg-red-100 !text-red-700" : "!bg-green-100 !text-green-700"
                                }`}
                              >
                                {sum} 
                              </div>
                            );
                          })()}
                        </div>

                        {/* /////////////////////////////////////////////////////////////////////////
                        ///////////////////////////////////////////////////////////////////////// */}
                      </div>
                    );
                  })}
                  {vars.is_staff && (
                    <div className="print-button">
                      <div className="save-button">
                        <button type="submit"> সংরক্ষণ করুন </button>
                      </div>
                    </div>
                  )}
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
      )}
    </>
  );
};

StudentListForOneSubject.propTypes = {};

export default StudentListForOneSubject;
