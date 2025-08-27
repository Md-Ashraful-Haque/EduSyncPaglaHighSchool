import PropTypes from 'prop-types';
// import { useContext } from "react";
// import {AppContext} from '../../../ContextAPI/AppContext'
import { Link } from "react-router-dom";
// import { Medal } from 'lucide-react';

import { useAppContext } from '../../../ContextAPI/AppContext';


const MenuItem = ({MenuLogo, menuName, menuId}) => {

  const { activeSubMenu, toggleSubMenu } = useAppContext();
  const isActiveMenu = activeSubMenu === menuId;
  
  return (
    <>
      <Link
        to="#"
        className={isActiveMenu ? "active" : ""}
        onClick={() => toggleSubMenu(menuId)}
      >
        {/* <img src={menuLeftLogo} alt="Result Menu" /> */}
        <MenuLogo className="w-5 h-5" />
        <span className="nav-text">{menuName}</span>
      </Link>
    </>
  );
};

MenuItem.propTypes = {
  menuLeftLogo: PropTypes.string.isRequired,
  menuName: PropTypes.string.isRequired,
  menuId: PropTypes.string.isRequired,
};

export default MenuItem;