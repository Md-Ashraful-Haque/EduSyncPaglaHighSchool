// MonthAttendanceTable.jsx
import React from "react";

const statusToIcon = (status) => {
  if (!status) return null;

  switch (status) {
    case "present":
      return <span className="cell-icon cell-icon--present">✔</span>;
    case "absent":
      return <span className="cell-icon cell-icon--absent">x</span>;
    case "late":
      return <span className="cell-icon cell-icon--late">L</span>;
      // return <span className="cell-icon cell-icon--late">●</span>;
    case "holiday":
      return <span className="cell-icon cell-icon--holiday">H</span>;
    case "initial":
      return <span className="cell-icon cell-icon--holiday">-</span>;
    default:
      return null;
  }
};

function MonthAttendanceTable({ days, rows }) {

  // console.log("==========================================");
  // console.log("++++++++++> ", days, rows);
  // console.log("==========================================");
  if (!days.length || !rows.length) {
    return <p className="text-center text-gray-500 py-4"> কোন তথ্য পাওয়া যায়নি। </p>;
  }

  return (
    <div id="month-attendance-wrapper-id">

      <div  className="month-attendance-wrapper">
        <div className="month-attendance-scroll">
          <table className="month-attendance-table">
            <thead>
              <tr>
                {/* <th className="sticky-col">Roll</th>
                <th className="sticky-col">Student Name</th>  */}
                <th className="sticky-col sticky-roll col-heading">Roll</th>
                <th className="sticky-col sticky-name col-heading ">Student Name</th>

                {/* {days.map((d) => (
                  <th key={d} className="day-col">
                    {new Date(d).getDate()} 
                    {d}
                  </th>
                    
                ))} */}
                {/* {days.map((d) => {
                  const dateObj = new Date(d);

                  const dayNumber = dateObj.getDate(); // 10
                  const dayName = dateObj.toLocaleString("en-US", { weekday: "short" }); 
                  // use "long" for full name

                  return (
                    <th key={d} className="day-col">
                      {dayNumber} <br />
                      <span style={{fontSize:"8px", borderTop: "1px solid white"}}>{dayName}</span> 
                    </th>
                  );
                })} */}

                {days.map((d) => {
                  const dateObj = new Date(d);
                  const dayNumber = dateObj.getDate();
                  const dayName = dateObj.toLocaleString("en-US", { weekday: "short" }); // Fri

                  return (
                    <th key={d} className="day-col p-0">
                      <div className="flex flex-col text-center">
                        <div className="py-1 border-bottom border-gray-300 text-[10px] font-bold">
                          {dayName}
                        </div>
                        <div className="font-bold"> 
                          {dayNumber}
                        </div>
                      </div>
                    </th>
                  );
                })}



                <th className="summary-col col-heading">Present</th>
                <th className="summary-col col-heading">Total Days</th>
                <th className="summary-col col-heading">Attendance %</th>
              </tr>
            </thead>

            <tbody>
              {rows.map((row) => (
                <tr key={row.student_id}> 
                  <td className="sticky-col sticky-roll">{row.roll_number}</td>
                  <td className="sticky-col sticky-name">{row.name}</td>

                  {days.map((d) => (
                    <td key={d} className="day-cell">
                      {statusToIcon(row.daily[d])}
                    </td>
                  ))}

                  <td className="summary-col">{row.present}</td>
                  <td className="summary-col">{row.total_days}</td>
                  <td className="summary-col">
                    <div className="percent-cell">
                      <div className="percent-bar">
                        <div
                          className="percent-bar-fill"
                          style={{ width: `${row.attendance_percent || 0}%` }}
                        />
                      </div>
                      <span className="percent-label">
                        {row.attendance_percent || 0}%
                      </span>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
}

export default MonthAttendanceTable;
