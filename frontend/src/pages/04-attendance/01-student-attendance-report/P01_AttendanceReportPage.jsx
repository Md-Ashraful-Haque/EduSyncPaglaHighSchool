// GET /api/attendance/?year=1&class_id=2&group_id=3&section_id=4&date=2025-11-25
// POST /api/attendance/
import "./Attendance-report.scss";

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
import { saveFormData, doGetAPIcall } from "Utils/utilsFunctions/UtilFuntions";
import { useAppContext } from "ContextAPI/AppContext";
import MessagePopup from "Components/popup-message/MessagePopup";

import { areAllFieldsFilled } from "Utils/utilsFunctions/UtilFuntions";
// import FormHeading from "pageComponents/classwise-or-sectionwise/FormHeading";
import MonthAttendanceTable from "./MonthAttendanceTable"; // adjust path
const STATUS_OPTIONS = [
  { value: "present", label: "Present" },
  { value: "absent", label: "Absent" },
  { value: "late", label: "Late" },
  { value: "holiday", label: "Holiday" },
  // { value: "half_day", label: "Half Day" },
];

import {
  PlusIcon,
  AdjustmentsVerticalIcon,
  PencilIcon,
  EyeIcon,
  TrashIcon,
  PencilSquareIcon,
  CalendarIcon,
  CalendarDaysIcon,
} from "@heroicons/react/24/solid";

