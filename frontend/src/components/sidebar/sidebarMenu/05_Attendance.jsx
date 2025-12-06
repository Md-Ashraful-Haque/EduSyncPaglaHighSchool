import PropTypes from "prop-types"; 
import MenuItem from "../sidebarComponents/MenuItem";
import SubMenuItem from "../sidebarComponents/SubMenuItem";
import { GraduationCap } from 'lucide-react';
const submenuItems = [
  {
    id: "attendance-menu-item-1",
    to: "/attendance/student-attendance",
    label: "শিক্ষার্থীর উপস্থিতি",
    menuType: "student_list",
    
  },   
];

const Attendance = ({ menuId }) => {
  return (
    <li>
      <MenuItem
        MenuLogo={GraduationCap}
        menuName="উপস্থিতি"
        menuId={menuId}
      />
      <SubMenuItem submenuItems={submenuItems} menuId={menuId} />
    </li>
  );
};

Attendance.propTypes = {
  menuId: PropTypes.string.isRequired,
};

export default Attendance;
