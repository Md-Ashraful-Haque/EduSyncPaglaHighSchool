import { useState } from "react";
import PropTypes from "prop-types";
// import { ArrowRightIcon } from "lucide-react"; // or any icon source you're using
// import FullScreenModal from "./FullScreenModal"; // replace with your actual modal component
// import HistoryContent from "./HistoryContent"; // replace with your actual content component

import FullScreenModal from "../../pages/00-page-components/02_full_screen_window";
import { ArrowRightIcon, EyeIcon } from "@heroicons/react/24/outline";


const CommitteeList = ({ committees }) => {
  const [selectedCommittee, setSelectedCommittee] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleModalOpen = (committee) => {
    setSelectedCommittee(committee);
    setIsModalOpen(true);
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
    setSelectedCommittee(null);
  };

  const HistoryContent = ({ committee, showFull, onToggle }) => (
    <div className="row">
      <div className="col-ms-12 col-md-4">
        {committee.image_url && (
          <div className="person-image">
            <img
              src={committee.image_url}
              alt={committee.title}
              style={{ maxWidth: "100%" }}
            />
          </div>
        )}
      </div>

      <div className="col-ms-12 col-md-8">
        {showFull ? (<p className="name">{committee.message}</p>) :( <div className="message-from-person">{ committee.name }</div>)}
        <button className="button-1-inv" onClick={onToggle}>
          {showFull ? "কম দেখুন" : "বিস্তারিত"}
        </button>
      </div>
    </div>
  );

  return (
    <>
      {committees.map((committee, index) => (
        <div key={index} className="committee-card">
          <div className="notice-header">
            <h2>{committee.title}</h2>
          </div>

          <div className="committee-person">
            <div
              className="committee-bg-image"
              style={{
                backgroundImage: `url(${committee.image_url})`,
              }}
            ></div>
            <div className="name">{committee.name}</div>
            <div className="designation">{committee.designation}</div>
            <div className="button-1-inv-sm msg-btn" onClick={() => handleModalOpen(committee)}>
              বিস্তারিত
              <ArrowRightIcon className="w-5 h-5 min-w-5 pl-1" />
            </div>
          </div>
        </div>
      ))}

      {isModalOpen && selectedCommittee && (
        <FullScreenModal isOpen={isModalOpen} onClose={handleModalClose}>
          <div className="history-full-window">
            <HistoryContent
              committee={selectedCommittee}
              showFull={true}
              onToggle={handleModalClose}
            />
          </div>
        </FullScreenModal>
      )}
    </>
  );
};

CommitteeList.propTypes = {
  committees: PropTypes.arrayOf(
    PropTypes.shape({
      title: PropTypes.string,
      image_url: PropTypes.string,
      name: PropTypes.string,
      designation: PropTypes.string,
    })
  ).isRequired,
};

export default CommitteeList;
