import { useEffect, useState } from "react";
import axios from "axios";
import "./ContactInfo.scss";

import ContactCard from './ContactCard'
import ContactCardInfoService from './ContactCardInfoService'
import ContactCardCompInchage from './ContactCardCompInchage'
import { useAppContext } from "ContextAPI/AppContext";


const ContactInfo = () => {
  const [info, setInfo] = useState(null);
  const {instituteInfo } = useAppContext();
  const apiUrl = import.meta.env.VITE_API_URL;

  useEffect(() => {
    console.log("Contact Info run....");
    axios.get(`${apiUrl}/contact-info/`, {
        withCredentials: true,
      })
      .then(res => setInfo(res.data))
      .catch(err => console.error(err));
  }, []);

  if (!info) return <div>Loading...</div>;

  return (
    <div className="contact-wrapper">
      <div className="top-section">

        <ContactCard/> 
        {/* <ContactCardInfoService/> */}
        {/* <ContactCardCompInchage/> */}
      </div>

      <div className="bottom-section">
        <div className="contact-form">
          <h3>নিচের ফর্মটির মাধ্যমে আমাদেরকে মেসেজ পাঠাতে পারবেন:</h3>
          <form>
            <input type="text" placeholder="আপনার নাম টাইপ করুন" required />
            <input type="text" placeholder="আপনার মোবাইল নম্বর টাইপ করুন" required />
            <textarea placeholder="এখানে আপনার বার্তাটি সংক্ষেপে  টাইপ করুন" rows="5" required />
            <button type="submit"> বার্তাটি পাঠাতে এখানে ক্লিক করুন</button>
          </form>
        </div>

        <div className="google-map">
          <iframe
            title="Google Map"
            src={`https://www.google.com/maps?q=${encodeURIComponent(info.address)}&output=embed`}
            width="100%"
            height="100%"
            style={{ border: 0 }}
            allowFullScreen=""
            loading="lazy"
          ></iframe>
        </div>
      </div>
    </div>
  );
};

export default ContactInfo;
