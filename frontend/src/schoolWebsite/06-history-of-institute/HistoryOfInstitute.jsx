
import { useEffect, useState } from "react";
import axios from "axios";
import FullScreenModal from "../../pages/00-page-components/02_full_screen_window";
import HistoryPage from "./HistoryPage";

import "./history-of-institute.scss";

const HistoryOfInstitute = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [showFull, setShowFull] = useState(false);
  const [history, setHistory] = useState(null);

  const apiUrl = import.meta.env.VITE_API_URL;
  const instituteCode = import.meta.env.VITE_INSTITUTE_CODE;

  useEffect(() => {
    axios
      .get(`${apiUrl}/institute-details/${instituteCode}/public/`, {
        withCredentials: true,
      })
      .then((res) => setHistory(res.data.history))
      .catch((err) => console.error("Institute fetch error:", err));
  }, [apiUrl, instituteCode]);

  const toggleModal = () => {
    setShowFull((prev) => !prev);
    setIsModalOpen((prev) => !prev);
  };

  const HistoryContent = ({ history, showFull, onToggle }) => (
    <div className="row">
      <div className="col-ms-12 col-md-4">
        {history.show_image && history.image_url && (
          <div className="institute-image">
            <img
              src={history.image_url}
              alt={history.title}
              style={{ maxWidth: "100%" }}
            />
          </div>
        )}
      </div>

      <div className="col-ms-12 col-md-8">
        <div className="history-text">
          <p className={showFull ? "" : "truncate-multiline-5"}>
            {history.content}
          </p>
          <button className="button-1-inv details-btn" onClick={onToggle}>
            {showFull ? "কম দেখুন" : "বিস্তারিত"}
          </button>
        </div>
      </div>
    </div>
  );

  if (!history) {
    return <p>লোড হচ্ছে বা তথ্য পাওয়া যায়নি।</p>;
  }

  return (
    <div className="space-y-0">
      <div className="notice-header">
        <h2>{history.title}</h2>
      </div>

      <div className="history-of-institute">
        <HistoryContent
          history={history}
          showFull={showFull}
          onToggle={toggleModal}
        />
      </div>

      {showFull && (
        <FullScreenModal isOpen={isModalOpen} onClose={toggleModal}>
          <HistoryPage />
        </FullScreenModal>
      )}
    </div>
  );
};

export default HistoryOfInstitute;



// import "./history-of-institute.scss";

// import { useEffect, useState } from "react";
// import FullScreenModal from "../../pages/00-page-components/02_full_screen_window";
// import axios from "axios";

// import { ArrowRightIcon, EyeIcon } from "@heroicons/react/24/outline";

// import HistoryPage from "./HistoryPage";

// const HistoryOfInstitute = () => {
//   const [isModalOpen, setIsModalOpen] = useState(false);
//   const [showFull, setShowFull] = useState(false);
//   const [history, setHistory] = useState(null);
//   const [school, setSchool] = useState(null);

//   const apiUrl = import.meta.env.VITE_API_URL;
//   const instituteCode = import.meta.env.VITE_INSTITUTE_CODE;

//   useEffect(() => {
//     axios
//       .get(`${apiUrl}/institute-details/${instituteCode}/public/`, {
//         withCredentials: true,
//       })
//       .then((res) => {
//         setSchool(res.data);
//         setHistory(res.data.history);
//         // console.log("res.data.history: ", res.data.history);
//         // console.log("instituteInfo: ", res.data);
//       })
//       .catch((err) => console.error("Institute fetch error:", err));
//   }, []);

//   const handleModalClose = () => {
//     setShowFull(!showFull);
//     setIsModalOpen(!isModalOpen);
//   };
//   const HistoryContent = ({ history, showFull, onToggle }) => (
//     <div className="row">
//       <div className="col-ms-12 col-md-4">
//         {history.show_image && history.image_url && (
//           <div className="institute-image">
//             <img
//               src={history.image_url}
//               alt={history.title}
//               style={{ maxWidth: "100%" }}
//             />
//           </div>
//         )}
//       </div>

//       <div className="col-ms-12 col-md-8">
//         <div className="history-text">
//           <p className={showFull ? "" : "truncate-multiline-5"}>
//             {history.content}
//           </p>
//           <button className="button-1-inv details-btn" onClick={onToggle}>
//             {showFull ? "কম দেখুন" : "বিস্তারিত"}
//           </button>
//         </div>
//       </div>
//     </div>
//   );

//   return (
//     <div className="space-y-0">
//       {history ? (
//         <>
//           <div className="notice-header">
//             <h2>{history.title}</h2>
//           </div>

//           <div className="history-of-institute">
//             <HistoryContent
//               history={history}
//               showFull={showFull}
//               onToggle={handleModalClose}
//             />
//           </div>

//           {showFull && (
//             <FullScreenModal isOpen={isModalOpen} onClose={handleModalClose}>
//               <HistoryPage />
//             </FullScreenModal>
//           )}
//         </>
//       ) : (
//         <p>লোড হচ্ছে বা তথ্য পাওয়া যায়নি।</p>
//       )}
//     </div>
//   );
// };

// export default HistoryOfInstitute;
