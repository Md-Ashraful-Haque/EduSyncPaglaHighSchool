import { useEffect, useState } from "react";
import PropTypes from "prop-types";
import "./sass/index.scss";
import logo from "../../assets/images/eduSyncLogo.svg";

import DesktopLogin from "./DesktopLogin";
import MobileLogin from "./MobileLogin";

const Login = () => {
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

        // Cleanup the event listener on component unmount
        return () => {
        window.removeEventListener("resize", handleResize);
        };
    }, []);

    return (
        <div className="login-page" style={{ height: `${viewport.height}px` }}>
            <div id="ims-login-page" style={{ "--logo-url": `url(${logo})` }}>
                {viewport.isMobile ? <MobileLogin /> : <DesktopLogin />}
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
