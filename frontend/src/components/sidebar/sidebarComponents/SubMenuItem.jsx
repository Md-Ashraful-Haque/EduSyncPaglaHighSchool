import PropTypes from "prop-types";
import { Link } from "react-router-dom";
// import { AppContext } from "../../../ContextAPI/AppContext";
// import { useContext } from "react";
import { useAppContext } from "../../../ContextAPI/AppContext";

const SubMenuItem = ({ submenuItems, menuId }) => {
  const {
    activeSubMenu,
    activeSubMenuItem,
    toggleSubMenuItem,
    toggleSidebar,
    vars,
  } = useAppContext();
  const isActiveMenu = activeSubMenu === menuId;

  const handleClick = (id) => {
    // console.log("window.innerWidth: ", window.innerWidth);
    toggleSubMenuItem(id);

    const isMobile = window.innerWidth <= 768; // Adjust breakpoint as needed
    if (isMobile) {
      toggleSidebar();
    }
  };
  // #a1#1234a
  // const permissionsMap = {
  //   student_list: "allow_students_info",
  //   result_processing: "allow_result_processing",
  //   inputField: "only_marks_input",
  // };

  return (
    <>
      <ul className={isActiveMenu ? "active-submenu" : "inactive-submenu"}>
        
        {submenuItems.map(({ id, to, label, menuType, inputField }) => (
          (menuType === "student_list" || menuType === "teacher_list") && vars.allow_students_info ? (
            <li key={id}>
              <Link
                to={to}
                className={activeSubMenuItem === id ? "active" : ""} 
                onClick={() => handleClick(id)}
              >
                {label}
              </Link>
            </li>
          ) : menuType === "result_processing" && vars.allow_result_processing ? (
            <li key={id}>
              <Link
                to={to}
                className={activeSubMenuItem === id ? "active" : ""} 
                onClick={() => handleClick(id)}
              >
                {label}
              </Link>
            </li>
          ) :  inputField === "inputField" && vars.only_marks_input ? (
            <li key={id}>
              <Link
                to={to}
                className={activeSubMenuItem === id ? "active" : ""} 
                onClick={() => handleClick(id)}
              >
                {label}
              </Link>
            </li>
          ) : null
        ))}
      </ul>
    </>
  );
};

SubMenuItem.propTypes = {
  submenuItems: PropTypes.string.isRequired, //List of objects
  menuId: PropTypes.string.isRequired,
};

export default SubMenuItem;
