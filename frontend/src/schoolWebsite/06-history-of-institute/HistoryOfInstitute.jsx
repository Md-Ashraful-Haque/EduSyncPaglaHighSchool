import "./history-of-institute.scss";

import { useEffect, useState } from "react";
import FullScreenModal from "../../pages/00-page-components/02_full_screen_window";
import axios from "axios";

import { ArrowRightIcon, EyeIcon } from "@heroicons/react/24/outline";

import HistoryPage from './HistoryPage'


const HistoryOfInstitute = () => {
  const [notices, setNotices] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [showFull, setShowFull] = useState(false);
  const [history, setHistory] = useState(null);

  const [showALlNotice, setShowALlNotice] = useState(false);

  const apiUrl = import.meta.env.VITE_API_URL;
  const instituteId = "PHS";
  // const instituteId = import.meta.env.INSTITUTE_ID;
  // console.log("His data", instituteId);

  useEffect(() => {
    if (!instituteId) return; // skip call if not available

    // setLoading(true);
    axios
      .get(`${apiUrl}/history-of-institute/`, {
        params: {
          institute: instituteId, // pass institute ID here
        },
      })
      .then((res) => {
        const data = res.data.results || res.data;
        if (Array.isArray(data)) {
          // setHistory(data);
          // console.log("data[0]: ", data[0])
          setHistory(data[0]);
        }
      })
      .catch((err) => {
        console.error("History fetch error:", err);
      })
      .finally(() => {
        // setLoading(false);
      });
  }, [instituteId]);

  const handleNoticeClick = async (slug) => {
    try {
      const res = await axios.get(`${apiUrl}/notices/${slug}/`);
      setIsModalOpen(!isModalOpen);
      // setSelectedNotice(res.data);
    } catch (err) {
      console.error("Failed to load notice details:", err);
    }
  };

  const handleModalClose = () => {
    setShowFull(!showFull);
    setIsModalOpen(!isModalOpen);
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

  return (
    <div className="space-y-0">
      {history ? (
        <>
          <div className="notice-header">
            <h2>{history.title}</h2>
          </div>

          <div className="history-of-institute">
            <HistoryContent
              history={history}
              showFull={showFull}
              onToggle={handleModalClose}
            />
          </div>

          {showFull && (
            <FullScreenModal isOpen={isModalOpen} onClose={handleModalClose}>
              {/* <div className="history-full-window">
                <HistoryContent
                  history={history}
                  showFull={true}
                  onToggle={handleModalClose}
                />
              </div> */}
              <HistoryPage/>
            </FullScreenModal>
          )}
          
        </>
      ) : (
        <p>লোড হচ্ছে বা তথ্য পাওয়া যায়নি।</p>
      )}
    </div>
  );
};

export default HistoryOfInstitute;
