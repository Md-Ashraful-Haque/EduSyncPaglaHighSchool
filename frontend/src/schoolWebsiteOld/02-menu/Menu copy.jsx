// src/components/Menu.jsx
import React, { useState, useEffect } from "react";
import axios from "axios";
import "./menu.scss";
import schoolLogo from "../../assets/images/penchulTransWhite.png";
import FullScreenModal from "pageComponents/02_full_screen_window";
import ContactInfo from "schoolWebsite/08-contact-info/ContactInfo";
import { componentMap } from "./componentMap";
import { useAppContext } from "ContextAPI/AppContext";


const Menu = () => {
  const {instituteInfo,isAuthenticated } = useAppContext();
  const [menuOpen, setMenuOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [showContactInfo, setShowContactInfo] = useState(false);
  const [activeSinglePageComponent, setActiveSinglePageComponent] =
    useState(null);
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
        // console.log("res.data Menu: ", res.data);
        // console.log("instituteInfo updated: ", instituteInfo);
      })
      .catch((err) => console.error("Menu fetch error:", err));
  }, []);

  const handleModalClose = () => {
    setIsModalOpen(false);
    setActiveSinglePageComponent(null);
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
            (() => {
              const cleanedSlug = item.slug.replace(/^\//, "");
              // console.log("cleanedSlug: ", cleanedSlug);
              const Component = componentMap[cleanedSlug];

              return Component ? (
                <a
                  href="#"
                  onClick={(e) => {
                    e.preventDefault();
                    setActiveSinglePageComponent(() => Component); // save reference safely
                    setIsModalOpen(true);
                    closeMenu();
                  }}
                >
                  {item.name_bn}
                  {Component}
                </a>
              ) : (
                <a href={item.slug} onClick={closeMenu}>
                  {item.name_bn}
                  {Component}
                  {/* {item.slug} */}
                </a>
              );
            })()
          )}
        </li>
      ))}
      {isAuthenticated?(
        <li>
        <a href="/admin/" onClick={closeMenu}> 
          ড্যাশবোর্ড
        </a>
      </li>
      ):(
        <li>
          <a href="/login" onClick={closeMenu}> 
            লগইন
          </a>
      </li>
      )}
      


    </ul>
  );

  return (
    <>
      <nav className="custom-navbar container-fluid menu-bg fixed-top">
        <div className="container">
          <div className="brand">
            {/* <a href="/">
              <img src={instituteInfo.logo_url} alt="" />
              <h1 className="institute-name"> {instituteInfo.name_in_english}</h1> 
            </a> */}

            {/* {instituteInfo ? (
              <a href="/">
                <img src={instituteInfo.logo_url} alt="Institute Logo" />
                <h1 className="institute-name">{instituteInfo.name}</h1>
              </a>
            ) : (
              <div className="animate-pulse text-gray-400">
                Loading institute info...
              </div>
            )} */}

            <a href="/">
                <img src={instituteInfo?.logo_url} alt="Institute Logo" />
                {/* <h1 className="institute-name"> পেঁচুল উচ্চ বিদ্যালয় </h1> */}
                <h1 className="institute-name">{instituteInfo?.name} </h1>
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
        {activeSinglePageComponent &&
          React.createElement(activeSinglePageComponent)}
      </FullScreenModal>
    </>
  );
};

export default Menu;
