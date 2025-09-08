import "./dashboard.scss";
import { PropTypes } from "prop-types";
import { useNavigate } from "react-router-dom";
import VisibilityWrapper from "../visibility_component/visibility";
import { Edit3, Settings, FileText, Table, ListOrdered } from "lucide-react";

import { createContext, useState, useContext, useEffect } from "react";
import axios from "axios";
import { doGetAPIcall } from "Utils/utilsFunctions/UtilFuntions";
import DashboardButton from "./DashboardButton";
import { useAppContext } from "ContextAPI/AppContext";
const Dashboard = () => {
  const { createNewAccessToken,vars } = useAppContext();
  const [userAccess, setUserAccess] = useState(null);

  console.log("vars: ", vars);

  const navigate = useNavigate();
  

  return (
    <>
      <div className="dashboard-wrap">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 p-4">
          {vars?.allow_students_info && (
            <DashboardButton
              icon={Edit3}
              label="সকল শিক্ষার্থী"
              onClick={() => navigate("/admin/show-all-student")}
            />
          )}
          {vars?.only_marks_input && (
            <DashboardButton
              icon={Edit3}
              label="নম্বর ইনপুট করুন"
              onClick={() => navigate("/admin/enter-marks-by-subject")}
            />
          )}
          {/* <VisibilityWrapper visibility={["Assistant Teacher"]}> 
            <DashboardButton
              icon={Edit3}
              label="নম্বর ইনপুট করুন"
              onClick={() => navigate("/admin/enter-marks-by-subject")}
            />
          </VisibilityWrapper> */}

          {vars?.allow_result_processing && (
            <>
              <DashboardButton
                icon={Settings}
                label="এডমিট কার্ড ডাউনলোড করুন"
                onClick={() => navigate("/admin/admit-card")}
              />
              <DashboardButton
                icon={Settings}
                label="ফলাফল তৈরী করুন"
                onClick={() => navigate("/admin/generate-result")}
              />

              <DashboardButton
                icon={FileText}
                label="ফলাফল"
                onClick={() => navigate("/admin/show-result")}
              />

              <DashboardButton
                icon={Table}
                label="টেবুলেশন শীট"
                onClick={() => navigate("/admin/show-tabulation-sheet")}
              />

              <DashboardButton
                icon={ListOrdered}
                label="মেধা সারাংশ"
                onClick={() => navigate("/admin/show-merit-summary")}
              />

              <DashboardButton
                icon={ListOrdered}
                label="মেধা তালিকা"
                onClick={() => navigate("/admin/show-merit-report")}
              />
            </>
          )}
        </div>
      </div>
    </>
  );
};

Dashboard.propTypes = {
  toggleSidebar: PropTypes.node.isRequired,
};

export default Dashboard;
