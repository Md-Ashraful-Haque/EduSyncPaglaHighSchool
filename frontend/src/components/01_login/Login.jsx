import { useEffect, useState } from "react";
import PropTypes from "prop-types";
import { useNavigate } from "react-router-dom"; // import for navigation
import "./sass/index.scss";
import "./Login.scss";
import logo from "../../assets/images/eduSyncLogo.svg";

import DesktopLogin from "./DesktopLogin";
import MobileLogin from "./MobileLogin";

const Login = () => {
  const navigate = useNavigate();
  const [viewport, setViewport] = useState({
    height: window.innerHeight,
    isMobile: window.innerWidth <= 768,
  });

  useEffect(() => {
    const handleResize = () => {
      setViewport({
        height: window.innerHeight,
        isMobile: window.innerWidth <= 768,
      });
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return (
    <div className="login-page" style={{ height: `${viewport.height}px` }}>
      <div id="ims-login-page" style={{ "--logo-url": `url(${logo})` }}>
        {viewport.isMobile ? <MobileLogin /> : <DesktopLogin />}

        {/* Button to go to website */}
        {/* <div className="go-website-wrapper">
          <button className="go-website-button" onClick={() => navigate("/")}>
            Go to Website
          </button>
        </div> */}
      </div>

      <div className="copy-right">
        © 2019–2025 NexaSofts. All Rights Reserved.
      </div>
    </div>
  );
};

Login.propTypes = {
  onLogin: PropTypes.string.isRequired,
};

export default Login;
