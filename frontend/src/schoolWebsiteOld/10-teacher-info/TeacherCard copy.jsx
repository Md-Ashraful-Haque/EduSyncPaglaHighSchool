import React from 'react';
import './TeacherInfo.scss';

const TeacherCard = ({ teacher }) => {
  return (
    <div className="">
      {/* {teacher.picture_url ? (
        <img
          src={teacher.picture_url}
          alt={teacher.name}
          className="teacher-photo"
        />
      ) : (
        <div className="teacher-photo placeholder">No Photo</div>
      )}
      <div className="teacher-info">
        <h3 className="name">{teacher.name}</h3>
        <p className="designation">{teacher.designation_display}</p>
        <div className="details">
          <p><strong>Phone:</strong> {teacher.phone_number}</p>
          <p><strong>Email:</strong> {teacher.email}</p>
          <p><strong>Blood Group:</strong> {teacher.blood_group}</p>
          <p><strong>Qualification:</strong> {teacher.qualification}</p>
          <p><strong>DOB:</strong> {teacher.dob}</p>
          <p><strong>Joining Date:</strong> {teacher.joining_date}</p>
          <p><strong>Indexing Date:</strong> {teacher.indexing_of_mpo}</p>
          <p><strong>Index No:</strong> {teacher.index_number}</p>
        </div>
      </div> */}
      <div className='team-section'>

      
        <div className="team-grid">
          <div className="team-member">
            <div className="member-image">
              {teacher.picture_url ? (
                <img
                  src={teacher.picture_url}
                  alt={teacher.name}
                  className="teacher-photo"
                />
              ) : (
                <div className="teacher-photo placeholder">No Photo</div>
              )}
            </div>
            <div className="member-info">
              <h3 className="name">Engr. Nur Alom Siddik</h3>
              <p className="position">Chairman & Partner</p>

              <span className="education">Civil Engineer, B.Sc. (DIU)</span>
            </div>
          </div>
        </div>
      </div>

    </div>
  );
};

export default TeacherCard;
