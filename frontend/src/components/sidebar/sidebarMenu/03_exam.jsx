import PropTypes from "prop-types";

// import { Link } from "react-router-dom";

import MenuLeftLogo from "./img/result.svg";

import MenuItem from "../sidebarComponents/MenuItem";
import SubMenuItem from "../sidebarComponents/SubMenuItem";
import { BookOpenCheck } from 'lucide-react';
const submenuItems = [
  {
    id: "result-item-0",
    to: "/admin/admit-card",
    label: "এডমিট কার্ড",
    menuType: "result_processing",
    inputField: "inputField",
    visibility: ["All"],
  },
];
 
const ExamMenu = ({ menuId }) => {
  return (
    <li>
      <MenuItem
        MenuLogo={BookOpenCheck}
        // menuLeftLogo={MenuLeftLogo}
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
