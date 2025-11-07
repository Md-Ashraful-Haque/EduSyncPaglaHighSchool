// src/components/Menu.jsx
import { useState, useEffect } from "react";
import axios from "axios";
import "./menu.scss";
import schoolLogo from "../../assets/images/penchulHS.png";
import FullScreenModal from "pageComponents/02_full_screen_window";
import ContactInfo from "schoolWebsite/08-contact-info/ContactInfo"; 
import { componentMap } from "./componentMap";



const Menu = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [showContactInfo, setShowContactInfo] = useState(false);

  const toggleMenu = () => setMenuOpen(!menuOpen);
  const closeMenu = () => setMenuOpen(false);

  const [menuItems, setMenuItems] = useState([]);
  const apiUrl = import.meta.env.VITE_API_URL;

  useEffect(() => {
    axios
      .get(`${apiUrl}/menus/`, {
        withCredentials: true,
      })
      .then((res) => {
        setMenuItems(res.data);
        // console.log("res.data: ", res.data);
      })
      .catch((err) => console.error("Menu fetch error:", err));
  }, []);

  const handleModalClose = () => {
    // setShowALlNotice(false);
    setIsModalOpen(false);
  };

  const renderMenuItems = (items, isSubmenu = false) => (
    <ul className={isSubmenu ? "submenu" : `menu ${menuOpen ? "open" : ""}`}>
      {items.map((item) => (
        <li
          className={`menu-item ${
            item.children.length > 0 ? "has-submenu" : ""
          }`}
          key={item.id}
        >
          {item.children.length > 0 ? (
            <>
              <span>{item.name_bn} ▾</span>
              {renderMenuItems(item.children, true)}
            </>
          ) : (
            <a href={item.slug} onClick={closeMenu}>
              {item.name_bn}

              
              
            </a>
          )}
        </li>
      ))}
    </ul>
  );

  return (
    <>
      <nav className="custom-navbar container-fluid menu-bg fixed-top">
        <div className="container">
          <div className="brand">
            <a href="/">
              <img src={schoolLogo} alt="" />
              <h1 className="institute-name">পেঁচুল হাই স্কুল</h1>
            </a>
          </div>

          <button className="toggle-button" onClick={toggleMenu}>
            ☰
          </button>

          {renderMenuItems(menuItems)}
        </div>
      </nav>

      {/* =================== Single Page=================== */}
      <FullScreenModal isOpen={isModalOpen} onClose={handleModalClose}> 
        <ContactInfo/>
      </FullScreenModal>
    </>
  );
};

export default Menu;
