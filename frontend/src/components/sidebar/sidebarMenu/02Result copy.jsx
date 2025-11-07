import PropTypes from "prop-types";

// import { Link } from "react-router-dom";

import MenuLeftLogo from "./img/result.svg";

import MenuItem from "../sidebarComponents/MenuItem";
import SubMenuItem from "../sidebarComponents/SubMenuItem";

const submenuItems = [
  {
    id: "result-item-1",
    to: "admin/enter-marks-by-subject",
    label: "নম্বর ইনপুট করুন",
    visibility: ["All"],
  },
  {
    id: "result-item-2",
    to: "/generate-result",
    label: "ফলাফল তৈরী করুন",
    visibility: ["Head Teacher", "Admin"],
  },
  { 
    id: "result-item-3",
    to: "/show-result",
    label: "ফলাফল",
    visibility: ["Head Teacher", "Admin"],
  },
  {
    id: "result-item-4",
    to: "/show-tabulation-sheet",
    label: "টেবুলেশন শীট",
    visibility: ["Head Teacher", "Admin"],
  }, 
  {
    id: "result-item-5",
    to: "/show-merit-report",
    label: "মেধা তালিকা",
    visibility: ["Head Teacher", "Admin"],
  }, 
];

const ResultMenu = ({ menuId }) => {
  return (
    <li>
      <MenuItem
        menuLeftLogo={MenuLeftLogo}
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
