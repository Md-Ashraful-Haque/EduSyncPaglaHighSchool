// ShowDataBeforePrint.jsx
import React from "react";

import showBangla from "../../../utils/utilsFunctions/engNumberToBang";
// import { useMarksInputBySubjectContext } from "ContextAPI/MarksInputBySubjectContext";
import { formatDateDMY } from "Utils/utilsFunctions/UtilFuntions";

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

const ShowDataBeforePrint = ({ students = [], instituteInfo = null,shiftToYearInfo,date }) => {
  // const { bySubjectVars } = useMarksInputBySubjectContext();

  if (!students || students.length === 0) {
    return <div>No student data</div>;
  }

    // console.log("=+++++++++++++++++++++++++++++++++++++++++");
    // console.log("shiftToYearInfo: ", shiftToYearInfo);
    // console.log("=+++++++++++++++++++++++++++++++++++++++++");

  return (
    <div id="student-attendance-print" className="exam-attendance-wrapper">
      {/* {students.map((student, index) => ( */}
        <div className="exam-attendance-page" >
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
                    <a href={instituteInfo?.website}>
                      {instituteInfo?.website}
                    </a>
                  </div>
                )}
              </div> 
              <h3 className="exam-attendance-form-title">
                <span>শিক্ষার্থী হাজিরা শীট</span>
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
              তারিখ: {showBangla(formatDateDMY(date))}
            </div>
          </div>

          {/* ===== Routine Table ===== */}
          <table className="exam-attendance-table">
            <thead>
              <tr>
                <th>আইডি </th>
                <th>রোল</th>
                <th>নাম</th>
                {/* <th>বিষয় ও বিষয় কোড</th> */}
                <th style={{ minWidth: "150px" }}>উপস্থিতি</th>
                <th style={{ minWidth: "150px" }}>
                  মন্তব্য
                </th>
              </tr>
            </thead>

            <tbody>
              {students?.map((student, i) => (
                <tr key={i}>
                  <td style={{textAlign:"center"}} >{student.student_id}</td>
                  <td style={{textAlign:"center"}}> {student.roll_number} </td>
                  <td>{student.name}</td>
                  <td> {student.status}</td>
                  <td> {student.note}</td> 
                </tr>
              ))}
            </tbody>
          </table>

          {/* <div className="exam-attendance-footer">
            <div className="signature-box">
              <div className="signature-line"></div>
              <div>পরীক্ষা নিয়ন্ত্রক</div>
            </div>

            <div className="signature-box">
              <div className="signature-line"></div>
              <div>প্রধান শিক্ষক</div>
            </div>
          </div> */}

          <div className="exam-attendance-page-break" />
        </div>
      {/* ))} */}
    </div>
  );
};

export default ShowDataBeforePrint;
