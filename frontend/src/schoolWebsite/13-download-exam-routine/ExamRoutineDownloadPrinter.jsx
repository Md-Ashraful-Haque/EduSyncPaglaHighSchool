// ExamRoutineDownloadPrinter.jsx
import React from "react";

import showBangla from "Utils/utilsFunctions/engNumberToBang";
import formatTime12h from "Utils/utilsFunctions/UtilFuntions";


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
const ExamRoutineDownloadPrinter = ({
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
    <div className="exam-routine-download-wrapper">
      <div className="exam-routine-download-page" >
          {/* ===== Header ===== */}
          <div className="exam-routine-download-header"> 
            <div className="exam-routine-download-school-info">
              <div className="exam-routine-download-school-name-logo">
                <h1 className="exam-routine-download-school-name">
                  <div className="exam-routine-download-logo-box">
                    {instituteInfo?.logo_url ? (
                      <img
                        src={instituteInfo.logo_url}
                        alt="School Logo"
                        className="exam-routine-download-logo"
                      />
                    ) : (
                      <div className="exam-routine-download-logo-placeholder">
                        {instituteInfo?.institute_code || "LOGO"}
                      </div>
                    )}
                  </div>
                  {instituteInfo?.name || "স্কুলের নাম"}
                </h1>
              </div>

              <p className="exam-routine-download-school-address">
                {instituteInfo?.address || "ঠিকানা"} <br />
                {instituteInfo?.website &&(
                  <div>
                    ওয়েবসাইট: <a href="www.paglahighschool.edu.bd">{instituteInfo?.website}</a>
                  </div>
                )}
              </p>

              <h2 className="exam-routine-download-exam-name">
                {studentsCommonInfo?.exam_name || "পরীক্ষার নাম"}-
                {showBangla(studentsCommonInfo?.year) || "Year"} ইং
              </h2>

              <h3 className="exam-routine-download-form-title">
                <span>পরীক্ষার রুটিন</span>
              </h3>
            </div>
          </div>

          {/* ===== Student Info ===== */}
          <div className="exam-routine-download-student-info"> 
            {/* <div className="exam-routine-download-std-details-container">
              <div className="exam-routine-download-std-details">
                <span> শিক্ষার্থীর নাম: </span>
                <div className="dotted-underline">
                  Name
                </div>
              </div>
            </div> */}

            <div className="exam-routine-download-std-details-container">
              <div className="exam-routine-download-std-details">
                <span> শ্রেণি: </span> {studentsCommonInfo?.class}
              </div> 

              {studentsCommonInfo?.section && (
                <div className="exam-routine-download-std-details">
                  <span> সেকশন:</span> {studentsCommonInfo?.section}
                </div>
              )}
              {studentsCommonInfo?.group && (
                <div className="exam-routine-download-std-details"> 
                  <span> গ্রুপ:</span> {studentsCommonInfo?.group_name_bengali}
                </div>
              )}
              
              {studentsCommonInfo?.shift && (
                <div className="exam-routine-download-std-details">
                  <span> শিফট:</span> {studentsCommonInfo?.shift}
                </div>
              )}
            </div>
          </div>

          {/* ===== Routine Table ===== */}
          <table className="exam-routine-download-table">
            <thead>
              <tr>
                <th>তারিখ</th>
                <th>বার</th>
                <th>বিষয়ের নাম</th>
                {/* <th>বিষয় ও বিষয় কোড</th> */}
                <th >শুরুর সময়</th>
                <th >শেষের সময়</th>
              </tr>
            </thead>

            <tbody>
              {examRoutine?.map((item, i) => (
                <tr key={i}>
                  <td style={{textAlign:"center"}} >{showBangla(item.exam_date)}</td>
                  <td style={{textAlign:"center"}} > {getBanglaDayName(item.exam_date)} </td>
                  <td >{item.subject_name}</td>
                  <td style={{textAlign:"center"}} > {showBangla(formatTime12h(item.start_time))} </td>
                  <td style={{textAlign:"center"}} > {showBangla(formatTime12h(item.end_time))} </td>
                  {/* <td style={{textAlign:"center"}} >{showBangla(item.end_time)}</td> */}
                </tr>
              ))}
            </tbody>
          </table>

          {/* <div className="exam-routine-download-footer">
            <div className="signature-box">
              <div className="signature-line"></div>
              <div>পরীক্ষা নিয়ন্ত্রক</div>
            </div>

            <div className="signature-box">
              <div className="signature-line"></div>
              <div>প্রধান শিক্ষক</div>
            </div>
          </div> */}

          
          <div className="exam-routine-download-page-break" />
        </div>
    </div>
  );
};

export default ExamRoutineDownloadPrinter;
