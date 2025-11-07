import React, { useState, useEffect } from "react";
import "./TeacherInfo.scss";
import manPlaceHolderImage from './../../assets/images/avatar-1.png'
import { Phone, MessageCircle } from "lucide-react";
import schoolLogo from "../../assets/images/avatar-1.png";
import FullScreenModal from "pageComponents/02_full_screen_window";
import TeacherDetails from "./TeacherDetails";
import ShowBangla from "LoadingComponent/showBangla/ShowBangla";

const TeacherCard = ({ teacher }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [showTeacherDetails, setShowTeacherDetails] = useState(null);

  const handleModalClose = () => {
    setIsModalOpen(false);
    setShowTeacherDetails(null);
  };

  return (
    <>
      {/* <div className="team-grid"> */}
      <div className="teacher-card">
        <div className="teacher-image">
          {teacher.picture_url ? (
            // <img src={teacher.picture_url} alt={teacher.name} />
            <img
              src={teacher.picture_url}
              alt={teacher.name}
              onError={(e) => {
                e.target.onerror = null; // prevent infinite loop in case placeholder also fails
                e.target.src = manPlaceHolderImage;
              }}
            />

          ) : (
            <img src={manPlaceHolderImage} alt={teacher.name} />
          )}
        </div>
        <div className="member-info">
          <h5 className="name">{teacher.name}</h5>
          <div className="position">
            {ShowBangla(teacher.designation_display)}{" "}
            {teacher.major_subject && `(${teacher.major_subject})`}
          </div>
          <div className="contact-item phone-item">
            <Phone className="icon" size={10} />
            <span className="text">{teacher.phone_number}</span>
          </div>
          <div
            className="contact-item phone-item details-btn"
            onClick={(e) => {
              setShowTeacherDetails(true);
              setIsModalOpen(true);
            }}
          >
            বিস্তারি
          </div>
        </div>
      </div>

      {showTeacherDetails && (
        <FullScreenModal isOpen={isModalOpen} onClose={handleModalClose}>
          <TeacherDetails
            teacher={teacher}
            showTeacherDetails={showTeacherDetails}
            setShowTeacherDetails={setShowTeacherDetails}
          />
        </FullScreenModal>
      )}
    </>
  );
};

export default TeacherCard;
