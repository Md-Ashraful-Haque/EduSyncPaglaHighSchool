/*eslint no-unused-vars: ["error", { "caughtErrors": "none" }]*/

import { createContext, useState, useContext, useEffect } from "react";
import PropTypes from "prop-types";
import axios from "axios"; 
import { doGetAPIcall } from "Utils/utilsFunctions/UtilFuntions";
const AppContext = createContext();

// Create a Provider Component
export const ContextAPIProvider = ({ children }) => {
  const [vars, setVars] = useState({
    userName: null,
    userRole: null,
    teacherDesignation: null,
    var3: null,
    allow_students_info: null,
    allow_all_subject: null,
    only_marks_input: null,
    allow_result_processing: null,
    user_image: null,
    is_staff: null,
  });

  const [instituteInfo, setInstituteInfo] = useState(null);

  const apiUrl = import.meta.env.VITE_API_URL;
  const instituteCode = import.meta.env.VITE_INSTITUTE_CODE; // Recommended naming convention

  useEffect(() => {
    axios
      .get(`${apiUrl}/institute-info/?instituteCode=${instituteCode}`, {
        withCredentials: true,
      })
      .then((res) => {
        setInstituteInfo(res.data);
        console.log("setInstituteInfo:", res.data);
      })
      .catch((err) => console.error("Institute Info Loader fetch error:", err));

    
  }, []);


  // Update specific variable in the `vars` object
  const updateVar = (key, value) => {
    setVars((prev) => ({
      ...prev,
      [key]: value, // Dynamically update the key
    }));
  };


  // const instituteCode = import.meta.env.VITE_INSTITUTE_CODE;
    useEffect(() => {
      const fetchUserAccess = async () => {
        const requestData = {
          INSTITUTE_CODE: instituteCode,
        };
  
        try {
          const response = await doGetAPIcall(
            createNewAccessToken,
            "user-access",
            requestData
          );
          updateVar("allow_students_info", response.allow_students_info);
          updateVar("allow_all_subject", response.allow_all_subject);
          updateVar("allow_result_processing", response.allow_result_processing);
          updateVar("only_marks_input", response.only_marks_input);
          updateVar("user_image", response.image);
          updateVar("is_staff", response.is_staff);
          console.log("allow : ", response);
        } catch (error) {
          console.error("User Access Info Loader fetch error:", error);
        } finally {
          // console.log("User Access Info final");
        }
      };
  
      if (isAuthenticated) {
        fetchUserAccess();
      }

    }, []);

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
    localStorage.setItem("accessToken", token);
    setIsAuthenticated(true);
  };

  const logout = async () => {
    try {
      // Send a request to the backend to invalidate the refresh token
      await axios.post(
        `${import.meta.env.VITE_API_URL}/logout/`,
        {},
        { withCredentials: true }
      );

      // Clear the accessToken from localStorage
      localStorage.removeItem("accessToken");

      // Update app state to reflect logged-out status
      setIsAuthenticated(false);

      // Redirect to login (optional)
      // window.location.href = '/';
    } catch (error) {
      console.error("Error during logout:", error);
    }
  };

  const handleTokenExpiration = async (setSchoolData = null, apiUrl = null) => {
    try {
      const refreshAPIurl = `${import.meta.env.VITE_API_URL}/token/refresh/`;
      // axios.defaults.withCredentials = true;

      const response = await axios.post(
        refreshAPIurl,
        {},
        { withCredentials: true }
      );

      login(response.data.access);

      if (setSchoolData) {
        const retryResponse = await axios.get(apiUrl, {
          headers: {
            Authorization: `Bearer ${response.data.access}`,
            "Content-Type": "application/json",
          },
        });

        setSchoolData(retryResponse.data);
      }
    } catch (err) {
      // console.error('Refresh token expired or invalid',err, err.response.data);
      logout(); // Logout user and clear localStorage and cookies
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
        instituteInfo,
        setInstituteInfo,
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
