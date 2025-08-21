
import React, { useState, useEffect } from "react";
import './TeacherInfo.scss';
import { Phone, MessageCircle } from 'lucide-react';

import FullScreenModal from "pageComponents/02_full_screen_window";
import TeacherDetails from './TeacherDetails'

const TeacherCard = ({ teacher }) => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    // const [isModalOpen, setIsModalOpen] = useState(false);
    const [showTeacherDetails, setShowTeacherDetails] =  useState(null);
    
  const handleModalClose = () => {
    setIsModalOpen(false);
    setShowTeacherDetails(null);
  };

  return (
    <div>
      {/* <div className="team-grid"> */}
      <div className="teacher-card">
        <div className="teacher-image">
          {teacher.picture_url ? (
            <img src={teacher.picture_url} alt={teacher.name} />
          ) : (
            <div className="teacher-photo placeholder">No Photo</div>
          )}
        </div>
        <div className="member-info">
          <h5 className="name">{teacher.name}</h5>
          <div className="position">{teacher.designation_display}</div> 
          <div className="contact-item phone-item">
              <Phone className="icon" size={16} />
              <span className="text">{teacher.phone_number}</span>
              <div className="whatsapp-badge"> 
                <span>কল</span>
              </div>
            </div>
          <div className="contact-item phone-item details-btn" onClick={(e) => {
                    // e.preventDefault();
                    // setActiveSinglePageComponent(() => Component); // save reference safely
                    // setIsModalOpen(true);
                    // closeMenu();
                    // handleModalClose(e);
                    setShowTeacherDetails(true);
                    setIsModalOpen(true);
                  }}> 
            বিস্তারি
          </div>
        </div>
      </div>
      
      <FullScreenModal isOpen={isModalOpen} onClose={handleModalClose}>
        {showTeacherDetails &&
          // <TeacherCardMordern /> 
          <TeacherDetails teacher={teacher} /> 
        }
      </FullScreenModal>
      
    </div>
  );
};

export default TeacherCard;
