// GET /api/attendance/?year=1&class_id=2&group_id=3&section_id=4&date=2025-11-25
// POST /api/attendance/
import "./Attendance.scss";

/////////////////////////////////////////////////////////////////
/////////////////////// Download section import Start/////////////////
import React from "react";
import FullScreenModal from "pageComponents/02_full_screen_window";
import ShowDataBeforePrint from "./ShowDataBeforePrint"; 
import PrintPage from "./PrintPage";
/////////////////////// Download section import End /////////////////
/////////////////////////////////////////////////////////////////


import { useMarksInputBySubjectContext } from "ContextAPI/MarksInputBySubjectContext";
import { useEffect, useState } from "react";
import axios from "axios";
import dayjs from "dayjs";
import SelectFields from "pageComponents/SelectFields";
import SelectCalendarFields from "pageComponents/SelectCalendarFields";
import { fetchData } from "FormFields";
import { saveFormData,doGetAPIcall } from "Utils/utilsFunctions/UtilFuntions";
import { useAppContext } from "ContextAPI/AppContext";
import MessagePopup from "Components/popup-message/MessagePopup";

import { areAllFieldsFilled } from "Utils/utilsFunctions/UtilFuntions";
// import FormHeading from "pageComponents/classwise-or-sectionwise/FormHeading";

const STATUS_OPTIONS = [
  { value: "present", label: "Present" },
  { value: "absent", label: "Absent" },
  { value: "late", label: "Late" },
  { value: "holiday", label: "Holiday" },
  { value: "initial", label: "Initial" },
  // { value: "half_day", label: "Half Day" },
];

