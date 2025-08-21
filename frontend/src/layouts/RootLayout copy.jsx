// import { useState } from "react";
import PropTypes from "prop-types";
// import { useAppContext } from './ContextAPI/AppContext';

import Sidebar from "../components/sidebar/Sidebar";
import MainHeader from "../components/mainHeader/MainHeader";
import MainWrap from "../components/MainWrap";



const RootLayout = ( ) => {
    // // State to track whether the sidebar is hidden
    // const [isSidebarHidden, setIsSidebarHidden] = useState(false);
    
    // // Toggle sidebar visibility
    // const toggleSidebar = () => {
    //     setIsSidebarHidden((prevState) => !prevState);
    // };

    return (
        <div className="layout " style={{ fontFamily: "Open Sans" }}>
            {/* <MainHeader toggleSidebar={toggleSidebar} />
            <Sidebar isSidebarHidden={isSidebarHidden} toggleSidebar={toggleSidebar} />
            <MainWrap isSidebarHidden={isSidebarHidden} />
             */}
            

            <MainHeader />
            <Sidebar />
            <MainWrap />
        </div>
    );
};

// Define propTypes for the component
RootLayout.propTypes = {
    children: PropTypes.node.isRequired,
    handleLogout: PropTypes.node.isRequired,
};

export default RootLayout;
