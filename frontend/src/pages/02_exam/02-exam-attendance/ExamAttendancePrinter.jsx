// ExamAttendancePrinter.jsx
import React from "react";

import showBangla from "../../../utils/utilsFunctions/engNumberToBang";


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
const ExamAttendancePrinter = ({
  students = [],
  studentsCommonInfo = null,
  HeadSignature = null,
  instituteInfo = null,
  examRoutine = [],
}) => {
  if (!students || students.length === 0) {
    return <div>No student data</div>;
  }




  return (
    <div className="exam-attendance-wrapper">
      {students.map((student, index) => (
        <div className="exam-attendance-page" key={index}>
          {/* ===== Header ===== */}
          <div className="exam-attendance-header">
            {/* <div className="exam-attendance-logo-box">
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
            </div> */}

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

              <p className="exam-attendance-school-address">
                {instituteInfo?.address || "ঠিকানা"} 
                {instituteInfo?.website &&(
                  <div>
                    ওয়েবসাইট: <a href="www.paglahighschool.edu.bd">{instituteInfo?.website}</a>
                  </div>
                )}
              </p>

              <h2 className="exam-attendance-exam-name">
                {studentsCommonInfo?.exam_name || "পরীক্ষার নাম"}-
                {showBangla(studentsCommonInfo?.year) || "Year"} ইং
              </h2>

              <h3 className="exam-attendance-form-title">
                <span>শিক্ষার্থী হাজিরা তথ্য</span>
              </h3>
            </div>
          </div>

          {/* ===== Student Info ===== */}
          <div className="exam-attendance-student-info">
            {/* <p>
              <strong>শিক্ষার্থীর নাম:</strong> {student.name}
            </p> */}
            <div className="exam-attendance-std-details-container">
              <div className="exam-attendance-std-details">
                <span> শিক্ষার্থীর নাম: </span>
                <div className="dotted-underline">
                  {student.name}
                </div>
              </div>
            </div>

            <div className="exam-attendance-std-details-container">
              <div className="exam-attendance-std-details">
                <span> শ্রেণি: </span> {studentsCommonInfo?.class}
              </div>

              <div className="exam-attendance-std-details">
                <span> রোল:</span> { showBangla(student.roll_number)}
              </div>

              {studentsCommonInfo?.section && (
                <div className="exam-attendance-std-details">
                  <span> সেকশন:</span> {studentsCommonInfo?.section}
                </div>
              )}
              {studentsCommonInfo?.group && (
                <div className="exam-attendance-std-details">
                  {/* <span> গ্রুপ:</span> {studentsCommonInfo?.group} */}
                  <span> গ্রুপ:</span> {studentsCommonInfo?.group_name_bengali}
                </div>
              )}
              
              {studentsCommonInfo?.shift && (
                <div className="exam-attendance-std-details">
                  <span> শিফট:</span> {studentsCommonInfo?.shift}
                </div>
              )}
            </div>
          </div>

          {/* ===== Routine Table ===== */}
          <table className="exam-attendance-table">
            <thead>
              <tr>
                <th>তারিখ</th>
                <th>বার</th>
                <th>বিষয়ের নাম</th>
                {/* <th>বিষয় ও বিষয় কোড</th> */}
                <th style={{ minWidth: "150px" }}>পরীক্ষার্থীর স্বাক্ষর</th>
                <th style={{ minWidth: "150px" }}>কক্ষ প্রত্যবেক্ষকের স্বাক্ষর</th>
              </tr>
            </thead>

            <tbody>
              {examRoutine?.map((item, i) => (
                <tr key={i}>
                  <td>{showBangla(item.exam_date)}</td>
                  <td> {getBanglaDayName(item.exam_date)} </td>
                  <td>{item.subject_name}</td>
                  <td> </td>
                  <td></td>
                </tr>
              ))}
            </tbody>
          </table>

          <div className="exam-attendance-footer">
            <div className="signature-box">
              <div className="signature-line"></div>
              <div>পরীক্ষা নিয়ন্ত্রক</div>
            </div>

            <div className="signature-box">
              <div className="signature-line"></div>
              <div>প্রধান শিক্ষক</div>
            </div>
          </div>

          
          <div className="exam-attendance-page-break" />
        </div>
      ))}
    </div>
  );
};

export default ExamAttendancePrinter;
