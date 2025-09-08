import PropTypes from "prop-types";

// import { Link } from "react-router-dom";
import { Medal } from 'lucide-react';
import MenuLeftLogo from "./img/result.svg";

import MenuItem from "../sidebarComponents/MenuItem";
import SubMenuItem from "../sidebarComponents/SubMenuItem";

const submenuItems = [
  {
    id: "result-item-1",
    to: "/admin/enter-marks-by-subject",
    label: "নম্বর ইনপুট করুন",
    menuType: "result_processing",
    inputField: "inputField",
    visibility: ["All"],
  },
  {
    id: "result-item-2",
    to: "/admin/generate-result",
    label: "ফলাফল তৈরী করুন",
    menuType: "result_processing",
    visibility: ["Head Teacher", "Admin"],
  },
  { 
    id: "result-item-3",
    to: "/admin/show-result",
    label: "ফলাফল",
    menuType: "result_processing",
    visibility: ["Head Teacher", "Admin"],
  },
  {
    id: "result-item-4",
    to: "/admin/show-tabulation-sheet",
    label: "টেবুলেশন শীট",
    menuType: "result_processing",
    visibility: ["Head Teacher", "Admin"],
  }, 

  {
    id: "result-item-5",
    to: "/admin/show-merit-summary",
    label: "এক নজরে ফলাফল",
    menuType: "result_processing",
    visibility: ["Head Teacher", "Admin"],
  }, 
  {
    id: "result-item-5",
    to: "/admin/show-merit-report",
    label: "মেধা তালিকা",
    menuType: "result_processing",
    visibility: ["Head Teacher", "Admin"],
  }, 
];

const ResultMenu = ({ menuId }) => {
  return (
    <li>
      <MenuItem
        MenuLogo={Medal}
        // menuLeftLogo={MenuLeftLogo}
        menuName="ফলাফল"
        menuId={menuId}
      />
      <SubMenuItem submenuItems={submenuItems} menuId={menuId} />
    </li>
  );
};

ResultMenu.propTypes = {
  menuId: PropTypes.string.isRequired,
};

export default ResultMenu;
