import "./NoticeBoardPreview.scss";

import { useEffect, useState } from "react";
import FullScreenModal from "../../pages/00-page-components/02_full_screen_window";
import axios from "axios";
import NoticeDetails from "./NoticeDetails";

import NoticeBoard from "./NoticeBoard";

import { ArrowRightIcon, EyeIcon } from "@heroicons/react/24/outline";
// import { useWebsiteManagerContext } from "ContextAPI/WebsiteContext";


const NoticeList = () => {
  // const { websiteVars,updateWebsiteVars } = useWebsiteManagerContext();
  const [notices, setNotices] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [selectedNotice, setSelectedNotice] = useState(null);

  const [showALlNotice, setShowALlNotice] = useState(false);

  const apiUrl = import.meta.env.VITE_API_URL; 

  useEffect(() => {
    axios
      .get(`${apiUrl}/notices/?position=all&target=all`)
      .then((res) => {
        const data = res.data.results || res.data; // handles pagination or not
        if (Array.isArray(data)) {
          setNotices(data.slice(0, 5)); // show first 5 notices
          // setShowALlNotice(data); // show first 5 notices
        }
      })
      .catch((err) => {
        console.error("Notice fetch error:", err);
      });
  }, []);

  const handleNoticeClick = async (slug) => {
    try {
      const res = await axios.get(`${apiUrl}/notices/${slug}/`);
      setIsModalOpen(!isModalOpen);
      setSelectedNotice(res.data);
    } catch (err) {
      console.error("Failed to load notice details:", err);
    }
  };

  const handleModalClose = () => {
    setShowALlNotice(false);
    setIsModalOpen(false);
    // updateWebsiteVars('notice',!websiteVars.notice);
  };
  const showAllNotice = () => {
    // console.log("Show all notice" );
    setIsModalOpen(!isModalOpen);
    setShowALlNotice(!showALlNotice);
  };

  return (
    <div className="space-y-0">
      <div className="notice-header">
        <h2>🗒️ নোটিশ বোর্ড</h2>
      </div>

      {notices.length === 0 && (
        <p className="text-sm text-gray-500">কোনো নোটিশ পাওয়া যায়নি</p>
      )}
      
      <div className="notices">
        {notices.map((notice) => (
          <div
            className={`notice-row ${notice.pin_on_top ? 'pinned' : ''}`}
            onClick={() => handleNoticeClick(notice.slug)}
            key={notice.id}
          >
            <div
              className={`notice-board-item ${notice.is_important ? 'important' : ''}`}
              onClick={() => handleNoticeClick(notice.slug)}
            >
              <ArrowRightIcon className="w-5 h-5 min-w-5" />
              <span> {notice.title} </span>
            </div>

            <div
              className="single-notice-details-button"
              onClick={() => handleNoticeClick(notice.slug)}
            >
              <EyeIcon className="w-5 h-5" />
              <span>দেখুন</span>
            </div>
          </div>
        ))}
      </div>


      <div className="see-all-notice-btn">
        {/* <button className="button-1" onClick={() => updateWebsiteVars('notice',true)} >সকল বিজ্ঞপ্তি</button> */}
        <button className="button-1" onClick={() => showAllNotice(true)} >সকল বিজ্ঞপ্তি</button>
      </div>

      {selectedNotice && (
        <FullScreenModal isOpen={isModalOpen} onClose={handleModalClose}>
          <NoticeDetails
            notice={selectedNotice}
            onClose={() => {
              setSelectedNotice(null);
              setIsModalOpen(!isModalOpen);
            }}
          />
        </FullScreenModal>
      )}

      {/* {websiteVars.notice && (
        <FullScreenModal isOpen={websiteVars.notice} onClose={handleModalClose}> 
          <NoticeBoard/>
        </FullScreenModal>
      )} */}

      {showALlNotice && (
        <FullScreenModal isOpen={isModalOpen} onClose={handleModalClose}> 
          <NoticeBoard/>
        </FullScreenModal>
      )}
    </div>
  );
};

export default NoticeList;
