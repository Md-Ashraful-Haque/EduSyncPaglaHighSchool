// GET /api/attendance/?year=1&class_id=2&group_id=3&section_id=4&date=2025-11-25
// POST /api/attendance/
import "./student-id-card.scss";

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
import { useAppContext } from "ContextAPI/AppContext";
import MessagePopup from "Components/popup-message/MessagePopup";
import { doGetAPIcall } from "Utils/utilsFunctions/UtilFuntions";
import { areAllFieldsFilled } from "Utils/utilsFunctions/UtilFuntions";
// import FormHeading from "pageComponents/classwise-or-sectionwise/FormHeading";
// import MonthAttendanceTable from "./MonthAttendanceTable"; // adjust path
// import IdCardComponent from "./IdCardComponent"; // adjust path


import StudentsTable from "./StudentsTable";
import StudentTableCell from "../01-show-all-students/StudentTableCell";

const columns = [
  {
    key: "roll_number",
    label: "রোল",
    align: "center",
    render: (s) => (
      <div className="w-8 h-8 flex items-center justify-center bg-blue-100 rounded-full text-sm text-blue-700">
        {s.roll_number}
      </div>
    ),
  },
  {
    key: "name",
    label: "নাম",
    minWidth: "200px",
    render: (s) => <StudentTableCell student={s} />,
  },
  // {
  //   key: "class_name",
  //   label: "শ্রেণি",
  //   render: (s) => (
  //     <span className="px-2 py-1 rounded-full text-xs bg-emerald-100 text-emerald-700">
  //       {s.class_name}
  //     </span>
  //   ),
  // },
  // {
  //   key: "section_name_display",
  //   label: "শাখা",
  // },
  {
    key: "fathers_name",
    label: "পিতার নাম",
  },
  {
    key: "phone_number",
    label: "মোবাইল",
  },
  {
    key: "student_id",
    label: "শিক্ষার্থীর আইডি",
    render: (s) => (
      <span className="font-mono text-xs bg-gray-100 px-2 py-1 rounded">
        {s.student_id}
      </span>
    ),
  },
];



import {
  PlusIcon,
  AdjustmentsVerticalIcon,
  PencilIcon,
  EyeIcon,
  TrashIcon,
  PencilSquareIcon,
  UserGroupIcon,
  UserIcon,
  CalendarIcon,
  CalendarDaysIcon,
} from "@heroicons/react/24/solid";
import StudentsListWithSearch from "../01-show-all-students/StudentsListWithSearch";

