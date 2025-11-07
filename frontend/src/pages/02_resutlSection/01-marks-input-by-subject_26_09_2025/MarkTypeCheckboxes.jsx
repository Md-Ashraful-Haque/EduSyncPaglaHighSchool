
// import React, { useState } from "react";
import './markTypeCheckboxes.scss';
import { useEffect } from "react";

const MarkTypeCheckboxes = ({ markTypes,selectedMarkTypes, setSelectedMarkTypes }) => {
  // const [selectedMarkTypes, setSelectedMarkTypes] = useState([]);

  

  const handleCheckboxChange = (id) => {
    setSelectedMarkTypes((prev) =>
      prev.includes(id)
        ? prev.filter((item) => item !== id)
        : [...prev, id]
    );
  };

  return (
    <div className="select-mark-types-container">
      {markTypes?.all_mark_types?.length > 0 ? (
        markTypes.all_mark_types.map((type) => {
          const isSelected = selectedMarkTypes.includes(type.mark_type);
          return (
            <label
              key={type.id}
              className={`input-box-and-label ${isSelected ? 'selected' : ''}`}
            >
              <input
                type="checkbox"
                value={type.mark_type}
                checked={isSelected}
                onChange={() => handleCheckboxChange(type.mark_type)}
              />
              {type.mark_type_display} ({type.max_marks} marks)
              {/* {type.mark_type} */}
            </label>
          );
        })
      ) : (
        <p>No mark types found.</p>
      )}
    </div>
  );
};

export default MarkTypeCheckboxes;
