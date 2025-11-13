
import React from 'react';

const SeatPlanPrinter = ({ 
  students = [], 
  studentsCommonInfo = null, 
  HeadSignature = null, 
  instituteInfo = null 
}) => {
  const itemPerPage = 10;
  const handlePrint = () => {
    window.print();
  };

  const SeatPlan = ({ student }) => (
    <div className="seat-plan">
      {/* Header with logo and school info */}
      <div className="seat-plan-card-header">
        <div className="seat-plan-card-school-info">
          <div className="logo-section-for-seat-plan">
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
            <p className="seat-plan-exam-info"> {studentsCommonInfo?.exam_name}</p>
            {/* <div>Seat Plan</div> */}
            {/* <p className="exam-info">{studentsCommonInfo?.exam_name}Exam: Pre-Test Exam-2025</p> */}
          </div>
        </div>

        <div className="seat-plan-badge"> 
          <span>Seat Plan</span> 
          
        </div>
      </div>

      {/* Student Details */}
      <div className="student-details"> 

        <div className="detail-row">
          <span className="label">Name of Student:</span>
          <span className="value italic">{student.name}</span>
        </div> 
        <div className="seat-plan-class-info">

          


          <div className='seat-plan-std-info'>
            {/* <span className="class-item">
              <span className="label">Shift:</span>
              <span className="value">{studentsCommonInfo?.shift }</span>
            </span>  */}

            <span className="class-item">
              <span className="label">Class:</span>
              <span className="value">{studentsCommonInfo?.class || "N/A"}</span>
            </span>

            {studentsCommonInfo?.group && studentsCommonInfo.group !== "N/A" && (
              <span className="class-item">
                <span className="label">Group:</span>
                <span className="value">{studentsCommonInfo.group}</span>
              </span>
            )}

            <span className="class-item">
              <span className="label">Section:</span>
              <span className="value">
                {studentsCommonInfo?.section || "N/A"}
              </span>
            </span>
          </div>

          <div className='seat-plan-std-roll'> 
            <div className='roll-box'>
              <div className='roll-label'>
                Roll
              </div>
              <div className='roll-value'>
                {String(student.roll_number).padStart(2, "0")}
              </div>
            </div>

          </div>



          
        </div>
      </div>

      {/* Signature Section */}
      {/* <div className="signature-section">
        <div className="signature-item">
          <div className="signature-area"></div> 
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
            {"Signature of Head Master"}
          </p>
        </div>
      </div> */}

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
        {Array.from({ length: Math.ceil(students.length / itemPerPage) }, (_, pageIndex) => (
          <div key={pageIndex} className="print-page">
            <div className="seat-plan-cards-grid">
              {students
                .slice(pageIndex * itemPerPage, (pageIndex + 1) * itemPerPage)
                .map((student) => (
                  <SeatPlan key={student.id} student={student} />
                ))}
            </div>
            {/* {pageIndex < Math.ceil(students.length / itemPerPage) - 1 && (
              <div className="page-break"></div>
            )} */}
          </div>
        ))}
      </div>

       
    </div>
  );
};

export default SeatPlanPrinter;