// ShowDataBeforePrint.jsx
import React from "react";

import showBangla from "../../../utils/utilsFunctions/engNumberToBang";
// import { useMarksInputBySubjectContext } from "ContextAPI/MarksInputBySubjectContext";
import { formatDateDMY } from "Utils/utilsFunctions/UtilFuntions";
import MonthAttendanceTable from "./MonthAttendanceTable";
function getBanglaDayName(dateString) {
  const date = new Date(dateString);
  const dayIndex = date.getDay(); // 0 = Sunday ... 6 = Saturday

  const banglaDays = {
    0: "রবিবার",
    1: "সোমবার",
    2: "মঙ্গলবার",
    3: "বুধবার",
    4: "বৃহস্পতিবার",
    5: "শুক্রবার",
    6: "শনিবার",
  };

  return banglaDays[dayIndex] || "";
}

const ShowDataBeforePrint = ({ instituteInfo ,shiftToYearInfo, date, days , rows }) => {
  // const { bySubjectVars } = useMarksInputBySubjectContext();
  // console.log("++++++++++++++++++++++++++++++++++++++++++++++++");
  // console.log("===================================> ",instituteInfo ,shiftToYearInfo, date, days , rows);
  // console.log("++++++++++++++++++++++++++++++++++++++++++++++++");
  if (!days || rows.length === 0) {
    return <div>No student data</div>;
  }

    // console.log("=+++++++++++++++++++++++++++++++++++++++++");
    // console.log("shiftToYearInfo: ", shiftToYearInfo);
    // console.log("=+++++++++++++++++++++++++++++++++++++++++");

  return (
    <div id="student-attendance-print" className="exam-attendance-wrapper">
      {/* {students.map((student, index) => ( */}
      {/* <div className="exam-attendance-page" > */}
      {/* ===== Header ===== */}
      <div className="exam-attendance-header">
        <div className="exam-attendance-school-info">
          <div className="exam-attendance-school-name-logo">
            <h1 className="exam-attendance-school-name">
              <div className="exam-attendance-logo-box">
                {instituteInfo?.logo_url ? (
                  <img
                    src={instituteInfo.logo_url}
                    alt="School Logo"
                    className="exam-attendance-logo"
                  />
                ) : (
                  <div className="exam-attendance-logo-placeholder">
                    {instituteInfo?.institute_code || "LOGO"}
                  </div>
                )}
              </div>
              {instituteInfo?.name || "স্কুলের নাম"}
            </h1>
          </div>

          <div className="exam-attendance-school-address">
            {instituteInfo?.address || "ঠিকানা"}
            {instituteInfo?.website && (
              <div>
                ওয়েবসাইট:{" "}
                <a href={instituteInfo?.website}>{instituteInfo?.website}</a>
              </div>
            )}
          </div>
          <h3 className="exam-attendance-form-title">
            <span> মাস ভিত্তিক উপস্থিতি শীট </span>
          </h3>
        </div>
      </div>

      {/* ===== Student Info ===== */}
      <div className="exam-attendance-student-info student-attendance">
        <div className="exam-attendance-std-details-container">
          <div className="exam-attendance-std-details">
            <span> শ্রেণি: </span> {shiftToYearInfo?.class.class_name}
          </div>

          {shiftToYearInfo?.section.section_name && (
            <div className="exam-attendance-std-details">
              <span> সেকশন:</span> {shiftToYearInfo?.section.section_name}
            </div>
          )}

          {shiftToYearInfo?.group.group_name_bangla && (
            <div className="exam-attendance-std-details">
              <span> গ্রুপ:</span> {shiftToYearInfo?.group.group_name_bangla}
            </div>
          )}

          {shiftToYearInfo?.shift_name_bangla && (
            <div className="exam-attendance-std-details">
              <span> শিফট:</span> {shiftToYearInfo?.shift_name_bangla}
            </div>
          )}
        </div>

        <div className="day-attendance-date"> 
          <strong>মাস :</strong>  {" "}  
          {new Date(date).toLocaleString("bn-BD", {
            month: "long",
          })}
        </div>
      </div>

      {/* ===== Routine Table ===== */}
      <MonthAttendanceTable days={days} rows={rows} />

      <div className="exam-attendance-page-break" />
      {/* </div> */}
      {/* ))} */}
    </div>
  );
};

export default ShowDataBeforePrint;
