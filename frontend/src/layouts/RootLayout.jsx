import { Outlet } from "react-router-dom";
import Sidebar from "../components/sidebar/Sidebar";
import MainHeader from "../components/mainHeader/MainHeader";
import { useAppContext } from "ContextAPI/AppContext";
import { ResultContextAPIProvider } from "ContextAPI/MarksInputBySubjectContext";

const RootLayout = () => {
  const { isSidebarHidden } = useAppContext();

  return (
    <div className="layout" style={{ fontFamily: "Open Sans" }}>
      <MainHeader />
      <Sidebar />
      <ResultContextAPIProvider>
        <div className={`wrap ${isSidebarHidden ? "expanded" : ""}`}>
          <div className="wrap-content">
            <Outlet /> {/* Child pages render here */}
          </div>
        </div>
      </ResultContextAPIProvider>
    </div>
  );
};

export default RootLayout;
