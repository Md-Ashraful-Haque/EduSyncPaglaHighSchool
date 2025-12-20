// IdCardComponent.jsx
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

const IdCardComponent = (StudentObj)=> {

  // console.log("==========================================");
  // console.log("StudentObj ++++++++++> ", StudentObj);
  // console.log("==========================================");
  // if (!days.length || !rows.length) {
  //   return <p className="text-center text-gray-500 py-4"> কোন তথ্য পাওয়া যায়নি। </p>;
  // }

  return (
    <h1>SectionWise</h1>
  );
}

export default IdCardComponent;
