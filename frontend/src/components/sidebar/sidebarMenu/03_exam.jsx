import PropTypes from "prop-types";

// import { Link } from "react-router-dom";

import MenuLeftLogo from "./img/result.svg";

import MenuItem from "../sidebarComponents/MenuItem";
import SubMenuItem from "../sidebarComponents/SubMenuItem";

const submenuItems = [
  {
    id: "result-item-1",
    to: "/enter-marks-by-subject",
    label: "Enter Marks by Subject",
  },
  {
    id: "result-item-2",
    to: "/generate-result",
    label: "Generate Result",
  },
  { id: "result-item-3", to: "/create-marksheet", label: "Create Marksheet" },
  {
    id: "result-item-4",
    to: "/create-merit-report",
    label: "Create Merit Report",
  },
  {
    id: "result-item-5",
    to: "/create-tabulation-sheet",
    label: "Create Tabulation Sheet",
  },
];

const ExamMenu = ({ menuId }) => {
  return (
    <li>
      <MenuItem
        menuLeftLogo={MenuLeftLogo}
        menuName="পরীক্ষা"
        menuId={menuId}
      />
      <SubMenuItem submenuItems={submenuItems} menuId={menuId} />
    </li>
  );
};

ExamMenu.propTypes = {
  menuId: PropTypes.string.isRequired,
};

export default ExamMenu;
