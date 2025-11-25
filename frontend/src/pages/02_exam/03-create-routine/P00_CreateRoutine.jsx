import React, { useState, useRef, useCallback, useEffect } from "react";
import "./CreateRoutine.scss";

import SelectFields from "pageComponents/SelectFields";
import YearSelector from "pageComponents/yearSelector/YearSelector";
// import PublicYearSelector from "pageComponents/yearSelector/PublicYearSelector";
import FormHeading from "pageComponents/classwise-or-sectionwise/FormHeading";

import Loading_1 from "LoadingComponent/loading/Loading_1";
import { toast } from "react-toastify";

import { doGetAPIcall, saveFormData } from "Utils/utilsFunctions/UtilFuntions";
import { useMarksInputBySubjectContext } from "ContextAPI/MarksInputBySubjectContext";
import { useAppContext } from "ContextAPI/AppContext";
import { Save, Upload } from "lucide-react";
import { BookOpen, Calendar, Clock, Trash2, Check } from "lucide-react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

// ==================================================================
// Routine Row Component — Clean + Clickable Icons
// ==================================================================

const RoutineRow = ({ index, row, updateRoutine, subjects, deleteRow }) => {
  const dateRef = useRef(null);
  const startRef = useRef(null);
  const endRef = useRef(null);

  return (
    <tr>
      {/* SUBJECT */}
      <td data-label="বিষয়">
        <div className="input-with-icon">
          <BookOpen className="icon" />
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
        </div>
      </td>

      {/* DATE */}
      <td data-label="তারিখ">
        <div className="input-with-icon">
          {/* <Calendar
            className="icon clickable"
            onClick={() => dateRef.current?.showPicker()}   // FIX
            required
          />  */}
          {/* Calendar icon that opens the date picker */}
          <Calendar
            className="icon clickable"
            onClick={() => dateRef.current?.setOpen(true)}
          />
          <DatePicker
            ref={dateRef}
            selected={row.exam_date ? new Date(row.exam_date) : null}
            onChange={(date) => {
              const formatted = date.toISOString().split("T")[0]; // YYYY-MM-DD
              updateRoutine(index, "exam_date", formatted);
            }}
            dateFormat="dd/MM/yyyy"
            placeholderText="dd/mm/yyyy"
            className="date-input"
          />
          {/* <input
            ref={dateRef}
            type="date"
            value={row.exam_date}
            required
            onChange={(e) => updateRoutine(index, "exam_date", e.target.value)}
          /> */}
        </div>
      </td>

      {/* START TIME */}
      <td data-label="শুরুর সময়">
        <div className="input-with-icon">
          <Clock
            className="icon clickable"
            onClick={() => startRef.current?.showPicker()} // FIX
          />

          <input
            ref={startRef}
            type="time"
            value={row.start_time}
            onChange={(e) => updateRoutine(index, "start_time", e.target.value)}
          />
        </div>
      </td>

      {/* END TIME */}
      <td data-label="শেষ সময়">
        <div className="input-with-icon">
          <Clock
            className="icon clickable"
            onClick={() => endRef.current?.showPicker()} // FIX
          />

          <input
            ref={endRef}
            type="time"
            value={row.end_time}
            onChange={(e) => updateRoutine(index, "end_time", e.target.value)}
          />
        </div>
      </td>

      {/* DELETE */}
      <td data-label="ডিলিট">
        <button className="delete-btn" onClick={() => deleteRow(index)}>
          <Trash2 size={20} />
        </button>
      </td>
    </tr>
  );
};

// ==================================================================
// MAIN COMPONENT
// ==================================================================

