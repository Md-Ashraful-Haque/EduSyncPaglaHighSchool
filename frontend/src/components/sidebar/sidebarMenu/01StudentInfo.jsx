import PropTypes from "prop-types";
import MenuLeftLogo from "./img/result.svg";
import MenuItem from "../sidebarComponents/MenuItem";
import SubMenuItem from "../sidebarComponents/SubMenuItem";
import { GraduationCap } from 'lucide-react';
const submenuItems = [
  {
    id: "students-menu-item-1",
    to: "/admin/student/show-all-student",
    label: "সকল শিক্ষার্থী",
    menuType: "student_list",
  },
  // {
  //   id: "students-menu-item-2",
  //   to: "/promote-student",
  //   label: "Promote Student",
  // },
  {
    id: "students-menu-item-3",
    to: "/admin/student/student-id-card",
    label: "আইডি কার্ড প্রিন্ট",
    menuType: "student_list",
  },
  // {
  //   id: "students-menu-item-4",
  //   to: "/leave-application",
  //   label: "Leave Application",
  // },
  // {
  //   id: "students-menu-item-5",
  //   to: "/guardian",
  //   label: "Guardian",
  // },
];

const StudentInfo = ({ menuId }) => {
  return (
    <li>
      <MenuItem
        MenuLogo={GraduationCap}
        menuName="শিক্ষার্থীর তথ্য"
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
