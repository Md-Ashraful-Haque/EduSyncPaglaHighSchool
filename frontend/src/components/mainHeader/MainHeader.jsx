import { PropTypes } from "prop-types";
import FullScreenToggle from "../FullScreen";

import logo from "../../assets/04-section/01-dashboard/assets/img/eduSyncLogo.svg";
import {AdminName} from './adminName/99_index'

import { useAppContext } from '../../ContextAPI/AppContext';
import { useNavigate } from "react-router-dom"; 



const MainHeader = ( ) => {
// const MainHeader = ({ toggleSidebar }) => {

    const navigate = useNavigate();
    const { toggleSidebar,  instituteInfo } = useAppContext();

  return (
    <>
    <div className="main-header">
      {/* <button
          className="pl-8"
          type="none"
          onClick={() => navigate("/")}
      >
        Site
      </button> */}
      <a href="/admin">
        <div className="logo-section">
          <div className="logo">
            <img src={logo} alt="" />
          </div>
          <div className="name">EduSync</div>
        </div>
      </a>
      <div className="menu-container">
        <div className="menu-left">
          <div
            id="toggle-sidebar"
            className="nav-control"
            onClick={toggleSidebar}
          >
            <div className="hamburger ">
              <span className="line"></span>
              <span className="line"></span>
              <span className="line"></span>
            </div>
          </div>

          <div className="sm-breadcrumb">
            <h4>{instituteInfo?.name}</h4>
            {/* <h4>Pagla High School</h4> */}
          </div>
        </div>
        <div className="menu-right">
          <div className="menu">
            <div className="menu-item">
              
            </div>
            
            <FullScreenToggle />

            <AdminName />

          </div>
        </div>
      </div>
    </div>

    <div className="main-header-for-mobile"> 
      <div className="menu-container">
        <div className="menu-left">
          <div
            id="toggle-sidebar"
            className="nav-control"
            onClick={toggleSidebar}
          >
            <div className="hamburger ">
              <span className="line"></span>
              <span className="line"></span>
              <span className="line"></span>
            </div>
          </div>

          <div className="sm-breadcrumb">
            <h4>Dashboard</h4>
          </div>
        </div>
        <div className="menu-right">
          
        </div>
      </div>
    </div>
    </>
    
  );
};

MainHeader.propTypes = {
  toggleSidebar: PropTypes.node.isRequired,
};

export default MainHeader;
