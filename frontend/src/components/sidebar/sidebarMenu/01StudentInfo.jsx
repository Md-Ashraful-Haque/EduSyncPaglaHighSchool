import PropTypes from "prop-types";
import MenuLeftLogo from "./img/result.svg";
import MenuItem from "../sidebarComponents/MenuItem";
import SubMenuItem from "../sidebarComponents/SubMenuItem";

const submenuItems = [
  {
    id: "students-menu-item-1",
    to: "/admin/show-all-student",
    label: "সকল শিক্ষার্থী",
    menuType: "student_list",
  },
  // {
  //   id: "students-menu-item-2",
  //   to: "/promote-student",
  //   label: "Promote Student",
  // },
  // {
  //   id: "students-menu-item-3",
  //   to: "/leave-application",
  //   label: "Leave Application",
  // },
  // {
  //   id: "students-menu-item-4",
  //   to: "/guardian",
  //   label: "Guardian",
  // },
];

const StudentInfo = ({ menuId }) => {
  return (
    <li>
      <MenuItem
        menuLeftLogo={MenuLeftLogo}
        menuName="শিক্ষার্থীর তালিকা"
        menuId={menuId}
      />
      <SubMenuItem submenuItems={submenuItems} menuId={menuId} />
    </li>
  );
};

StudentInfo.propTypes = {
  menuId: PropTypes.string.isRequired,
};

export default StudentInfo;
