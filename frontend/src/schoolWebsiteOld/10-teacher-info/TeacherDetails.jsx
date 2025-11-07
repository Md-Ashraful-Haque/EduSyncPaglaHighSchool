import React from "react";
import manPlaceHolderImage from "./../../assets/images/avatar-1.png";
import {
  User,
  Phone,
  Mail,
  Calendar,
  GraduationCap,
  Droplet,
  Hash,
  X,
} from "lucide-react";
import "./TeacherDetails.scss";
import ShowBangla from "LoadingComponent/showBangla/ShowBangla";
import BloodGroupBadge from "./BloodGroupBadge";
const TeacherDetails = ({
  teacher,
  showTeacherDetails,
  setShowTeacherDetails,
}) => {
  // Format date helper function
  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    return date.toLocaleDateString("bn-BD", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  // Calculate age from date of birth
  const calculateAge = (dob) => {
    if (!dob) return null;
    const today = new Date();
    const birthDate = new Date(dob);
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    if (
      monthDiff < 0 ||
      (monthDiff === 0 && today.getDate() < birthDate.getDate())
    ) {
      age--;
    }
    return age;
  };

  const age = calculateAge(teacher.dob);

  return (
    <div className="teacher-card-details bg-gradient-to-br from-green-50 via-green-25 to-transparent">
      <div className="card-header">
        <div className="photo-container">
          {teacher.picture_url ? (
            <img
              src={teacher.picture_url}
              alt={teacher.name}
              onError={(e) => {
                e.target.onerror = null; // prevent infinite loop in case placeholder also fails
                e.target.src = manPlaceHolderImage;
              }}
            />
          ) : (
            <div className="no-photo">
              <User size={40} />
              <span>No Photo</span>
            </div>
          )}
        </div>
        <div className="teacher-info">
          <h3 className="teacher-name gradient-color-blue">{teacher.name}</h3>
          <div className="name-and-designation">
            <div className="index-badge">
              {ShowBangla(teacher.designation_display)}
            </div>
            {/* <div className="designation">{teacher.designation_display}</div> */}
            {/* <div className="index-badge">Index: {teacher.index_number}</div> */}
          </div>
        </div>
      </div>

      <div className="card-body">
        <div className="info-grid">
          {/* Contact Information */}
          <div className="info-section">
            <h4 className="section-title">যোগাযোগ</h4>
            <div className="info-item">
              <Phone size={16} />
              <span>{teacher.phone_number || "N/A"}</span>
            </div>
            {teacher.email && (
              <div className="info-item">
                <Mail size={16} />
                <span>{teacher.email}</span>
              </div>
            )}
          </div>

          {/* Personal Information */}
          {(teacher.dob || teacher.blood_group ) && (
          <div className="info-section">
            <h4 className="section-title">ব্যক্তিগত তথ্য</h4>
            {teacher.dob && (
              <div className="info-item">
                <Calendar size={16} />

                <div className="date-info">
                  <span className="label">জন্ম তারিখ:</span>
                  <span>{formatDate(teacher.dob)}</span>
                  {age && <span className="age">({age} বছর)</span>}
                </div>
              </div>
            )}
            {teacher.blood_group && (
              <div className="info-item">
                <Droplet size={16} />
                <BloodGroupBadge bloodGroup={teacher.blood_group} />
              </div>
            )}
          </div>
          )}

          {/* Professional Information */}
          {(teacher.joining_date || teacher.indexing_of_mpo || teacher.index_number) && (
            <div className="info-section">
              <h4 className="section-title">চাকরির তথ্য</h4>
              {teacher.joining_date && (
                <div className="info-item">
                  <Calendar size={16} />
                  <div className="date-info">
                    <span className="label">যোগদানের তারিখ:</span>
                    <span>{formatDate(teacher.joining_date)}</span>
                  </div>
                </div>
              )}

              {teacher.indexing_of_mpo && (
                <div className="info-item">
                  <Hash size={16} />
                  <div className="date-info">
                    <span className="label">এমপিও ভুক্তির তারিখ:</span>
                    <span>{formatDate(teacher.indexing_of_mpo)}</span>
                  </div>
                </div>
              )}
              {teacher.index_number && (
                <div className="info-item">
                  <Hash size={16} />
                  <div className="date-info">
                    <span className="label">এমপিও ইনডেক্স:</span>
                    <span className="index-badge">{teacher.index_number}</span>
                  </div>
                </div>
              )}
            </div>
          )}
          {/* Educational Qualification */}
          {teacher.qualification && (
            <div className="info-section qualification-section">
              <h4 className="section-title">
                <GraduationCap size={16} />
                শিক্ষাগত যোগ্যতা
              </h4>
              <div className="qualification-text">{teacher.qualification}</div>
            </div>
          )}
        </div>
      </div>

      {/* <div className="teacher-details-button">
        <button
          onClick={() => {
            setShowTeacherDetails(!showTeacherDetails);
          }}
          className={`inline-flex items-center justify-center w-12 h-12 !rounded-full bg-gray-100 hover:bg-gray-200 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 `}
          aria-label="Close"
        >
          <X size={16} className="text-gray-600" />
        </button>
      </div> */}
    </div>
  );
};

export default TeacherDetails;
