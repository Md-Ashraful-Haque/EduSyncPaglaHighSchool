import "./ManagingCommittee.scss";

import { useEffect, useState } from "react";
import axios from "axios";

import FullScreenModal from "../../pages/00-page-components/02_full_screen_window";
import { ArrowRightIcon, EyeIcon } from "@heroicons/react/24/outline";
import CommitteeList from './CommitteeList'
const ManagingCommittee = () => {
  const [notices, setNotices] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [showFull, setShowFull] = useState(false);
  const [committees, setCommittees] = useState(null);

  const [showALlNotice, setShowALlNotice] = useState(false);

  const apiUrl = import.meta.env.VITE_API_URL;
  const instituteId = import.meta.env.VITE_INSTITUTE_CODE;
  // const instituteId = "PHS";
  // console.log("His data", instituteId);

  useEffect(() => {
    if (!instituteId) return; // skip call if not available

    // setLoading(true);
    axios
      .get(`${apiUrl}/managing-committee/`, {
        params: {
          institute: instituteId, // pass institute ID here
        },
      })
      .then((res) => {
        const data = res.data.results || res.data;
        if (Array.isArray(data)) {
          // setHistory(data);
          // console.log("data[0]: ", data[0])
          setCommittees(data);
          // setCommittees(data[0]);
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
  
  // const HistoryContent = ({ committee, showFull, onToggle }) => (
  //   <div className="row">
  //     <div className="col-ms-12 col-md-4">
  //       {committee.image_url && (
  //         <div className="person-image">
  //           <img
  //             src={committee.image_url}
  //             alt={committee.title}
  //             style={{ maxWidth: "100%" }}
  //           />
  //         </div>
  //       )}
  //     </div>

  //     <div className="col-ms-12 col-md-8">
  //       {showFull ? (<p className="name">{committee.message}</p>) :( <div className="message-from-person">{ committee.name }</div>)}
  //       <button className="button-1-inv" onClick={onToggle}>
  //         {showFull ? "কম দেখুন" : "বিস্তারিত"}
  //       </button>
  //     </div>
  //   </div>
  // );

  return (
    <div className="space-y-0">
      {committees ? (
        <CommitteeList committees={committees} />
        // <>
        //   <div className="notice-header">
        //     <h2>{committee.title}</h2>
        //   </div>

        //   <div className="committee-person">
            
        //     <div
        //       className="committee-bg-image"
        //       style={{
        //         backgroundImage: `url(${committee.image_url})`,
                
        //       }}
        //     ></div>
        //     <div className="name">{committee.name}</div>
        //     <div className="designation">{committee.designation}</div>
        //     <div className="button-1-inv-sm msg-btn" onClick={handleModalClose}> 
        //       বিস্তারিত
        //       <ArrowRightIcon className="w-5 h-5 min-w-5 pl-1" />
        //     </div>
        //   </div>

        //   {showFull && (
        //     <FullScreenModal isOpen={isModalOpen} onClose={handleModalClose}>
        //       <div className="history-full-window">
        //         <HistoryContent
        //           committee={committee}
        //           showFull={true}
        //           onToggle={handleModalClose}
        //         />
        //       </div>
        //     </FullScreenModal>
        //   )}
        // </>
      ) : (
        <p>লোড হচ্ছে বা তথ্য পাওয়া যায়নি।</p>
      )}
    </div>
  );
};

export default ManagingCommittee;
