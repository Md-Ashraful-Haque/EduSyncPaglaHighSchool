import PropTypes from "prop-types";
// import MenuLeftLogo from "./img/result.svg";
import MenuItem from "../sidebarComponents/MenuItem";
import SubMenuItem from "../sidebarComponents/SubMenuItem";
import { GraduationCap } from 'lucide-react';
const submenuItems = [
  {
    id: "teacher-menu-item-1",
    to: "/admin/show-all-teacher",
    label: "সকল শিক্ষক",
    menuType: "teacher_list",
  },
  // {
  //   id: "students-menu-item-2",
  //   to: "/promote-student",
  //   label: "Promote Student",
  // },
];

const TeacherInfo = ({ menuId }) => {
  return (
    <li>
      <MenuItem
        MenuLogo={GraduationCap}
        menuName="শিক্ষকের তথ্য"
        menuId={menuId}
      />
      <SubMenuItem submenuItems={submenuItems} menuId={menuId} />
    </li>
  );
};

TeacherInfo.propTypes = {
  menuId: PropTypes.string.isRequired,
};

export default TeacherInfo;
