import "./CreateRoutine.scss";
import React, { useState } from "react";

import SelectFields from "pageComponents/SelectFields";
import YearSelector from "pageComponents/yearSelector/YearSelector";

import Loading_1 from "LoadingComponent/loading/Loading_1";
import { toast } from "react-toastify";

import { doGetAPIcall, saveFormData } from "Utils/utilsFunctions/UtilFuntions";
import { useMarksInputBySubjectContext } from "ContextAPI/MarksInputBySubjectContext";
import { useAppContext } from "ContextAPI/AppContext";

import FormHeading from "pageComponents/classwise-or-sectionwise/FormHeading";

////////////////////////////////////////////////////////////////////////////////
// Small component for each row
const RoutineRow = ({ index, row, updateRoutine, subjects }) => {
  return (
    <tr>
      <td>
        <select
          value={row.subject_id}
          onChange={(e) => updateRoutine(index, "subject_id", e.target.value)}
        >
          <option value="">Select Subject</option>
          {subjects.map((sub) => (
            <option key={sub.id} value={sub.id}>
              {sub.subject_name_display}
            </option>
          ))}
        </select>
      </td>

      <td>
        <input
          type="date"
          value={row.exam_date}
          onChange={(e) => updateRoutine(index, "exam_date", e.target.value)}
        />
      </td>

      <td>
        <input
          type="time"
          value={row.start_time}
          onChange={(e) => updateRoutine(index, "start_time", e.target.value)}
        />
      </td>

      <td>
        <input
          type="time"
          value={row.end_time}
          onChange={(e) => updateRoutine(index, "end_time", e.target.value)}
        />
      </td>
    </tr>
  );
};

////////////////////////////////////////////////////////////////////////////////