function AttendanceReportPage() {
  // const [attendanceDayId, setAttendanceDayId] = useState(null);
  // const [students, setStudents] = useState([]);
  const [shiftToYearInfo, setShiftToYearInfo] = useState([]);
  // const [loading, setLoading] = useState(false);
  // const [saving, setSaving] = useState(false);
  const [printing, setPrinting] = useState(false);
  const [message, setMessage] = useState("");

  const [reportType, setReportType] = useState("Month");

  const [monthDays, setMonthDays] = useState([]);
  const [monthReportRows, setMonthReportRows] = useState([]);

  /////////////////////////////////////////////////////////////////
  /////////////////////// Download section import Start/////////////////
  const [isModalOpen, setIsModalOpen] = useState(false);
  const handleModalClose = () => {
    setIsModalOpen(!isModalOpen);
  };
  /////////////////////// Download section import End /////////////////
  /////////////////////////////////////////////////////////////////

  const { bySubjectVars, updateBySubjectVars } =
    useMarksInputBySubjectContext();
  const { createNewAccessToken, vars, instituteInfo } = useAppContext();

  const handleChange = (event, varName) => {
    updateBySubjectVars(varName, event.target.value);
    updateBySubjectVars("class_name", "");
  };

  useEffect(() => { 
  
  
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

  useEffect(() => {
    // existing code ...

    // --- Month report data (basic skeleton) ---
    if (reportType === "Month" && bySubjectVars.date) {
      const baseDate = dayjs(bySubjectVars.date);
      const daysInMonth = baseDate.daysInMonth();
      const monthDates = [];

      for (let d = 1; d <= daysInMonth; d++) {
        monthDates.push(baseDate.date(d).format("YYYY-MM-DD"));
      }
      setMonthDays(monthDates);

      // TODO: call your month-report API here
      const requiredValueForMonthReport = {
        instituteCode: bySubjectVars.instituteCode,
        shift: bySubjectVars.shift,
        year: bySubjectVars.year,
        class_name: bySubjectVars.class_name,
        group_name: bySubjectVars.group_name_bangla,
        section_name: bySubjectVars.section_name,
        date: bySubjectVars.date, // any day in that month
      };

      const canSearchMonth = areAllFieldsFilled(requiredValueForMonthReport);
      // console.log("+++++++++++++++++++++++++: canSearchMonth ===> ", canSearchMonth);
      if (canSearchMonth) {
        doGetAPIcall(
          createNewAccessToken,
          "attendance/monthly", // create this endpoint in Django
          requiredValueForMonthReport
        ).then((data) => {
          // data should already be shaped like:
          // { days: [...], rows: [...] }

          setMonthDays(data.days);
          setMonthReportRows(data.rows);
        });

        // console.log("+++++++++++++++++After doGetAPIcall : ++++++++++++++++++");
        // console.log("+++++++++++++++++++++++++++++++++++");
      } else {
        setMonthDays([]);
        setMonthReportRows([]);
      }
    }
  }, [bySubjectVars, reportType]);

  // const handleStatusChange = (idx, status) => {
  //   setStudents((prev) =>
  //     prev.map((s, i) => (i === idx ? { ...s, status } : s))
  //   );
  // };

  // const handleFieldChange = (idx, field, value) => {
  //   setStudents((prev) =>
  //     prev.map((s, i) => (i === idx ? { ...s, [field]: value } : s))
  //   );
  // };

  // const setStatusForAll = (status) => {
  //   setStudents((prev) => prev.map((s) => ({ ...s, status })));
  // };

  // const handleSave = async () => {
  //   if (!attendanceDayId) {
  //     setMessage("Load attendance first.");
  //     return;
  //   }
  //   setSaving(true);
  //   setMessage("");

  //   try {
  //     const payload = {
  //       attendance_day_id: attendanceDayId,
  //       students: students.map((s) => ({
  //         id: s.id,
  //         student_id: s.student_id,
  //         status: s.status,
  //         entry_time: s.entry_time || null,
  //         exit_time: s.exit_time || null,
  //         note: s.note || "",
  //       })),
  //     };
  //     await saveFormData(createNewAccessToken, "attendance", payload);
  //     setMessage("Attendance saved successfully.");
  //   } catch (err) {
  //     console.error(err);
  //     setMessage(
  //       err.response?.data?.detail || "Failed to save attendance data."
  //     );
  //   } finally {
  //     setSaving(false);
  //   }
  // };

  const monthWiseReport = () => {
    setReportType("Month");
  };

  const yearWiseReport = () => {
    setReportType("Year");
  };

  const printAttendance = async () => {
    setPrinting(true);
    handleModalClose();
    setMessage("");

    try {
      setMessage("Attendance print successfully.");
    } catch (err) {
      setMessage(
        err.response?.data?.detail || "Failed to save attendance data."
      );
    } finally {
      setPrinting(false);
    }
  };



  return (
    <div id="daily-attendance" className="attendance-page">
      <h2>শিক্ষার্থীর উপস্থিতি রিপোর্ট</h2>
      <div className="flex flex-wrap gap-4 justify-center xl:justify-between items-center pb-3">
        <div className="flex flex-wrap justify-left gap-4 py-2">
          <SelectFields fields={["shift"]} />
          <SelectFields fields={["year"]} />
        </div>

        {/* Alternative: Elevated Button Group */}
        <div className="mt-0">
          {/* <h3 className="text-sm font-medium text-gray-600 mb-3">Elevated Style:</h3> */}
          <div className="inline-flex bg-white rounded-xl  border border-gray-100 overflow-hidden">
            <button
              // onClick={()=>{setReportType("Month")}}
              disabled={reportType == "Month"}
              onClick={monthWiseReport}
              className="group  flex items-center px-2 sm:px-3 py-2 text-sm font-medium text-gray-700 hover:text-purple-700 hover:bg-purple-100 hover:from-blue-500 hover:to-blue-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 border-r border-gray-200 "
            >
              <div className="flex items-center space-x-3">
                <div className="border border-purple-700 rounded-full p-1.5 group-hover:border-white group-hover:bg-white/20 transition-all duration-300">
                  <CalendarDaysIcon className="w-4 h-4 text-purple-700 group-hover:text-purple-700" />
                </div>
                <span className="font-semibold text-xs lg:text-sm ">
                  {" "}
                  মাস ভিত্তিক{" "}
                </span>
              </div>
            </button>

            <button
              onClick={yearWiseReport}
              disabled={reportType == "Year"}
              // onClick={()=>{setReportType("Year")}}
              className="group flex items-center px-2 sm:px-3 py-2 text-sm font-medium text-gray-700 hover:text-purple-700 hover:bg-purple-100 hover:from-blue-500 hover:to-blue-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300"
            >
              <div className="flex items-center space-x-3">
                <div className="border border-purple-700 rounded-full p-1.5 group-hover:border-white group-hover:bg-white/20 transition-all duration-300">
                  <CalendarIcon className="w-4 h-4 text-purple-700 group-hover:text-purple-700" />
                </div>
                <span className="font-semibold text-xs lg:text-sm">
                  {" "}
                  বছর ভিত্তিক{" "}
                </span>
              </div>
            </button>
          </div>
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
            <div className="field-item">
              {monthDays.length > 0 && monthReportRows.length > 0 && (
                  <button
                      className="print-button-for-field-selection"
                      onClick={printAttendance}
                      disabled={printing} 
                    >
                      {printing ? "Printing..." : "প্রিন্ট ভিউ দেখুন"}
                    </button>
                )}
            </div>
          </div>
        </div>
      </div>

      {message && (
        <MessagePopup message={message} type="success" duration={3000} />
      )}

      {/* /////////////////////////// Monthwise or Yearwise Report /////////// */}
      <React.Fragment>
        {reportType == "Month" ? (
          <div className="student-list">
            <MonthAttendanceTable days={monthDays} rows={monthReportRows} />

            {monthDays.length > 0 && monthReportRows.length > 0 && (
              <div id="attendance-btn" className="attendance-save-btn">
                <button
                  className="attendance-print-btn"
                  onClick={printAttendance}
                  disabled={printing} // ✅ correct state
                >
                  {printing ? "Printing..." : "প্রিন্ট ভিউ দেখুন"}
                </button>
              </div>
            )}

          </div>
        ) : (
          <div className="student-list text-center">
            <h5>Yearwise Report</h5>
          </div>
        )}
      </React.Fragment>

      <FullScreenModal isOpen={isModalOpen} onClose={handleModalClose}>
        <ShowDataBeforePrint
          // students={students}
          instituteInfo={instituteInfo}
          shiftToYearInfo={shiftToYearInfo}
          date={bySubjectVars.date}


          days={monthDays}
          rows={monthReportRows}
        />

        <div className="download-button">
          <div className="print-button">
            <PrintPage
              // students={students}
              instituteInfo={instituteInfo}
              shiftToYearInfo={shiftToYearInfo}
              date={bySubjectVars.date}

              monthDays={monthDays}
              monthReportRows={monthReportRows}
            />
          </div>
        </div>
      </FullScreenModal>
    </div>
  );
}

export default AttendanceReportPage;
