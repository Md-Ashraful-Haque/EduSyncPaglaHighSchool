import React from "react";

import { fetchData } from "../../utils/formFieldsData/FormFields";

import "./header.scss";
import schoolLogo from "../../assets/images/penchulTransWhite.png";

const Header = () => {
  return (
    <div className="header-section">
      <div className="site-header">
        <div className="site-logo">
          <img src={schoolLogo} alt=""  />
        </div>

        <div className="institute-info">
          <div>
            <h1> পেঁচুল হাই স্কুল </h1>
            {/* <h1>Penchul High School</h1> */}
          </div>
          <div className="address"> পেঁচুল, শেরপুর, বগুড়া </div>
          {/* <div className="address">South Pachul,Sherpur, Bogura</div> */}
          {/* <div className="estd">ESTD: 1993</div> */}
          
          
        </div>
      </div>
    </div>
  );
};

export default Header;
