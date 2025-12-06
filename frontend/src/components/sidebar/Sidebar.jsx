import { Link } from "react-router-dom";
import PropTypes from "prop-types";

import dashboard from "../../assets/04-section/01-dashboard/assets/img/dashboard.svg";

// import ResultMenu from './02Result'
// import StudentInfo from './01StudentInfo'
import { LogOut,LayoutDashboard } from 'lucide-react';
import {
  ResultMenu,
  TeacherInfo,
  StudentInfo,
  ExamMenu,
  AccountsMenu,
  Attendance,
} from "./sidebarMenu/index.jsx";

// import { useContext } from "react";
// import {AppContext} from '../../ContextAPI/AppContext'

import { useAppContext } from "../../ContextAPI/AppContext";

const Sidebar = () => {
  // const Sidebar = ({isSidebarHidden, toggleSidebar}) => {

  const {logout, activeSubMenu, toggleSubMenu, isSidebarHidden } = useAppContext();

  return (
    <div className={`left-sidebar ${isSidebarHidden ? "hidden" : ""}`}>
      {/* <ul style={{paddingBottom: "200px", border:"1px solid red"}}> */}
      <ul>
        <li>
          <Link
            to="/admin"
            className={`not-caret ${
              activeSubMenu === "menu0" ? "active" : ""
            } `}
            onClick={() => toggleSubMenu("menu0")}
          >
            {/* <img src={dashboard} alt="Dashboard logo" /> */}
            <LayoutDashboard />
            <span className="nav-text">ড্যাশবোর্ড</span>
          </Link>
        </li>
        
        
        <TeacherInfo menuId="TeacherInfo" />
        <StudentInfo menuId="StudentInfo" />
        <Attendance menuId="Attendance" />
        <ExamMenu menuId="Exam" />  
        <ResultMenu menuId="ResultMenu" />

        <li>
          <Link
            to="/"
            className={`not-caret ${
              activeSubMenu === "logout" ? "active" : ""
            } `}
            onClick={() =>{
              toggleSubMenu("logout");
              logout();
            }}
          >
            {/* <img src={dashboard} alt="Dashboard logo" /> */}
            <LogOut />
            <span className="nav-text">লগআউট</span>
          </Link>
        </li>

        {/* <li onClick={logout}>Logout</li> */}
        {/* <AccountsMenu menuId="Accounts" />   */}
          
      </ul>
    </div>
  );
};

Sidebar.propTypes = {
  isSidebarHidden: PropTypes.node.isRequired,
};

export default Sidebar;
