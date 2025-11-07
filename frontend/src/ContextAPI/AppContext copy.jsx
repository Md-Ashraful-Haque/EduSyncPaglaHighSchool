/*eslint no-unused-vars: ["error", { "caughtErrors": "none" }]*/

import { createContext, useState, useContext } from 'react';
import PropTypes from "prop-types";
import axios from "axios";

const AppContext = createContext();

// Create a Provider Component
export const ContextAPIProvider = ({ children }) => {

  const [vars, setVars] = useState({
    userName: null,
    userRole: null,
    teacherDesignation: null,
    var3: null,
  });

  // Update specific variable in the `vars` object
  const updateVar = (key, value) => {
    setVars((prev) => ({
      ...prev,
      [key]: value, // Dynamically update the key
    }));
  };

  // State to track whether the sidebar is hidden
  const [isSidebarHidden, setIsSidebarHidden] = useState(false);
    
  // Toggle sidebar visibility
  const toggleSidebar = () => {
      setIsSidebarHidden((prevState) => !prevState);
  };


  const [isAuthenticated, setIsAuthenticated] = useState(
    !!localStorage.getItem("accessToken") // Check token in localStorage
  );

  const login = (token) => { 
    // console.log('token: ', token);
    localStorage.setItem("accessToken", token); 
    setIsAuthenticated(true); 
  };
  
  
  const logout = async () => {
    try {
      // Send a request to the backend to invalidate the refresh token
      await axios.post(`${import.meta.env.VITE_API_URL}/logout/`, {}, { withCredentials: true });
  
      // Clear the accessToken from localStorage
      localStorage.removeItem('accessToken');
      
      // Update app state to reflect logged-out status
      setIsAuthenticated(false);
  
      // Redirect to login (optional)
      // window.location.href = '/';
    } catch (error) {
      console.error("Error during logout:", error);
    }
  };


  

  // When access token expires for local development only:
  // const handleTokenExpiration = async (setSchoolData, apiUrl) => {
  //   try {
  //     const refreshToken = localStorage.getItem("refreshToken");
  //     console.log("refreshToken Local: ", refreshToken);
  //     const refreshAPIurl = `${import.meta.env.VITE_API_URL}/token/refresh/`;

  //     const response = await axios.post(refreshAPIurl, {
  //       // it should be empty {} otherwise it can dangerous security issues for doing that use 
  //       //Server-Side (Django) - Setting Http-Only Cookies:
  //       refresh: refreshToken,
  //     });
  //     console.log("New accessToken: ", response.data.access);
  //     localStorage.setItem("accessToken", response.data.access);
      

  //     // Retry original API request with new token
  //     const retryResponse = await axios.get(apiUrl, {
  //       headers: { Authorization: `Bearer ${response.data.access}` },
  //     }); 

  //     setSchoolData(retryResponse.data);
  //   } catch (err) {
  //     console.error("Refresh token expired or invalid");
  //     logout();
  //   }
  // };

  const handleTokenExpiration = async (setSchoolData=null, apiUrl=null) => {
    try {
      const refreshAPIurl = `${import.meta.env.VITE_API_URL}/token/refresh/`;
      // axios.defaults.withCredentials = true;

      const response = await axios.post(
        refreshAPIurl,
        {},
        { withCredentials: true }
      );
      
      login(response.data.access); 
      // updateVar("userName",response.data.name);
      // updateVar("userRole",response.data.role);
      // console.log("///////response.data.access///////// ", response.data.access);
      // console.log("///////response.data.access///////// ", response );
      if (setSchoolData){

        const retryResponse = await axios.get(apiUrl, {
          headers: { Authorization: `Bearer ${response.data.access}`, 'Content-Type': 'application/json' },
        });

      
        setSchoolData(retryResponse.data);
      }

    } catch (err) {
      // console.error('Refresh token expired or invalid',err, err.response.data);
      logout();  // Logout user and clear localStorage and cookies
    }
  }; 

  const createNewAccessToken = async () => {
    try {
      const refreshAPIurl = `${import.meta.env.VITE_API_URL}/token/refresh/`;
      // axios.defaults.withCredentials = true;

      const response = await axios.post(
        refreshAPIurl,
        {},
        { withCredentials: true }
      );

      login(response.data.access);
    } catch (err) {
      logout(); // Logout user and clear localStorage and cookies
    }
  }; 
  

  const [activeSubMenu, setActiveSubMenu] = useState(null);
  const toggleSubMenu = (menuId) => {
    setActiveSubMenu((prevMenu) => (prevMenu === menuId ? null : menuId));
  };

  const [activeSubMenuItem, setActiveSubMenuItem] = useState(null);
  const toggleSubMenuItem = (subMenuItemName) => {
    setActiveSubMenuItem(subMenuItemName);
  };

  

  return (
    <AppContext.Provider
      value={{
        isSidebarHidden,
        toggleSidebar,
        activeSubMenu,
        toggleSubMenu,
        activeSubMenuItem,
        toggleSubMenuItem,
        isAuthenticated, 
        login,
        logout,
        handleTokenExpiration,
        createNewAccessToken,
        vars,
        updateVar, 
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

ContextAPIProvider.propTypes = {
  children: PropTypes.string.isRequired,
};

export const useAppContext = () => useContext(AppContext);



// import { createContext, useState } from "react";
// import PropTypes from "prop-types";
// import { reactRefresh } from 'eslint-plugin-react-refresh';

// export const AppContext = createContext();

// export const ContextAPIProvider = ({ children }) => {
//   const [menuState, setMenuState] = useState({
//     activeSubMenu: null,
//     activeSubMenuItem: null,
//   });

//   const toggleSubMenu = (menuId) => {
//     setMenuState((prev) => ({
//       ...prev,
//       activeSubMenu: prev.activeSubMenu === menuId ? null : menuId,
//     }));
//   };

//   const toggleSubMenuItem = (subMenuItemName) => {
//     setMenuState((prev) => ({
//       ...prev,
//       activeSubMenuItem: subMenuItemName,
//     }));
//   };

//   return (
//     <AppContext.Provider
//       value={{
//         activeSubMenu: menuState.activeSubMenu,
//         toggleSubMenu,
//         activeSubMenuItem: menuState.activeSubMenuItem,
//         toggleSubMenuItem,
//       }}
//     >
//       {children}
//     </AppContext.Provider>
//   );
// };

// ContextAPIProvider.propTypes = {
//   children: PropTypes.node.isRequired,
// };
