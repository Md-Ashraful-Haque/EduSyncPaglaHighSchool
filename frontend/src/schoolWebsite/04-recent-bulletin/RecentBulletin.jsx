

// import "./recent-bulletin.scss";
// import { useEffect, useRef, useState } from "react";
// import axios from "axios";
// import FullScreenModal from "../../pages/00-page-components/02_full_screen_window";
// import NoticeDetails from "../recent/NoticeDetails";

// const RecentBulletin = () => {
//   const [recentBulletin, setRecentBulletin] = useState([]);
//   const apiUrl = import.meta.env.VITE_API_URL;
//   const [isModalOpen, setIsModalOpen] = useState(false);
//   const [selectedNotice, setSelectedNotice] = useState(null);

//   const marqueeContentRef = useRef(null);
//   const [duration, setDuration] = useState(15); // fallback
//   const repeatCount = 10; // repeat notices to make smooth loop

//   // Fetch notices
//   useEffect(() => {
//     axios
//       .get(`${apiUrl}/notices-marquee/?is_marquee=True`)
//       .then((res) => {
//         const data = res.data.results || res.data;
//         if (Array.isArray(data)) {
//           setRecentBulletin(data.slice(0, 5)); // show first 5
//         }
//       })
//       .catch((err) => {
//         console.error("Notice fetch error:", err);
//       });
//   }, []);

//   // Dynamically calculate scroll duration
//   useEffect(() => {
//     if (marqueeContentRef.current && recentBulletin.length > 0) {
//       const totalWidth = marqueeContentRef.current.scrollWidth;
//       const singleLoopWidth = totalWidth / repeatCount; // width of one logical set
//       const containerWidth =
//         marqueeContentRef.current.parentElement.offsetWidth;

//       const speed = 200; // px per sec
//       const time = (singleLoopWidth + containerWidth) / speed;

//       setDuration(time);
//     }
//   }, [recentBulletin]);

//   const handleNoticeClick = async (slug) => {
//     try {
//       const res = await axios.get(`${apiUrl}/notices/${slug}/`);
//       setIsModalOpen(true);
//       setSelectedNotice(res.data);
//     } catch (err) {
//       console.error("Failed to load notice details:", err);
//     }
//   };

//   const handleModalClose = () => {
//     setIsModalOpen(false);
//     setSelectedNotice(null);
//   };

//   return (
//     <div className="container">
//       <div className="slider-separator">
//         <div className="recent-bulletin-headin">
//           <h2>সাম্প্রতিক</h2>
//         </div>

//         {recentBulletin.length === 0 && (
//           <p className="text-sm text-gray-500 w-full p-0 m-0">
//             কোনো নোটিশ পাওয়া যায়নি
//           </p>
//         )}

//         <div className="marquee-container">
//           <div
//             className="marquee"
//             style={{ "--scroll-duration": `${duration}s` }}
//           >
//             <div className="marquee-content" ref={marqueeContentRef}>
//               {[...Array(repeatCount)].map((_, i) =>
//                 recentBulletin.map((notice, index) => (
//                   <div
//                     key={`${i}-${index}`}
//                     className="bulletin-text"
//                     onClick={() => handleNoticeClick(notice.slug)}
//                   >
//                     {notice.title}
//                   </div>
//                 ))
//               )}
//             </div>
//           </div>
//         </div>
//       </div>

//       {selectedNotice && (
//         <FullScreenModal isOpen={isModalOpen} onClose={handleModalClose}>
//           <NoticeDetails notice={selectedNotice} onClose={handleModalClose} />
//         </FullScreenModal>
//       )}
//     </div>
//   );
// };

// export default RecentBulletin;


import "./recent-bulletin.scss";
import { useEffect, useRef, useState } from "react";
import axios from "axios";
import FullScreenModal from "../../pages/00-page-components/02_full_screen_window";
import NoticeDetails from "../recent/NoticeDetails";

const RecentBulletin = () => {
  const [recentBulletin, setRecentBulletin] = useState([]);
  const apiUrl = import.meta.env.VITE_API_URL;
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedNotice, setSelectedNotice] = useState(null);

  const marqueeContainerRef = useRef(null);
  const marqueeContentRef = useRef(null);
  const [duration, setDuration] = useState(15); // fallback
  const [repeatCount, setRepeatCount] = useState(10); // dynamic repeat count

  // Fetch notices
  useEffect(() => {
    axios
      .get(`${apiUrl}/notices-marquee/?is_marquee=True`)
      .then((res) => {
        const data = res.data.results || res.data;
        if (Array.isArray(data)) {
          setRecentBulletin(data.slice(0, 5)); // show first 5
        }
      })
      .catch((err) => {
        console.error("Notice fetch error:", err);
      });
  }, []);

  // Calculate optimal marquee parameters after notices are loaded
  useEffect(() => {
    if (marqueeContentRef.current && recentBulletin.length > 0) {
      // Wait a bit for DOM to update
      setTimeout(() => {
        const containerWidth = marqueeContainerRef.current?.offsetWidth || 0;
        const totalWidth = marqueeContentRef.current?.scrollWidth || 0;
        const singleSetWidth = totalWidth / repeatCount; // width of current set

        if (containerWidth > 0 && singleSetWidth > 0) {
          // Calculate optimal repeat count (minimum 2 for smooth loop)
          const optimalRepeatCount = Math.max(2, Math.ceil((containerWidth * 2) / singleSetWidth));
          
          // Only update if different to avoid infinite loop
          if (optimalRepeatCount !== repeatCount) {
            setRepeatCount(optimalRepeatCount);
            return; // let it recalculate with new repeat count
          }

          // Calculate duration based on movement distance
          const singleLoopWidth = singleSetWidth;
          const speed = 80; // px per sec (slower for better readability)
          const time = (singleLoopWidth + containerWidth) / speed;

          setDuration(time);
        }
      }, 100);
    }
  }, [recentBulletin, repeatCount]);

  const handleNoticeClick = async (slug) => {
    try {
      const res = await axios.get(`${apiUrl}/notices/${slug}/`);
      setIsModalOpen(true);
      setSelectedNotice(res.data);
    } catch (err) {
      console.error("Failed to load notice details:", err);
    }
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
    setSelectedNotice(null);
  };

  return (
    <div className="container">
      <div className="slider-separator">
        <div className="recent-bulletin-headin">
          <h2>সাম্প্রতিক</h2>
        </div>

        {recentBulletin.length === 0 && (
          <p className="text-sm text-gray-500 w-full p-0 m-0">
            কোনো নোটিশ পাওয়া যায়নি
          </p>
        )}

        <div className="marquee-container" ref={marqueeContainerRef}>
          <div
            className="marquee"
            style={{ "--scroll-duration": `${duration}s` }}
          >
            <div className="marquee-content" ref={marqueeContentRef}>
              {[...Array(repeatCount)].map((_, i) =>
                recentBulletin.map((notice, index) => (
                  <div
                    key={`${i}-${index}`}
                    className="bulletin-text"
                    onClick={() => handleNoticeClick(notice.slug)}
                  >
                    {notice.title}
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>

      {selectedNotice && (
        <FullScreenModal isOpen={isModalOpen} onClose={handleModalClose}>
          <NoticeDetails notice={selectedNotice} onClose={handleModalClose} />
        </FullScreenModal>
      )}
    </div>
  );
};

export default RecentBulletin;