const StudentIDCard = () => {
  // const [attendanceDayId, setAttendanceDayId] = useState(null);
  // const [students, setStudents] = useState([]);
  const [shiftToYearInfo, setShiftToYearInfo] = useState([]);
  // const [loading, setLoading] = useState(false);
  // const [saving, setSaving] = useState(false);
  const [printing, setPrinting] = useState(false);
  const [message, setMessage] = useState("");

  const [reportType, setReportType] = useState("SectionWise");

  const [monthDays, setMonthDays] = useState([]);
  const [monthReportRows, setMonthReportRows] = useState([]);
  const [students, setStudents] = useState([]);
  const [singleStudents, setSingleStudents] = useState([]);

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

      institute_code: bySubjectVars.instituteCode,
      shift: bySubjectVars.shift,
      year: bySubjectVars.year,
      class_id: bySubjectVars.class_name,
      group_id: bySubjectVars.group_name_bangla,
      section_id: bySubjectVars.section_name,
      // paginate: true,
      paginate: false,

    };

    const canSearchPrint = areAllFieldsFilled(requiredValueForAPICallPrint);

    if (canSearchPrint) {
      doGetAPIcall(
        createNewAccessToken,
        "shift-to-section-data",
        requiredValueForAPICallPrint
      ).then((data) => {
        setShiftToYearInfo(data);
        console.log("shift-to-section-data: ", data);
      });

      // doGetAPIcall(
      //   createNewAccessToken,
      //   "students",
      //   requiredValueForAPICallPrint
      // ).then((data) => {
      //   // setShiftToYearInfo(data);
      //   setStudents(data);
      //   console.log("all-students: ", data);
      // });

      // doGetAPIcall(
      //   createNewAccessToken,
      //   "students/details",
      //   requiredValueForAPICallPrint
      // ).then((data) => {
      //   // setShiftToYearInfo(data);
      //   setStudents(data);
      //   console.log("all-students: ", data);
      // });
    }

    ///////////////////////////////////////////////////////////
  }, [bySubjectVars]);

  useEffect(() => {
    // existing code ...
    const requiredValueForAPICallPrint = {
      institute_code: bySubjectVars.instituteCode,
      shift: bySubjectVars.shift,
      year: bySubjectVars.year,
      class_id: bySubjectVars.class_name,
      group_id: bySubjectVars.group_name_bangla,
      section_id: bySubjectVars.section_name,
      // paginate: true,
      paginate: false,
    };
    const canSearchPrint = areAllFieldsFilled(requiredValueForAPICallPrint);

    // --- SectionWise report data (basic skeleton) ---
    if (canSearchPrint) {
      if (reportType === "SectionWise") {
        ///////////////////////////////////////////////////////////
        doGetAPIcall(
          createNewAccessToken,
          "students",
          requiredValueForAPICallPrint
        ).then((data) => {
          // setShiftToYearInfo(data);
          setStudents(data);
          console.log("all-students: ", data);
        });
      } else {
        // doGetAPIcall(
        //   createNewAccessToken,
        //   "students/details",
        //   requiredValueForAPICallPrint
        // ).then((data) => {
        //   // setShiftToYearInfo(data);
        //   setSingleStudents(data);
        //   console.log("Single Student: ", data);
        // });

        doGetAPIcall(
          createNewAccessToken,
          "students",
          requiredValueForAPICallPrint
        ).then((data) => {
          // setShiftToYearInfo(data);
          setStudents(data);
          console.log("all-students: ", data);
        });
      }
    }

  }, [bySubjectVars, reportType]);

  const monthWiseReport = () => {
    setReportType("SectionWise");
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
      <h2>শিক্ষার্থীর আইডি কার্ড প্রিন্ট </h2>
      <div className="flex flex-wrap gap-4 justify-center xl:justify-between items-center pb-3">
        <div className="flex flex-wrap justify-left gap-4 py-2">
          <SelectFields fields={["shift"]} />
          <SelectFields fields={["year"]} />
        </div>

        {/* Alternative: Elevated Button Group */}
        <div className="mt-0"> 
          <div className="inline-flex bg-white rounded-xl  border border-gray-100 overflow-hidden">
            <button 
              disabled={reportType == "SectionWise"}
              onClick={monthWiseReport}
              className="group  flex items-center px-2 sm:px-3 py-2 text-sm font-medium text-gray-700 hover:text-purple-700 hover:bg-purple-100 hover:from-blue-500 hover:to-blue-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 border-r border-gray-200 "
            >
              <div className="flex items-center space-x-3">
                <div className="border border-purple-700 rounded-full p-1.5 group-hover:border-white group-hover:bg-white/20 transition-all duration-300">
                  <UserGroupIcon className="w-4 h-4 text-purple-700 group-hover:text-purple-700" />
                </div>
                <span className="font-semibold text-xs lg:text-sm "> 
                  শাখা ভিত্তিক 
                </span>
              </div>
            </button>

            <button
              onClick={yearWiseReport}
              disabled={reportType == "Year"} 
              className="group flex items-center px-2 sm:px-3 py-2 text-sm font-medium text-gray-700 hover:text-purple-700 hover:bg-purple-100 hover:from-blue-500 hover:to-blue-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300"
            >
              <div className="flex items-center space-x-3">
                <div className="border border-purple-700 rounded-full p-1.5 group-hover:border-white group-hover:bg-white/20 transition-all duration-300">
                  <UserIcon className="w-4 h-4 text-purple-700 group-hover:text-purple-700" />
                </div>
                <span className="pr-2 font-semibold text-xs lg:text-sm"> 
                  একক কার্ড
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
            {/* <div className="field-item">
              <SelectCalendarFields />
            </div> */}
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
        {reportType == "SectionWise" ? (

          students.length>0 &&(
            <div className="student-list">
              {/* <MonthAttendanceTable days={monthDays} rows={monthReportRows} /> */}
              {/* <IdCardComponent StudentObj={{}} /> */}

              
                {/* <StudentsListWithSearch
                  students={students}
                  setStudentList={setStudents}
                  itemPerPage={200}
                  // handleItemPerPageChange={handleItemPerPageChange}
                />  */}

                <StudentsTable
                  students={students}
                  columns={columns}
                  // setStudentList={setStudentList}
                  searchableKeys={[
                    "name",
                    "name_bangla",
                    "roll_number",
                    "student_id",
                    "phone_number",
                  ]}
                />



              {students.length > 0 && (
                <div id="attendance-btn" className="attendance-save-btn">
                  <button
                    className="attendance-print-btn"
                    onClick={printAttendance}
                    disabled={printing} 
                  >
                    {printing ? "Printing..." : "প্রিন্ট ভিউ দেখুন"}
                  </button>
                </div>
              )}

            </div>
            )
        ) : (
          <div className="student-list">
            <StudentsTable
              students={students}
              columns={columns}
              // setStudentList={setStudentList}
              searchableKeys={[
                "name",
                "name_bangla",
                "roll_number",
                "student_id",
                "phone_number",
              ]}
            />
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

export default StudentIDCard;
