import "./recent-bulletin.scss";
import { useEffect, useState } from "react";
import axios from "axios";
import FullScreenModal from "../../pages/00-page-components/02_full_screen_window";
import NoticeDetails from "../recent/NoticeDetails";

const phrases = [
  "শিক্ষার আলোয় উজ্জ্বল ভবিষ্যৎ, আমাদের প্রতিশ্রুতি",
  "জ্ঞান, নৈতিকতা ও উৎকর্ষের পথে আমরা",
  "আধুনিক শিক্ষা, মূল্যবোধের ভিত্তি",
  "স্বপ্নকে বাস্তবে রূপ দিতে আমরা সঙ্গী",
  "শিক্ষার মাধ্যমে গড়ে উঠুক নতুন প্রজন্ম",
  "মানসম্মত শিক্ষা, সফলতার প্রথম পদক্ষেপ",
  "শিক্ষা ও সংস্কৃতির মেলবন্ধনে আমরা",
  "জ্ঞানের আলো ছড়িয়ে দিচ্ছি প্রতিটি মনে",
];

const RecentBulletin = () => {
  const [recentBulletin, setRecentBulletin] = useState([]);
  const apiUrl = import.meta.env.VITE_API_URL;
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedNotice, setSelectedNotice] = useState(null);

  useEffect(() => {
    axios
      .get(`${apiUrl}/notices/?position=homepage&target=all`)
      .then((res) => {
        // console.log("res.data.results || res.data: ", res.data);
        const data = res.data.results || res.data; // handles pagination or not
        if (Array.isArray(data)) {
          setRecentBulletin(data.slice(0, 5)); // show first 5 notices
        }
      })
      .catch((err) => {
        console.error("Notice fetch error:", err);
      });
  }, []);

  const handleNoticeClick = async (slug) => {
    try {
      console.error("slug:", slug);
      const res = await axios.get(`${apiUrl}/notices/${slug}/`);
      console.log("notice details before:", res);
      setIsModalOpen(!isModalOpen);
      setSelectedNotice(res.data);
    } catch (err) {
      console.error("Failed to load notice details:", err);
    }
  };

  const handleModalClose = () => {
    setIsModalOpen(!isModalOpen);
  };

  return (
    <div className="container">
      <div className="  slider-separator">
        <div className="recent-bulletin-headin">
          <h2> সাম্প্রতিক</h2>
        </div>

        {recentBulletin.length === 0 && (
          <p className="text-sm text-gray-500">কোনো নোটিশ পাওয়া যায়নি</p>
        )}

        {/* <marquee behavior="scroll" direction="left">
          <div className="bulletin-text-and-separator ">
            {recentBulletin.map((notice, index) => (
              <div
                key={index}
                className="bulletin-text"
                onClick={() => handleNoticeClick(notice.slug)}
              >
                {notice.title}
                <span> | </span>
              </div>
            ))}
          </div>
        </marquee> */}

        <div className="marquee-container" onClick={() => {/* Optional click handler */}}>
          <div className="marquee">
            <div className="marquee-content">
              {recentBulletin.map((notice, index) => (
                <div
                  key={index}
                  className="bulletin-text"
                  onClick={() => handleNoticeClick(notice.slug)}
                >
                  {notice.title}
                  <span> | </span>
                </div>
              ))}
              {/* Duplicate for seamless loop */}
              {recentBulletin.map((notice, index) => (
                <div
                  key={`duplicate-${index}`}
                  className="bulletin-text"
                  onClick={() => handleNoticeClick(notice.slug)}
                >
                  {notice.title}
                  <span> | </span>
                </div>
              ))}
            </div>
          </div>
        </div>



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
    </div>
  );
};

export default RecentBulletin;
