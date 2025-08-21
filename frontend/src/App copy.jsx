import { BrowserRouter as Router } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";

import RootLayout from "./layouts/RootLayout";
import FontLoader from "./components/webFontLoader/FontLoader";
import Login from "./components/01_login/Login";
// import SliderCarousel from './schoolWebsite/homeSlider/HomeSlider' 
import SliderCarousel from './schoolWebsite/03-homeSlider/HomeSlider' 
import { useAppContext } from "ContextAPI/AppContext";

// import LoadingPage from './pages/loadingPage/LoadingPage';
import Loading_1 from "LoadingComponent/loading/Loading_1";
import Website from "./schoolWebsite/Website";
// import { ToastContainer, toast } from 'react-toastify';
import { ToastContainer } from "react-toastify";


// import "bootstrap/dist/css/bootstrap.min.css";
// import "bootstrap/dist/js/bootstrap.bundle.min.js";


const App = () => {
  const { isAuthenticated, updateVar } = useAppContext();
  const [loading, setLoading] = useState(true); // State to handle loading indicator

  // Fetch user data and update context variables
  const fetchUser = async () => {
    try {
      // Refresh the access token
      const refreshResponse = await axios.post(
        `${import.meta.env.VITE_API_URL}/token/refresh/`,
        {},
        { withCredentials: true }
      );
      const accessToken = refreshResponse.data.access;

      // Fetch user information
      const userResponse = await axios.get(
        `${import.meta.env.VITE_API_URL}/user/`,
        {
          headers: { Authorization: `Bearer ${accessToken}` },
        }
      );

      const { name: userName, role: userRole } = userResponse.data; //Inverse Variable naming

      // Update context variables
      await updateVar("userName", userName);
      await updateVar("userRole", userRole);
      // await updateVar("teacherDesignation", teacherDesignation);
    } catch (error) {
      console.error("Error fetching user data:", error); // Optional: Log errors for debugging
    } finally {
      setLoading(false); // End loading state
    }
  };

  // Run fetchUser on initial mount
  useEffect(() => {
    fetchUser();
  }, []);

  // Render the app based on authentication state
  return (
    <>
      <FontLoader />
      <Router>
        {loading ? (
          <div>
            <Loading_1 />
          </div> 
        ) : (
          <>
            <Website/>
            {/* <RootLayout /> */}
            <ToastContainer />
          </>
        )}
      </Router>
      {/* <Router>
        {loading ? (
          <div>
            <Loading_1 />
          </div> 
        ) : isAuthenticated ? (
          <>
            <RootLayout />
            <ToastContainer />
          </>
        ) : (
          <>
            <Login />
          </>
        )}
      </Router> */}
    </>
  );
};

export default App;