const CreateExamRoutine = () => {
  const { createNewAccessToken } = useAppContext();
  const { bySubjectVars, updateBySubjectVars } =
    useMarksInputBySubjectContext();

  // Loading
  const [isLoading, setIsLoading] = useState(false);

  // Routine form states
  const [showRoutineForm, setShowRoutineForm] = useState(false);
  const [subjects, setSubjects] = useState([]);

  const [routineRows, setRoutineRows] = useState([
    { subject_id: "", exam_date: "", start_time: "", end_time: "" },
  ]);

  // Track selected subjects to prevent duplicates
  const [selectedSubjects, setSelectedSubjects] = useState([]);

  ///////////////////////////////////////////////////////////////////////////
  // Update selection fields (shift, year, class, group, exam)
  const handleChange = (event, varName) => {
    updateBySubjectVars(varName, event.target.value);

    // Reset routine form on change
    setShowRoutineForm(false);
    setRoutineRows([
      { subject_id: "", exam_date: "", start_time: "", end_time: "" },
    ]);
    setSelectedSubjects([]);
  };

  ///////////////////////////////////////////////////////////////////////////
  // Submit → Load subjects + show routine creation table
  // Auto-load subjects based on selected filters
  // React.useEffect(() => {
  //   const loadSubjects = async () => {
  //     if (
  //       bySubjectVars.year &&
  //       bySubjectVars.class_name &&
  //       bySubjectVars.group_name_bangla &&
  //       bySubjectVars.exam_name
  //     ) {
  //       setIsLoading(true);
  //       try { 
  //         const subjectRes = await doGetAPIcall(
  //           createNewAccessToken,
  //           "subject--by-group",
  //           {
  //             institute_id: 1,
  //             year_id: bySubjectVars.year,
  //             class_instance_id: bySubjectVars.class_name,
  //             group_id: bySubjectVars.group_name_bangla,
  //           }
  //         );

  //         setSubjects(subjectRes);
  //         setShowRoutineForm(true);

  //         // Reset routines when subject reloads
  //         setRoutineRows([
  //           { subject_id: "", exam_date: "", start_time: "", end_time: "" },
  //         ]);

  //         setSelectedSubjects([]); 
  //       } catch (error) {
  //         toast.error("Could not load subjects.");
  //         console.log("error");
  //       } finally {
  //         setIsLoading(false); 
  //       } 
  //     }
  //   };
  //   console.log(
  //     bySubjectVars.year,
  //     bySubjectVars.class_name,
  //     bySubjectVars.group_name_bangla,
  //     bySubjectVars.exam_name
  //   );
  //   console.log("Change Values");
  //   loadSubjects();
  // }, [
  //   bySubjectVars.year,
  //   bySubjectVars.class_name,
  //   bySubjectVars.group_name_bangla,
  //   bySubjectVars.exam_name,
  // ]);

  const loadSubjects = React.useCallback(async () => {
  if (
    bySubjectVars.year &&
    bySubjectVars.class_name &&
    bySubjectVars.group_name_bangla &&
    bySubjectVars.exam_name
  ) {
    setIsLoading(true);

    try {
      const subjectRes = await doGetAPIcall(
        createNewAccessToken,
        "subject--by-group",
        {
          institute_id: 1,
          year_id: bySubjectVars.year,
          class_instance_id: bySubjectVars.class_name,
          group_id: bySubjectVars.group_name_bangla,
        }
      );

      setSubjects(subjectRes);
      setShowRoutineForm(true);

      setRoutineRows([
        { subject_id: "", exam_date: "", start_time: "", end_time: "" },
      ]);

      setSelectedSubjects([]);
    } catch (error) {
      toast.error("Could not load subjects.");
    } finally {
      setIsLoading(false);
    }
  }
}, [
  bySubjectVars.year,
  bySubjectVars.class_name,
  bySubjectVars.group_name_bangla,
  bySubjectVars.exam_name,
  createNewAccessToken,
]);

React.useEffect(() => {
  loadSubjects();
}, [loadSubjects]);


  ///////////////////////////////////////////////////////////////////////////
  // Add new row
  const addRoutineRow = () => {
    if (selectedSubjects.length >= subjects.length) {
      toast.error("All subjects already selected.");
      return;
    }

    setRoutineRows([
      ...routineRows,
      { subject_id: "", exam_date: "", start_time: "", end_time: "" },
    ]);
  };

  const updateRoutine = (index, field, value) => {
    const updated = [...routineRows];

    if (field === "subject_id") {
      const oldSub = Number(updated[index].subject_id);
      const newSub = Number(value);

      updated[index].subject_id = newSub;
      setRoutineRows(updated);

      setSelectedSubjects((prev) => {
        let newList = [...prev];

        if (oldSub && newList.includes(oldSub)) {
          newList = newList.filter((id) => id !== oldSub);
        }

        if (newSub && !newList.includes(newSub)) {
          newList.push(newSub);
        }

        return newList;
      });

      return;
    }

    updated[index][field] = value;
    setRoutineRows(updated);
  };

  ///////////////////////////////////////////////////////////////////////////
  // Filter dropdown subjects per row
  // const getFilteredSubjects = (index) => {
  //   return subjects.filter(
  //     (sub) =>
  //       !selectedSubjects.includes(sub.id) ||
  //       routineRows[index].subject_id === sub.id
  //   );
  // };
  const getFilteredSubjects = (index) => {
    return subjects.filter(
      (sub) =>
        !selectedSubjects.includes(Number(sub.id)) ||
        Number(routineRows[index].subject_id) === Number(sub.id)
    );
  };

  ///////////////////////////////////////////////////////////////////////////
  // Save Routine to backend
  const saveRoutine = async () => {
    const payload = {
      exam_id: bySubjectVars.exam_name,
      class_instance_id: bySubjectVars.class_name,
      group_id: bySubjectVars.group_name_bangla,
      routines: routineRows,
    };

    try {
      await saveFormData(createNewAccessToken, "exam-routine-create", payload);

      toast.success("Routine saved successfully!");
    } catch (error) {
      toast.error("Failed to save routine");
    }
  };

  ///////////////////////////////////////////////////////////////////////////

  if (isLoading) return <Loading_1 />;

  return (
    <div className="generate-result">
      <FormHeading
        heading={"পরীক্ষার রুটিন তৈরির ফর্ম (Date-wise)"}
        groupwise={"বিভাগ"}
      />

      {/* ================= FORM ================= */}
      <form>
        <div className="field-selector-form-container">
          <div className="field-selector-form">
            <div id="field-selector-form">
              <div id="option-component">
                <div className="option-label"> শিফট </div>
                <div className="option-value">
                  <div className="shift-section">
                    <select
                      name="session"
                      id="shitf-name"
                      value={bySubjectVars.shift}
                      onChange={(event) => {
                        handleChange(event, "shift");
                      }}
                    >
                      <option value="morning">Morning</option>
                      <option value="day">Day</option>
                      {/* <option value="afternoon">Afternoon</option> */}
                      {/* <option value="evening">Evening</option> */}
                    </select>
                  </div>
                </div>
              </div>
            </div>

            <div id="field-selector-form">
              <div id="option-component">
                <div className="option-label"> বছর </div>
                <div className="option-value">
                  <YearSelector />
                </div>
              </div>
            </div>

            {/* CLASS → GROUP → EXAM */}
            <SelectFields fields={["class", "group", "exam-by-year"]} />
            {/* /////////////////////////// Add Subject for Exam //////////////////////////////// */}
            <div className="routine-form">
              <table className="routine-table">
                <thead>
                  <tr>
                    <th>বিষয়</th>
                    <th>তারিখ</th>
                    <th>শুরুর সময়</th>
                    <th>শেষ সময়</th>
                  </tr>
                </thead>

                <tbody>
                  {routineRows.map((row, index) => (
                    <RoutineRow
                      key={index}
                      index={index}
                      row={row}
                      updateRoutine={updateRoutine}
                      subjects={getFilteredSubjects(index)}
                    />
                  ))}
                </tbody>
              </table>
              
              {selectedSubjects.length < subjects.length &&(
                <button className="btn-add generate-btn" type="button" onClick={addRoutineRow}>
                  + আরও একটি বিষয় যোগ করুন
                </button>
              )}

              {/* <button className="btn-save" type="button" onClick={saveRoutine}>
                রুটিন সেভ করুন
              </button> */}
            </div>

            {/* /////////////////////////////////////////////////////////// */}
          </div>

          <div className="result-generator-button">
            {/* <button type="submit" className="generate-btn">
              রুটিন তৈরী করুন
            </button> */}

            <button
              className="generate-btn btn-save"
              type="button"
              onClick={saveRoutine}
            >
              রুটিন সেভ করুন
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default CreateExamRoutine;
