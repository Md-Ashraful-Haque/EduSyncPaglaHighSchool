// import React from 'react';
import PropTypes from 'prop-types';
const SelectedValues = ({ formData }) => {
  return (
    <div className="selected-values">
      <h3>Selected Information</h3>
      <p><strong>Year:</strong> {formData.year}</p>
      <p><strong>Class:</strong> {formData.class}</p>
      <p><strong>Shift:</strong> {formData.shift}</p>
      <p><strong>Exam:</strong> {formData.exam}</p>
      <p><strong>Group:</strong> {formData.group}</p>
      <p><strong>Section:</strong> {formData.section}</p>

      {/* Show Dynamic Fields for Class Nine if applicable */}
      {formData.class === 'Nine' && (
        <>
          <p><strong>Elective Subject:</strong> {formData.electiveSubject}</p>
          <p><strong>Preferred Medium:</strong> {formData.medium}</p>
        </>
      )}
    </div>
  );
};

// Define propTypes for the component
SelectedValues.propTypes = {
  formData: PropTypes.node.isRequired,
};

export default SelectedValues;
