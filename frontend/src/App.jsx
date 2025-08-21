import { BrowserRouter as Router } from "react-router-dom";
import FontLoader from "./components/webFontLoader/FontLoader";
import AppRoutes from "./routes/AppRoutes";
import { ToastContainer } from "react-toastify";

const App = () => {
  return (
    <>
      <FontLoader />
      <Router>
        <AppRoutes />
        <ToastContainer />
      </Router>
    </>
  );
};

export default App;
