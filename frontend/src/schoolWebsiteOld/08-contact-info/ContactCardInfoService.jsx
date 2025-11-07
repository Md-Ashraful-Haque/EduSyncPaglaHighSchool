import React from 'react';
import { Phone, Mail, MapPin, MessageCircle } from 'lucide-react';
import schoolLogo from "../../assets/images/penchulTransWhite.png";

const ContactCardCompInchage = () => {
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
    <div className="contact-card info-service contact-info">
      <div className="card-header">
        <h2 className="title"> তথ্য সেবা কেন্দ্রের ঠিকানা</h2>
      </div>
      
      <div className="card-body">
        <div className="profile-section">
          <div className="avatar">
            {/* <span className="initials">মা</span> */}
            <img src={schoolLogo} alt="" />
          </div>
          <div className="profile-info">
            <h3 className="name">জনাব প্রদীপ চন্দ্র</h3>
            <p className="designation">সহকারি শিক্ষক </p>
          </div>
        </div>

        <div className="contact-details">
          <div className="contact-item">
            <MapPin className="icon" size={18} />
            <span className="text">পেঁচুল উচ্চ বিদ্যালয়, শেরপুর, বগুড়া</span>
          </div>
          
          <div className="contact-item phone-item">
            <Phone className="icon" size={18} />
            <span className="text">০১৭১৬৫৯৮৯৭৮</span>
            <div className="whatsapp-badge">
              <Phone size={14} />
              <span>কল</span>
            </div>
          </div>
          
          <div className="contact-item">
            <Mail className="icon" size={18} />
            <span className="text">penchulhighschool2014@gmail.com</span>
          </div>
        </div>
      </div>
    </div>
  );
};

// SCSS Styles
const styles = `

`;

export default ContactCardCompInchage;