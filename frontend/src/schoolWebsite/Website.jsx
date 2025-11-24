import { useNavigate } from "react-router-dom"; // ✅ Step 1
import PropTypes from "prop-types";
import "./website.scss";

// import Header from "./01-header/Header";
import Menu from "./02-menu/Menu_new";
import SliderCarousel from "./03-homeSlider/HomeSlider";
import SliderHeadline from "./03-homeSlider/SliderHeadline";
import RecentBulletin from "./04-recent-bulletin/RecentBulletin";
import RecentNotice from "./recent/RecentNotice";
import HistoryOfInstitute from "./06-history-of-institute/HistoryOfInstitute";
import ManagingCommittee from "./07-managing-committee/ManagingCommittee";
import CardItem from "./11-link-cards/LinkCard";
import Footer from "./99-footer/Footer";
import { WebsiteContextAPIProvider } from "ContextAPI/WebsiteContext";

import React, { useEffect, useState } from "react";
import axios from "axios";
const Website = () => {
  const navigate = useNavigate(); // ✅ Step 2

  const [cards, setCard] = useState([]);

  const apiUrl = import.meta.env.VITE_API_URL; 
  useEffect(() => {
  fetch(`${apiUrl}/card-items/`)
    .then((res) => {
      if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}`);
      }
      return res.text(); // first read as text
    })
    .then((text) => {
      if (!text) {
        throw new Error("Empty response from API");
      }
      return JSON.parse(text); // safely parse JSON
    })
    .then((data) => {
      if (data.results && data.results.length > 0) {
        setCard(data.results);
        // console.log("data.results: ", data.results);
      }
    })
    .catch((err) => console.error("Failed to fetch:", err));
}, []);


  return (
    <WebsiteContextAPIProvider>
      {/* Optional:  */}
      {/* <Header /> */}
      <Menu />
      
      <div className="slider-container">
        <SliderHeadline />
        <SliderCarousel />
      </div>

      <RecentBulletin />
      
      <div className="container-fluid">
        <div className="site-container">
          <RecentNotice />

          <div className="row"> 
            
            <div className="grid grid-cols-1 sm:grid-cols-[2fr_1fr] lg:grid-cols-[3fr_1fr] gap-4">
              <div>
                <HistoryOfInstitute />

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 py-4">
                  {cards.map((card) => (
                    <div key={card.id} className="flex flex-col h-full">
                      <CardItem card={card} className="flex-1" />
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <ManagingCommittee />
              </div>
            </div>

          </div>
        </div>
      </div>

      <Footer />
    </WebsiteContextAPIProvider>
  );
};

// ❌ These props are not used right now, so this should be removed unless used:
Website.propTypes = {
  // children: PropTypes.node.isRequired,
  // handleLogout: PropTypes.node.isRequired,
};

export default Website;