function AttendancePage() {
  
  const [attendanceDayId, setAttendanceDayId] = useState(null);
  const [students, setStudents] = useState([]);
  const [shiftToYearInfo, setShiftToYearInfo] = useState([]);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [printing, setPrinting] = useState(false);
  const [selectedAllStatus, setSelectedAllStatus] = useState("");
  const [showExtraStatus, setShowExtraStatus] = useState(false);

  // const [message, setMessage] = useState("");
  const [message, setMessage] = useState({
    text: "",
    type: "" // "success" | "error" | "warning" | "info"
  });

/////////////////////////////////////////////////////////////////
/////////////////////// Download section import Start/////////////////
const [isModalOpen, setIsModalOpen] = useState(false);
const handleModalClose = () => {
  setIsModalOpen(!isModalOpen);
};
/////////////////////// Download section import End /////////////////
/////////////////////////////////////////////////////////////////


  const { bySubjectVars, updateBySubjectVars } = useMarksInputBySubjectContext();
  const { createNewAccessToken, vars, instituteInfo } = useAppContext();

  const handleChange = (event, varName) => {
    updateBySubjectVars(varName, event.target.value);
    updateBySubjectVars("class_name", "");
  };
  
  useEffect(() => {
    
    const requiredValueForAPICall = {
      instituteCode: bySubjectVars.instituteCode,
      year: bySubjectVars.year,
      class_name: bySubjectVars.class_name,
      group_name: bySubjectVars.group_name_bangla,
      section_name: bySubjectVars.section_name,
      date: bySubjectVars.date,
    };

    const canSearch = areAllFieldsFilled(requiredValueForAPICall);

    if (canSearch) {
      fetchData(
        createNewAccessToken,
        "attendance",
        requiredValueForAPICall
      ).then((data) => {
        console.log("Student info : data: ", data);
        setAttendanceDayId(data.id);
        const mapped = data.student_attendances.map((sa) => ({
          id: sa.id,
          student_id: sa.student.id,
          // student_id: sa.student.student_id,
          roll_number: sa.student.roll_number,
          name: sa.student.name,
          fathers_name: sa.student.fathers_name,
          phone_number: sa.student.phone_number,
          status: sa.status || "initial",
          entry_time: sa.entry_time || "",
          exit_time: sa.exit_time || "",
          note: sa.note || "",
        }));
        setSelectedAllStatus("");
        setStudents(mapped);
      });
    }


    ///////////////////////////////////////////////////////////
    const requiredValueForAPICallPrint = {
      instituteCode: bySubjectVars.instituteCode,
      shift: bySubjectVars.shift,
      year: bySubjectVars.year,
      class_name: bySubjectVars.class_name,
      group_name: bySubjectVars.group_name_bangla,
      section_name: bySubjectVars.section_name,
      date: bySubjectVars.date,
    };

    const canSearchPrint = areAllFieldsFilled(requiredValueForAPICallPrint);

    if (canSearchPrint) {
      doGetAPIcall(
        createNewAccessToken,
        "shift-to-section-data",
        requiredValueForAPICallPrint
      ).then((data) => { 
        setShiftToYearInfo(data);
        console.log("data: ",data);
      });
    }
    ///////////////////////////////////////////////////////////
  }, [bySubjectVars]);

  const handleStatusChange = (idx, status) => {
    setStudents((prev) =>
      prev.map((s, i) => (i === idx ? { ...s, status } : s))
    );
  };

  const handleFieldChange = (idx, field, value) => {
    setStudents((prev) =>
      prev.map((s, i) => (i === idx ? { ...s, [field]: value } : s))
    );
  };

  const setStatusForAll = (status) => {
    setStudents((prev) => prev.map((s) => ({ ...s, status })));
  };

  const handleSave = async () => {
    if (!attendanceDayId) {
      setMessage({
        text: "Load attendance first.",
        type: "success",
      });
      return;
    }
    setSaving(true);
    setMessage({
      text: "",
      type: "empty",
    });

    try {
      const payload = {
        attendance_day_id: attendanceDayId,
        students: students.map((s) => ({
          id: s.id,
          student_id: s.student_id,
          status: s.status,
          entry_time: s.entry_time || null,
          exit_time: s.exit_time || null,
          note: s.note || "",
        })),
      };
      await saveFormData(createNewAccessToken, "attendance", payload);
      setMessage({
        text: "Attendance saved successfully.",
        type: "success",
      });
    } catch (err) {
      console.error(err);

      const apiError =
        err.response?.data?.detail ||
        err.response?.data?.students?.[0]?.student_id?.[0] ||
        "Failed to save attendance data.";

      setMessage({
        text: apiError,
        type: "error",
      });

      
      // setMessage({
      //   text: err.response?.data?.detail || "Failed to save attendance data.",
      //   type: "error",
      // });
    } finally {
      setSaving(false);
    }
  };
  const printAttendance = async () => { 
    setPrinting(true);
    handleModalClose();
    setMessage({
        text:"",
        type: "empty",
      });

    try {
       
      setMessage( {
        text: "Attendance print successfully.",
        type: "success",
      } );
    } catch (err) { 
      setMessage({
        text: err.response?.data?.detail || "Failed to save attendance data.",
        type: "error",
      });
    } finally {
      setPrinting(false);
    }
  };

  return (
    <div id="daily-attendance" className="attendance-page">
      {/* <h2>শিক্ষার্থীর উপস্থিতি ফর্ম</h2> */}
      {/* <FormHeading heading="শিক্ষার্থীর উপস্থিতি ফর্ম" groupwise="বিভাগ" /> */}
      {message.text && (
        <MessagePopup message={message.text} type= {message.type} duration={3000} />
      )}

      <div className="flex flex-wrap gap-2 justify-center xl:justify-between items-center p-2">
        <div className="flex flex-wrap justify-left gap-4 py-2">
          <h2>শিক্ষার্থীর উপস্থিতি ফর্ম</h2>
        </div>

        <div className="flex flex-wrap gap-4">
          <SelectFields fields={["shift"]} />
          <SelectFields fields={["year"]} />
        </div>
      </div>

      {/* Select Criteria */}
      <div className="criteria-card" style={{ marginBottom: "20px" }}>
        <div
          className="criteria-grid"
          style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}
        >
        
          <div className="criteria-grid"> 
            <div className="field-item">
              <SelectFields fields={["class"]} />
            </div>
            <div className="field-item">
              <SelectFields fields={["group"]} />
            </div>
            <div className="field-item">
              <SelectFields fields={["section"]} />
            </div>
            <div className="field-item">
              <SelectCalendarFields />
            </div>
          </div>
        </div>
      </div>

      {/* Global Status Set */}
      {students.length > 0 && (
        <div
          className="global-status"
          style={{
            display: "flex",
            gap: "15px",
            alignItems: "center",
            marginBottom: "10px",
          }}
        >
          <span className="all-status-for-attendance"> 
            {/* সকল শিক্ষার্থীর উপস্থিতি নির্ধারণ করুন: */}
            সকল উপস্থিতি নির্ধারণ :
          </span>
          {/* <span>Set attendance for all students as:</span> */} 
          {STATUS_OPTIONS.map((opt) => (
            <label key={opt.value} style={{ cursor: "pointer" }}>
              <input
                type="radio"
                name="all_status"
                value={opt.value}
                checked={selectedAllStatus === opt.value}   // ✅ CONTROLLED
                onChange={() => {
                  setSelectedAllStatus(opt.value);          // ✅ SAVE SELECTION
                  setStatusForAll(opt.value);               // ✅ APPLY TO ALL STUDENTS
                }}
              />
              {opt.label}
            </label>
          ))}

          <button
            className="print-button-for-field-selection"
            onClick={printAttendance}
            disabled={saving}
          >
            {printing ? "Printing..." : "প্রিন্ট ভিউ দেখুন"}
          </button> 

            
        </div>
      )}

      {/* Student List */}
      {students.length > 0 && (
        <div className="student-list">
          <table border="1" cellPadding="4" cellSpacing="0" width="100%">
            <thead>
              <tr>
                {/* <th>#</th> */}
                <th>Roll</th>
                <th>Name</th>
                <th colSpan={showExtraStatus? STATUS_OPTIONS.length : 2}>
                {/* <th colSpan={STATUS_OPTIONS.length}> */}
                  Attendance
                  <button 
                    type="button"
                    onClick={() => setShowExtraStatus((prev) => !prev)}
                    className="btn btn-success mobile-status-toggle-btn"
                  >
                    {showExtraStatus ? "Hide" : "Show All"}
                  </button>

                </th>
                {/* ////////////// Fathers Name ///////////////// */}
                <th className="show-in-desktop">Fathers Name</th>
                <th>Entry Time</th>
                <th>Exit Time</th>
                <th>Note</th>
              </tr>
            </thead>
            <tbody>
              {students.map((s, idx) => (
                <tr key={s.student_id}>
                  {/* <td>{idx + 1}</td> */}
                  <td>{s.roll_number}</td>
                  <td>
                    <div className="attendance-student-name-con">
                      <div className="name"> {s.name} </div>
                      <div className="phone-number"> {s.phone_number} </div>
                    </div>
                  </td>
                  
                  {STATUS_OPTIONS.map((opt, optIndex) => {
                    const inputId = `status_${s.student_id}_${opt.value}`;

                    const isAlwaysVisible = optIndex < 2; // ✅ first 2 always visible
                    // const visibilityClass = showExtraStatus ? "status-show" : "status-hide-mobile";
                        
                        const visibilityClass =
                      isAlwaysVisible || showExtraStatus
                        ? "status-show"
                        : "status-hide-mobile";

                    return (
                      <td key={opt.value} className={` ${visibilityClass}`}>
                        <div className="status-cell">
                            <input
                              type="radio"
                              id={inputId}
                              name={`status_${s.student_id}`}
                              checked={s.status === opt.value}
                              onChange={() => handleStatusChange(idx, opt.value)}
                            />

                            <label
                              htmlFor={inputId}
                              style={{
                                fontSize: "10px",
                                cursor: "pointer",
                                marginLeft: "4px",
                              }}
                            >
                              {opt.value}
                            </label>
                        </div>
                      </td>
                    );
                  })}


                  {/* ////////////// Fathers Name ////////////////// */}
                  <td className="show-in-desktop">{s.fathers_name}</td>
                  {/* <td className="show-in-desktop">{s.fathers_name}</td> */}

                  <td>
                    <input
                      type="time"
                      value={s.entry_time}
                      onChange={(e) =>
                        handleFieldChange(idx, "entry_time", e.target.value)
                      }
                    />
                  </td>
                  <td>
                    <input
                      type="time"
                      value={s.exit_time}
                      onChange={(e) =>
                        handleFieldChange(idx, "exit_time", e.target.value)
                      }
                    />
                  </td>
                  <td>
                    <input
                      type="text"
                      value={s.note}
                      onChange={(e) =>
                        handleFieldChange(idx, "note", e.target.value)
                      }
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          <div id="attendance-btn" className="attendance-save-btn">
            {/* <div className="attendance-save-btn" style={{ marginTop: "15px", textAlign: "center" }}> */}
            <button onClick={handleSave} disabled={saving}>
              {saving ? "Saving..." : "সংরক্ষণ করুন"}
            </button>

            <button
              className="attendance-print-btn"
              onClick={printAttendance}
              disabled={saving}
            >
              {printing ? "Printing..." : "প্রিন্ট ভিউ দেখুন"}
            </button>
          </div>
          {/* ////////////////////////////////////////////////////////////////////////////////////////////////// */}
          {/* /////////////////////////////////////{ Download Section Start}//////////////////////////////////// */}
          {/* ////////////////////////////////////////////////////////////////////////////////////////////////// */}
          <div className="downloadFullResult">
            {students.length > 0 && (
              <React.Fragment>
                <FullScreenModal
                  isOpen={isModalOpen}
                  onClose={handleModalClose}
                >
                  <ShowDataBeforePrint
                    students={students}
                    instituteInfo={instituteInfo}
                    shiftToYearInfo={shiftToYearInfo}
                    date={bySubjectVars.date}
                  />

                  <div className="download-button">
                    <div className="print-button">
                      <PrintPage
                        students={students}
                        instituteInfo={instituteInfo}
                        shiftToYearInfo={shiftToYearInfo}
                        date={bySubjectVars.date}
                      />
                    </div>
                  </div>
                </FullScreenModal>
              </React.Fragment>
            )}
          </div>

          {/* ////////////////////////////////////////////////////////////////////////////////////////////////// */}
          {/* /////////////////////////////////////{ Download Section End }///////////////////////////////////// */}
          {/* ////////////////////////////////////////////////////////////////////////////////////////////////// */}
        </div>
      )}
    </div>
  );
}

export default AttendancePage;
