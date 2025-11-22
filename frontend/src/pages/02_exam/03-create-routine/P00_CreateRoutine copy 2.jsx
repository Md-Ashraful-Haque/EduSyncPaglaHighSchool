import "./CreateRoutine.scss";
import React, { useState } from "react";
import SelectFields from "pageComponents/SelectFields";
import YearSelector from "pageComponents/yearSelector/YearSelector";
import FullScreenModal from "pageComponents/02_full_screen_window";

import Loading_1 from "LoadingComponent/loading/Loading_1";
import { toast } from "react-toastify";
import { doGetAPIcall,  } from "Utils/utilsFunctions/UtilFuntions";
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
          onChange={(e) =>
            updateRoutine(index, "subject_id", e.target.value)
          }
        >
          <option value="">Select Subject</option>
          {subjects.map((sub) => (
            <option key={sub.id} value={sub.id}>
              {sub.subject_name} ({sub.subject_code})
            </option>
          ))}
        </select>
      </td>

      <td>
        <input
          type="date"
          value={row.exam_date}
          onChange={(e) =>
            updateRoutine(index, "exam_date", e.target.value)
          }
        />
      </td>

      <td>
        <input
          type="time"
          value={row.start_time}
          onChange={(e) =>
            updateRoutine(index, "start_time", e.target.value)
          }
        />
      </td>

      <td>
        <input
          type="time"
          value={row.end_time}
          onChange={(e) =>
            updateRoutine(index, "end_time", e.target.value)
          }
        />
      </td>
    </tr>
  );
};

////////////////////////////////////////////////////////////////////////////////

const CreateExamRoutine = () => {
  const { createNewAccessToken } = useAppContext();

  // For selected student data (from your previous code)
  const [students, setStudents] = useState([]);

  // Modal & loading
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Routine form states
  const [showRoutineForm, setShowRoutineForm] = useState(false);
  const [subjects, setSubjects] = useState([]);

  const [routineRows, setRoutineRows] = useState([
    { subject_id: "", exam_date: "", start_time: "", end_time: "" },
  ]);

  const { bySubjectVars, updateBySubjectVars } = useMarksInputBySubjectContext();

  ///////////////////////////////////////////////////////////////////////////
  // Update Form Field
  const handleChange = (event, varName) => {
    updateBySubjectVars(varName, event.target.value);
  };

  ///////////////////////////////////////////////////////////////////////////
  // Submit basic filters → then load subjects → then open routine form modal
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // 🔥 Fetch subjects based on selected class + group
      const subjectRes = await doGetAPIcall(
        createNewAccessToken,
        "get-subjects-by-class-group",
        {
          class_id: bySubjectVars.class_name,
          group_id: bySubjectVars.group_name_bangla,
        }
      );

      setSubjects(subjectRes);

      // Open modal with form
      setShowRoutineForm(true);
      setIsModalOpen(true);
    } catch (error) {
      toast.error("Error loading subjects");
    } finally {
      setIsLoading(false);
    }
  };

  ///////////////////////////////////////////////////////////////////////////
  // Add New Routine Row
  const addRoutineRow = () => {
    setRoutineRows([
      ...routineRows,
      { subject_id: "", exam_date: "", start_time: "", end_time: "" },
    ]);
  };

  ///////////////////////////////////////////////////////////////////////////
  // Update specific row
  const updateRoutine = (index, field, value) => {
    const updated = [...routineRows];
    updated[index][field] = value;
    setRoutineRows(updated);
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
      // await doPostAPIcall(
      //   createNewAccessToken,
      //   "exam-routine-create",
      //   payload
      // );

      toast.success("Routine saved successfully!");
      setIsModalOpen(false);
    } catch (error) {
      toast.error("Failed to save routine");
    }
  };

  ///////////////////////////////////////////////////////////////////////////
  // UI Rendering
  if (isLoading) return <Loading_1 />;

  return (
    <div className="generate-result">
      <FormHeading
        heading={"পরীক্ষার রুটিন তৈরির ফর্ম"}
        groupwise={"বিভাগ"}
      />

      {/* FORM */}
      <form onSubmit={handleSubmit}>
        <div className="field-selector-form-container">

          <div className="field-selector-form">

            {/* SHIFT */}
            <div id="field-selector-form">
              <div id="option-component">
                <div className="option-label"> শিফট </div>
                <div className="option-value">
                  <select
                    value={bySubjectVars.shift}
                    onChange={(e) => handleChange(e, "shift")}
                  >
                    <option value="morning">Morning</option>
                    <option value="day">Day</option>
                  </select>
                </div>
              </div>
            </div>

            {/* YEAR */}
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


            {/* ///////////////////////////////// */}
            <div className="routine-form">

              <h2>নতুন পরীক্ষার রুটিন যুক্ত করুন</h2>

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
                      subjects={subjects}
                    />
                  ))}
                </tbody>
              </table>

              <button className="btn-add" onClick={addRoutineRow}>
                + আরেকটি যোগ করুন
              </button>

              <button className="btn-save" onClick={saveRoutine}>
                রুটিন সেভ করুন
              </button>

            </div>
            {/* ///////////////////////////////// */}
          </div>

          <div className="result-generator-button">
            <button type="submit" className="generate-btn">
              পরীক্ষার রুটিন তৈরী করুন
            </button>
          </div>

        </div>
      </form> 
    </div>
  );
};

export default CreateExamRoutine;
