// BloodGroupBadge.jsx
import React from "react"; 

const BloodGroupBadge = ({ bloodGroup }) => {
  if (!bloodGroup) {
    return (
      <span className="blood-group">
        <strong>রক্তের গ্রুপ:</strong>{" "}
        <span className="blood-na">Not Provided</span>
      </span>
    );
  }

  const match = bloodGroup.match(/^([ABO]+|AB)([+-])$/i);
  let type, sign;

  if (match) {
    type = match[1].toUpperCase();
    sign = match[2];
  } else {
    // In case format is unexpected, just show the raw text
    return (
      <span className="blood-group">
        <strong>রক্তের গ্রুপ:</strong>{" "}
        <span className="blood-value">{bloodGroup}</span>
      </span>
    );
  }

  return (
    <span className="blood-group">
      <strong>রক্তের গ্রুপ:</strong>{" "}
      <span className="blood-value">
        {type}
        <sup>{sign}</sup>
      </span>
    </span>
  );
};

export default BloodGroupBadge;
