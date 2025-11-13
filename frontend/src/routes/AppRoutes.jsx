import { Routes, Route, Navigate } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import { useAppContext } from "../ContextAPI/AppContext";

// import Loading_1 from "../LoadingComponent/loading/Loading_1";
import Loading_1 from "../components/loading/Loading_1";
import Website from "../schoolWebsite/Website";
import Login from "../components/01_login/Login";
import RootLayout from "../layouts/RootLayout";
import ProtectedRoute from "./ProtectedRoute";

// Admin pages
import Dashboard from "../components/dashboard/Dashboard";
import AddStudent from "../pages/AddStudent";
import PageNotFound404 from "../pages/pageNotFound/PageNotFound404";

import { 
  P01_EnterMarksBySubject,
  P02_ResultGenerator,
  P03_ShowResult,
  P04_ShowTabulationSheet,
  P05_ShowMeritReport,
  P06_MeritSummary,
} from "../pages/02_resutlSection/Z99_index";
import {
  P00_AdmitCard, 
  P01_SeatPlan,
} from "../pages/02_exam/Z99_ExamIndex";
import { P01_ShowAllStudents } from "../pages/01_students/Z99_index"; 
import { P01_ShowAllTeachers } from "../pages/00_teachers/Z99_index";

const AppRoutes = () => {
  const { isAuthenticated, updateVar } = useAppContext();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const refreshResponse = await axios.post(
          `${import.meta.env.VITE_API_URL}/token/refresh/`,
          {},
          { withCredentials: true }
        );
        const accessToken = refreshResponse.data.access;

        const userResponse = await axios.get(
          `${import.meta.env.VITE_API_URL}/user/`,
          {
            headers: { Authorization: `Bearer ${accessToken}` },
          }
        );

        // console.log("userResponse.data:" , userResponse.data)

        const { name: userName, role: userRole, } = userResponse.data;
        await updateVar("userName", userName);
        await updateVar("userRole", userRole); 
      } catch (error) {
        console.warn("No active session",error);
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, []);

  if (loading) return <Loading_1 />;

  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/" element={<Website />} />
      <Route path="/login" element={!isAuthenticated ? <Login /> : <Navigate to="/admin" />} />

      {/* Protected Routes */}
      <Route path="/admin" element={<ProtectedRoute><RootLayout /></ProtectedRoute>}>
        <Route index element={<Navigate to="dashboard" />} />
        <Route path="dashboard" element={<Dashboard />} />
        <Route path="add-student" element={<AddStudent />} />
        <Route path="show-all-teacher" element={<P01_ShowAllTeachers />} />
        <Route path="show-all-student" element={<P01_ShowAllStudents />} />
        
        <Route path="admit-card" element={<P00_AdmitCard />} />
        <Route path="seat-plan" element={<P01_SeatPlan />} />

        <Route path="enter-marks-by-subject" element={<P01_EnterMarksBySubject />} />
        <Route path="generate-result" element={<P02_ResultGenerator />} />
        <Route path="show-result" element={<P03_ShowResult />} />
        <Route path="show-tabulation-sheet" element={<P04_ShowTabulationSheet />} />
        <Route path="show-merit-report" element={<P05_ShowMeritReport />} />
        <Route path="show-merit-summary" element={<P06_MeritSummary />} />
        <Route path="*" element={<PageNotFound404 />} />
      </Route>
    </Routes>
  );
};

export default AppRoutes;