const CreateExamRoutine = () => {
  const { createNewAccessToken } = useAppContext();
  const { bySubjectVars, updateBySubjectVars } =
    useMarksInputBySubjectContext();

  const [isLoading, setIsLoading] = useState(false);
  const [showRoutineForm, setShowRoutineForm] = useState(false);
  const [subjects, setSubjects] = useState([]);

  const [togglePublishButton, setTogglePublishButton] = useState(false);
  const [publish, setPublish] = useState(false);

  const [routineRows, setRoutineRows] = useState([
    { subject_id: "", exam_date: "", start_time: "", end_time: "" },
  ]);

  const [selectedSubjects, setSelectedSubjects] = useState([]);

  // ==================================================================
  // Handle SelectFields Change
  // ==================================================================

  const handleChange = (e, field) => {
    updateBySubjectVars(field, e.target.value);

    setShowRoutineForm(false);
    setRoutineRows([
      { subject_id: "", exam_date: "", start_time: "", end_time: "" },
    ]);
    setSelectedSubjects([]);
  };

  // ==================================================================
  // Load Subjects — CLEAN + STABLE
  // ==================================================================

  const loadSubjects = useCallback(async () => {
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
          "subject-by-group",
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
      } catch (err) {
        toast.error("Could not load subjects.");
      } finally {
        setIsLoading(false);
      }
    }
  }, [bySubjectVars, createNewAccessToken]);

  useEffect(() => {
    loadSubjects();
  }, [loadSubjects]);

  const loadExistingRoutine = useCallback(async () => {
    if (
      bySubjectVars.year &&
      bySubjectVars.class_name &&
      bySubjectVars.group_name_bangla &&
      bySubjectVars.exam_name
    ) {
      try {
        const result = await doGetAPIcall(
          createNewAccessToken,
          "exam-routine-list",
          {
            exam_id: bySubjectVars.exam_name,
            class_instance_id: bySubjectVars.class_name,
            group_id: bySubjectVars.group_name_bangla,
          }
        );

        if (result.length > 0) {
          setRoutineRows(
            result.map((r) => ({
              subject_id: r.subject_id,
              exam_date: r.exam_date,
              start_time: r.start_time,
              end_time: r.end_time,
            }))

          );
          // console.log("==========================");
          // console.log("result[0].is_published: ", result[0].is_published);
          // console.log("==========================");
          setPublish(result[0].is_published);
          setSelectedSubjects(result.map((r) => r.subject_id));
        } else {
          // No previous routine
          setRoutineRows([
            { subject_id: "", exam_date: "", start_time: "", end_time: "" },
          ]);
          setSelectedSubjects([]);
        }
      } catch (err) {
        console.log("Routine load error", err);
      }
    }
  }, [bySubjectVars, createNewAccessToken]);

  useEffect(() => {
    async function run() {
      await loadSubjects();
      await loadExistingRoutine(); // <-- NEW
    }
    run();
  }, [loadSubjects, loadExistingRoutine]);

  // ==================================================================
  // Add Row
  // ==================================================================

  // const addRoutineRow = () => {
  //   if (selectedSubjects.length >= subjects.length) {
  //     toast.error("All subjects selected!");
  //     return;
  //   }

  //   setRoutineRows([...routineRows, { subject_id: "", exam_date: "", start_time: "", end_time: "" }]);
  // };

  const addRoutineRow = () => {
    if (selectedSubjects.length >= subjects.length) {
      toast.error("All subjects selected!");
      return;
    }

    // Get last row values
    const lastRow = routineRows[routineRows.length - 1];

    // Create new row with copied time
    const newRow = {
      subject_id: "",
      exam_date: lastRow.exam_date || "",
      start_time: lastRow.start_time || "",
      end_time: lastRow.end_time || "",
    };

    setRoutineRows([...routineRows, newRow]);
  };

  // ==================================================================
  // Delete Row
  // ==================================================================

  const deleteRow = (index) => {
    const removed = routineRows[index].subject_id;

    setRoutineRows(routineRows.filter((_, i) => i !== index));

    if (removed) {
      setSelectedSubjects((prev) => prev.filter((id) => id !== removed));
    }
  };

  // ==================================================================
  // Update Routine
  // ==================================================================

  const updateRoutine = (index, field, value) => {
    const updated = [...routineRows];

    if (field === "subject_id") {
      const oldId = updated[index].subject_id;
      const newId = Number(value);

      updated[index].subject_id = newId;
      setRoutineRows(updated);

      setSelectedSubjects((prev) => {
        let list = [...prev];

        if (oldId) list = list.filter((id) => id !== oldId);
        if (newId && !list.includes(newId)) list.push(newId);

        return list;
      });

      return;
    }

    updated[index][field] = value;
    setRoutineRows(updated);
  };

  // ==================================================================
  // Filter Subjects
  // ==================================================================

  const getFilteredSubjects = (index) =>
    subjects.filter(
      (sub) =>
        !selectedSubjects.includes(sub.id) ||
        routineRows[index].subject_id === sub.id
    );

  // ==================================================================
  // Save Routine
  // ==================================================================

  const saveRoutine = async () => { 
    for (let i = 0; i < routineRows.length; i++) {
      const r = routineRows[i];

      if (!r.subject_id || !r.exam_date || !r.start_time || !r.end_time) {
        toast.error(`Row ${i + 1}: All fields are required`);
        return;
      }
    }

    const payload = {
      exam_id: bySubjectVars.exam_name,
      class_instance_id: bySubjectVars.class_name,
      group_id: bySubjectVars.group_name_bangla,
      routines: routineRows,
      publish: publish ? 1 : 0, // 👈 FLAG ADDED
    };

    try {
      await saveFormData(createNewAccessToken, "exam-routine-create", payload);
      toast.success("Routine saved successfully!");
    } catch (err) {
      toast.error("Failed to save routine, Error: ", err);
    }
  };

  // const saveRoutine = async (isPublish = false) => {

  // for (let i = 0; i < routineRows.length; i++) {
  //   const r = routineRows[i];

  //   if (!r.subject_id || !r.exam_date || !r.start_time || !r.end_time) {
  //     toast.error(`Row ${i + 1}: All fields are required`);
  //     return;
  //   }
  // }

  //   const payload = {
  //     exam_id: bySubjectVars.exam_name,
  //     class_instance_id: bySubjectVars.class_name,
  //     group_id: bySubjectVars.group_name_bangla,
  //     routines: routineRows,
  //     publish: isPublish ? 1 : 0, // 👈 FLAG ADDED
  //   };

  //   try {
  //     await saveFormData(createNewAccessToken, "exam-routine-create", payload);
  //     toast.success("Routine saved successfully!");
  //   } catch (err) {
  //     toast.error("Failed to save routine, Error: ", err);
  //   }
  // };

  // ==================================================================
  // Confirm Routine before publish on website
  // ==================================================================
  // const confirmPublish = () => {
  //   if (window.confirm("আপনি কি নিশ্চিত? রুটিনটি ওয়েবসাইটে প্রকাশ করা হবে।")) {
  //     saveRoutine(true);
  //   }
  // };

  // ==================================================================
  // RENDER
  // ==================================================================

  if (isLoading) return <Loading_1 />;

  return (
    <div className="generate-result">
      <FormHeading heading="পরীক্ষার রুটিন তৈরির ফর্ম" groupwise="বিভাগ" />

      <form>
        <div className="field-selector-form-container">
          {/* SHIFT */}
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
                    </select>
                  </div>
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
            {/* CLASS/GROUP/EXAM */}
            <SelectFields fields={["class", "group", "exam-by-year"]} />

            {/* ROUTINE TABLE */}
            {showRoutineForm && (
              <div className="routine-form">
                <table className="routine-table">
                  <thead>
                    <tr>
                      <th>বিষয়</th>
                      <th>তারিখ</th>
                      <th>শুরুর সময়</th>
                      <th>শেষ সময়</th>
                      <th>Action</th>
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
                        deleteRow={deleteRow}
                      />
                    ))}
                  </tbody>
                </table>

                  {/* ADD ROW */}
                {/* <div className="flex between">
                  {selectedSubjects.length < subjects.length && (
                    <button
                      className="btn-add"
                      type="button"
                      onClick={addRoutineRow}
                    >
                      + আরও একটি বিষয় যোগ করুন
                    </button>
                  )}

                  <div className="mt-4 flex items-center gap-2">
                    <input
                      type="checkbox"
                      id="confirmPublish"
                      checked={publish}
                      className="w-4 h-4 accent-green-600 cursor-pointer"
                      onChange={(e) => {
                        setTogglePublishButton(!togglePublishButton);
                        if (e.target.checked) {
                          setPublish(true);
                        } else {
                          setPublish(false);
                        }
                      }}
                    />

                    <label
                      htmlFor="confirmPublish"
                      className="cursor-pointer select-none text-gray-700"
                    >
                      ওয়েবসাইটে প্রকাশ করবেন?
                    </label>
                  </div>
                </div> */}
                
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pt-4 border-t border-gray-200">
                  {/* ADD ROW BUTTON */}
                  {selectedSubjects.length < subjects.length && (
                    <button
                      className="inline-flex items-center gap-2 px-4 py-2.5 text-sm font-medium text-blue-600 bg-blue-50 hover:bg-blue-100 !rounded-lg transition-colors duration-200 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:ring-offset-1"
                      type="button"
                      onClick={addRoutineRow}
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                      </svg>
                      আরও একটি বিষয় যোগ করুন
                    </button>
                  )}

                  {/* PUBLISH TOGGLE */}
                  <div className="flex items-center gap-3 px-4 py-2.5 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors duration-200">
                    <label htmlFor="confirmPublish" className="relative inline-block w-11 h-6 cursor-pointer">
                      <input
                        type="checkbox"
                        id="confirmPublish"
                        checked={publish}
                        className="sr-only peer"
                        onChange={(e) => {
                          setTogglePublishButton(!togglePublishButton);
                          // setPublish(e.target.checked);
                        }}
                      />
                      <span className="absolute inset-0 bg-gray-300 rounded-full transition-colors duration-200 peer-checked:bg-green-600 peer-focus:ring-2 peer-focus:ring-green-500 peer-focus:ring-offset-2"></span>
                      <span className="absolute left-1 top-1 w-4 h-4 bg-white rounded-full shadow-sm transition-transform duration-200 peer-checked:translate-x-5"></span>
                    </label>
                    
                    <label
                      htmlFor="confirmPublish"
                      className="cursor-pointer select-none text-sm font-medium text-gray-700"
                    >
                      ওয়েবসাইটে প্রকাশ করবেন?
                    </label>
                  </div>
                </div>
              </div>
            )}
          </div>

          <div className="result-generator-button flex gap-3">
            {/* Normal Save */}
            <button
              type="button"
              onClick={() => saveRoutine()}
              className=" btn-save flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-medium px-4 py-2 rounded-lg transition"
            >
              <Save size={18} />
              রুটিন সংরক্ষণ করুন
            </button>

            {togglePublishButton && (
              <div className="fixed inset-0 flex items-center justify-center bg-black/40 z-50">
                <div className="bg-white p-6 rounded-xl shadow-xl w-96 animate-fadeIn">
                  <h2 className="text-xl font-bold text-gray-800 mb-3 text-center">
                    নিশ্চিতকরণ
                  </h2>

                  <p className="text-gray-700 mb-6 text-center">
                    {publish?(
                      <span>আপনি কি নিশ্চিত রুটিনটি ওয়েবসাইটে প্রকাশ করবেন না?</span>
                    ):(
                      <span>আপনি কি নিশ্চিত রুটিনটি ওয়েবসাইটে প্রকাশ করবেন।</span>
                    )}
                    
                  </p>

                  <div className="flex justify-center gap-3">
                    <button
                      className="px-4 py-2 !rounded-lg bg-gray-200 hover:bg-gray-300"
                      onClick={() => {
                        // setPublish(false);
                        setTogglePublishButton(false);
                      }}
                    >
                      না
                      {/* না এখনই প্রকাশ করবোনা */}
                    </button>

                    <button
                      className="px-4 py-2 !rounded-lg bg-green-600 text-white hover:bg-green-700"
                      onClick={() => {
                        setPublish(!publish);
                        setTogglePublishButton(false);
                      }}
                    >
                      হ্যা
                      {/* হ্যা প্রকাশ করতে চাই */}
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </form>
    </div>
  );
};

export default CreateExamRoutine;
