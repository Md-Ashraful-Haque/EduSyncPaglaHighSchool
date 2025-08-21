import { useState } from "react";
import { useAppContext } from "../../../ContextAPI/AppContext";
import dropdown_caret from "./img/caret.svg";

import "./sass/userName.scss";

const AdminName = () => {
  const { logout, vars } = useAppContext();
  const [isDropdownVisible, setDropdownVisible] = useState(false);

  return (
    <div
      className="menu-item user-profile"
      onMouseEnter={() => setDropdownVisible(true)}
      onMouseLeave={() => setDropdownVisible(false)}
    >
      <div className="user-image">
        <img src={vars.user_image} alt="" />
      </div>
      <div className="user-name-and-type">
        <div className="user-name"> {vars.userName} </div>
        <div className="user-type">{vars.userRole}</div>
      </div>
      <div className="option-icon">
        <img src={dropdown_caret} alt="" />
      </div>
      {isDropdownVisible && (
        <div className="dropdown-menu">
          <ul>
            <li>Profile</li>
            <li>Settings</li>
            <li onClick={logout}>Logout</li>
          </ul>
        </div>
      )}
    </div>
  );
};

export default AdminName;


