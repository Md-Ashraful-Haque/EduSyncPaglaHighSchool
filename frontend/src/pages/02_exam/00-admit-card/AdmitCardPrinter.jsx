
import React from 'react';

const AdmitCardPrinter = ({ 
  students = [], 
  studentsCommonInfo = null, 
  HeadSignature = null, 
  instituteInfo = null 
}) => {

  const handlePrint = () => {
    window.print();
  };

  const AdmitCard = ({ student }) => (
    <div className="admit-card">
      {/* Header with logo and school info */}
      <div className="card-header">
        <div className="card-school-info">
          <div className="logo-section-for-admit">
            {instituteInfo?.logo_url ? (
              <img
                src={instituteInfo.logo_url}
                alt="School Logo"
                className="school-logo"
                onError={(e) => {
                  e.target.style.display = "none";
                  e.target.nextSibling.style.display = "block";
                }}
              />
            ) : (
              <div className="logo-placeholder">
                <div className="logo-circle">
                  <span className="logo-text">
                    {instituteInfo?.institute_code || "PHS"}
                  </span>
                </div>
              </div>
            )}
            <div className="logo-fallback" style={{ display: "none" }}>
              <div className="logo-circle">
                <span className="logo-text">
                  {instituteInfo?.institute_code || "PHS"}
                </span>
              </div>
            </div>
          </div>
          <div className="school-details">
            <h1 className="school-name">
              {instituteInfo?.name_in_english?.toUpperCase() || " SCHOOL NAME"}
            </h1>
            <p className="exam-info">Exam: {studentsCommonInfo?.exam_name}</p>
            {/* <p className="exam-info">{studentsCommonInfo?.exam_name}Exam: Pre-Test Exam-2025</p> */}
          </div>
        </div>

        <div className="admit-badge">
          <span>ADMIT CARD</span>
        </div>
      </div>

      {/* Student Details */}
      <div className="student-details">
        {/* {studentsCommonInfo?.group && studentsCommonInfo.group !== "N/A" && (
          <span className="class-item">
            <span className="label">Roll:</span>
            {String(student.roll_number).padStart(2, "0")}
          </span>
        )} */}

        <div className="detail-row">
          <span className="label">Name of Student:</span>
          <span className="value italic">{student.name}</span>
        </div>

        <div className="detail-row">
          <span className="label">Father's Name:</span>
          <span className="value">{student.fathers_name}</span>
        </div>

        <div className="class-info">

          <span className="class-item">
            <span className="label">Roll:</span>
            {String(student.roll_number).padStart(2, "0")}
          </span>

          <span className="class-item">
            <span className="label">Section:</span>
            <span className="value">
              {studentsCommonInfo?.section || "N/A"}
            </span>
          </span>

          {studentsCommonInfo?.group && studentsCommonInfo.group !== "N/A" && (
            <span className="class-item">
              <span className="label">Group:</span>
              <span className="value">{studentsCommonInfo.group}</span>
            </span>
          )}

          <span className="class-item">
            <span className="label">Class:</span>
            <span className="value">{studentsCommonInfo?.class || "N/A"}</span>
          </span>
          
          <span className="class-item">
            <span className="label">Shift:</span>
            <span className="value">{studentsCommonInfo?.shift }</span>
          </span>


          



          

          

          {/* {(studentsCommonInfo?.group && studentsCommonInfo.group === "N/A" && studentsCommonInfo?.class.notInclude(["Nine-Voc","Ten-Voc"]) ) && ( */}
          {/* {(studentsCommonInfo?.group && studentsCommonInfo.group === "N/A" ) && ( */}
            {/* <span className="class-item">
              <span className="label">Roll:</span>
              {String(student.roll_number).padStart(2, "0")}
            </span> */}
          {/* )} */}
        </div>
      </div>

      {/* Signature Section */}
      <div className="signature-section">
        <div className="signature-item">
          <div className="signature-area"></div>
          {/* <div className="signature-line"></div> */}
          <p className="signature-label">{"Signature of Class Teacher"}</p>
        </div>

        <div className="signature-item">
          <div className="signature-area">
            {HeadSignature ? (
              <img
                src={HeadSignature}
                alt="Head Master Signature"
                className="signature-img"
                onError={(e) => {
                  e.target.style.display = "none";
                  e.target.nextSibling.style.display = "block";
                }}
              />
            ) : null}
            <div
              className="signature-line"
              style={{ display: HeadSignature ? "none" : "block" }}
            ></div>
          </div>
          <p className="signature-label">
            {/* {instituteInfo?.signature_of_head || "Signature of Head Master"} */}
            {"Signature of Head Master"}
          </p>
        </div>
      </div>

      <div className="logo-watermark">
        {instituteInfo?.logo_url ? (
          <img
            src={instituteInfo.logo_url}
            alt="School Logo"
            className="school-logo"
            onError={(e) => {
              e.target.style.display = "none";
              e.target.nextSibling.style.display = "block";
            }}
          />
        ) : null}
      </div>
    </div>
  );

  if (!students || students.length === 0) {
    return (
      <div className="no-data">
        <p>No student data available</p>
      </div>
    );
  }

  return (
    <div className="admit-card-printer">
      {/* Print Controls - Hidden when printing */}
      <div className="no-print controls-section m-10">
        <h2 className="controls-title">Admit Card Preview</h2> 
        {instituteInfo && studentsCommonInfo && (
          <p className="institute-info">
            {instituteInfo.name_in_english} - Class: {studentsCommonInfo.class} 
            {studentsCommonInfo.section && ` - Section: ${studentsCommonInfo.section}`}
            {studentsCommonInfo.group && studentsCommonInfo.group !== "N/A" && ` - Group: ${studentsCommonInfo.group}`}
          </p>
        )}
      </div>

      {/* Print Area */}
      <div className="print-area">
        {Array.from({ length: Math.ceil(students.length / 6) }, (_, pageIndex) => (
          <div key={pageIndex} className="print-page">
            <div className="cards-grid">
              {students
                .slice(pageIndex * 6, (pageIndex + 1) * 6)
                .map((student) => (
                  <AdmitCard key={student.id} student={student} />
                ))}
            </div>
            {/* {pageIndex < Math.ceil(students.length / 6) - 1 && (
              <div className="page-break"></div>
            )} */}
          </div>
        ))}
      </div>

       
    </div>
  );
};

export default AdmitCardPrinter;