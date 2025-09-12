import React, { useEffect, useState } from "react";
import axios from "axios";
// import './NoticeBoard.scss';
import { ArrowRightIcon, EyeIcon } from "@heroicons/react/24/outline";
const apiUrl = import.meta.env.VITE_API_URL;
import FullScreenModal from "../../pages/00-page-components/02_full_screen_window";
import NoticeDetails from "./NoticeDetails";

const getBanglaAudience = (audience) => {
  const map = {
    all: 'সকল',
    students: 'শিক্ষার্থী',
    teachers: 'শিক্ষক',
    staff: 'কর্মচারি',
    parents: 'অভিভাবক',
  };

  return map[audience] || audience;
};


const NoticeBoard = () => {
  const [notices, setNotices] = useState([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");
  const [audience, setAudience] = useState("all");
  const [position, setPosition] = useState("all");
  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState({
    count: 0,
    next: null,
    previous: null,
  });

  const [isModalOpen, setIsModalOpen] = useState(false);

  const [selectedNotice, setSelectedNotice] = useState(null);

  const fetchNotices = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${apiUrl}/all-notices/`, {
        params: {
          search: search,
          target: audience,
          position: position,
          page: page,
        },
      });

      const data = response.data.results || response.data;
      setNotices(data);
      setPagination({
        count: response.data.count || data.length,
        next: response.data.next,
        previous: response.data.previous,
      });
    } catch (err) {
      console.error("Notice fetch errordd:", err);
    }
    setLoading(false);
  };

  useEffect(() => {
    console.log("active useEffect");
    fetchNotices();
  }, [search, audience, position, page]);

  const handleSearch = (e) => {
    e.preventDefault();
    setPage(1);
    fetchNotices();
  };

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
    setIsModalOpen(!isModalOpen);
  };

  return (
    <div className="notice-board">
      <h2>নোটিশ বোর্ড</h2>
      <p className="subtitle">সর্বশেষ আপডেট এবং গুরুত্বপূর্ণ নোটিশ</p>

      <form className="notice-filters" onSubmit={handleSearch}>
        <input
          type="text"
          placeholder="শিরোনাম দিয়ে খুঁজুন..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        <select value={audience} onChange={(e) => setAudience(e.target.value)}>
          <option value="all">সকল</option>
          <option value="students">শিক্ষার্থী</option>
          <option value="teachers">শিক্ষক</option>
          <option value="staff">কর্মচারি</option>
          <option value="parents">অভিভাবক</option>
        </select>

        {/* <select value={position} onChange={(e) => setPosition(e.target.value)}>
          <option value="all">সকল স্থানে</option>
          <option value="homepage">হোমপেজ</option>
          <option value="dashboard">ড্যাশবোর্ড</option>
          <option value="noticeboard">নোটিশ বোর্ড</option>
        </select> */}

        {/* <button type="submit">ফিল্টার</button> */}
      </form>

      {loading ? (
        <div className="loading-spinner">লোড হচ্ছে...</div>
      ) : (
        <>
          <table>
            <thead>
              <tr>
                <th>ক্রমিক</th>
                <th>তারিখ</th>
                <th>শিরোনাম</th>
                <th>বিস্তারিত</th>
              </tr>
            </thead>
            <tbody>
              {notices.map((notice, index) => (
                <tr key={notice.id}>
                  <td>{(page - 1) * 10 + index + 1}</td>
                  <td>
                    {new Date(notice.published_at).toLocaleDateString("bn-BD", {
                      day: "2-digit",
                      month: "long",
                      year: "numeric",
                    })}
                  </td>
                  <td>{notice.title}- ( <span style={{color: "gray"}}> {getBanglaAudience(notice.target_audience)} </span> ) </td>
                  <td>
                    <div
                      className="show-single-notice"
                      onClick={() => handleNoticeClick(notice.slug)}
                    >
                      <EyeIcon className="w-5 h-5" />
                      <span>দেখুন</span>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {pagination.count === 0 && <p>নোটিশ পাওয়া যায়নি।</p>}

          <div className="pagination">
            {pagination.previous && (
              <button onClick={() => setPage(page - 1)}>আগে</button>
            )}

            {(() => {
              const pageSize = 10; // your per-page result count
              const totalPages = Math.ceil(pagination.count / pageSize);
              const visiblePages = 10;

              let start = Math.max(1, page - Math.floor(visiblePages / 10));
              let end = start + visiblePages - 1;

              if (end > totalPages) {
                end = totalPages;
                start = Math.max(1, end - visiblePages + 1);
              }

              const buttons = [];

              if (start > 1) {
                buttons.push(
                  <button key={1} onClick={() => setPage(1)}>
                    1
                  </button>,
                  <span key="start-ellipsis">...</span>
                );
              }

              for (let i = start; i <= end; i++) {
                buttons.push(
                  <button
                    key={i}
                    onClick={() => setPage(i)}
                    className={page === i ? "active" : ""}
                  >
                    {i}
                  </button>
                );
              }

              if (end < totalPages) {
                buttons.push(
                  <span key="end-ellipsis">...</span>,
                  <button key={totalPages} onClick={() => setPage(totalPages)}>
                    {totalPages}
                  </button>
                );
              }

              return buttons;
            })()}

            {pagination.next && (
              <button onClick={() => setPage(page + 1)}>পরে</button>
            )}
          </div>
        </>
      )}

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

export default NoticeBoard;
