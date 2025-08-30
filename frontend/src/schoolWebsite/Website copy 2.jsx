import { useNavigate } from "react-router-dom"; // ✅ Step 1
import PropTypes from "prop-types";
import "./website.scss";

import Header from "./01-header/Header";
import Menu from "./02-menu/Menu";
import SliderCarousel from "./03-homeSlider/HomeSlider";
import SliderHeadline from "./03-homeSlider/SliderHeadline";
import RecentBulletin from "./04-recent-bulletin/RecentBulletin";
import RecentNotice from "./recent/RecentNotice";
import HistoryOfInstitute from "./06-history-of-institute/HistoryOfInstitute";
import ManagingCommittee from "./07-managing-committee/ManagingCommittee";
import Footer from "./99-footer/Footer";
import { WebsiteContextAPIProvider } from "ContextAPI/WebsiteContext";



const Website = () => {
  const navigate = useNavigate(); // ✅ Step 2
  

  
  return (
    <WebsiteContextAPIProvider>
      {/* Optional: <Header /> */}
      <Menu />

      {/* ✅ Logout/Back-to-login button at top-right */}
      {/* <div className="text-end px-4 py-2">
        <button
          onClick={() => navigate("/")}
          className="btn btn-outline-primary"
        >
          Back to Login
        </button>
      </div> */}

      <div className="slider-container">
        <SliderHeadline />
        <SliderCarousel />
      </div>

      <RecentBulletin />
      <div className="container">
        <div className="site-container">
          <RecentNotice />
          <div className="row">
            <div className="col-sm-12 col-md-9">
              <HistoryOfInstitute />
            </div>
            <div className="col-sm-12 col-md-3">
              <ManagingCommittee />
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
