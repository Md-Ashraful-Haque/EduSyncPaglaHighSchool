import React from 'react';
import { Phone, Mail, MapPin, MessageCircle } from 'lucide-react';
import schoolLogo from "../../assets/images/penchulTransWhite.png";
import { useAppContext } from "ContextAPI/AppContext";


const ContactCard = () => {
  const {instituteInfo } = useAppContext();
  React.useEffect(() => {
    // Inject styles
    const styleId = 'contact-card-styles';
    if (!document.getElementById(styleId)) {
      const styleElement = document.createElement('style');
      styleElement.id = styleId;
      styleElement.textContent = styles;
      document.head.appendChild(styleElement);
    }
  }, []);


  return (
    <div className="contact-card contact-info">
      <div className="card-header">
        <h2 className="title">যোগাযোগের ঠিকানা</h2>
      </div>
      
      <div className="card-body">
        <div className="profile-section">
          <div className="avatar">
            {/* <span className="initials">মা</span> */}
            <img src={instituteInfo?.logo_url} alt="" />
          </div>
          <div className="profile-info">
            <h3 className="name">সেলিনা সুলতানা</h3>
            <p className="designation">প্রধান শিক্ষক </p>
          </div>
        </div>

        <div className="contact-details">
          <div className="contact-item">
            <MapPin className="icon" size={18} />
            <span className="text">{instituteInfo?.address}</span>
          </div>
          
          <div className="contact-item phone-item">
            <Phone className="icon" size={18} />
            <span className="text">{instituteInfo?.mobile_number}</span>
            <div className="whatsapp-badge">
              <MessageCircle size={14} />
              <span>হোয়াটস্যাপ</span>
            </div>
          </div>
          
          <div className="contact-item">
            <Mail className="icon" size={18} />
            <span className="text">{instituteInfo?.email}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

// SCSS Styles
const styles = `

`;

export default ContactCard;