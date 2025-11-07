import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { MegaphoneIcon } from "@heroicons/react/24/solid";
import axios from "axios";
import "./NoticeBoardPreview.scss";

const NoticeBoardPreview = () => {
  const [notices, setNotices] = useState([]);
  const apiUrl = import.meta.env.VITE_API_URL;

  useEffect(() => {
    axios
      .get(`${apiUrl}/recent-notice/?position=all`, {
        withCredentials: true,
      })
      .then((res) => {
        setNotices(res.data.slice(0, 7)); // Show top 7
        console.log("res.data.slice(0, 7): ", res.data.slice(0, 7))
        // setNotices(res.data.slice(0, 7)); // Show top 7
      })
      .catch((err) => console.error("Notice fetch error:", err));
  }, []);

  return (
    <div className="notice-board-preview">
      <div className="notice-header">
        <MegaphoneIcon className="notice-icon" />
        <h3 className="notice-title">নোটিশ বোর্ড</h3>
        <Link to="/notices" className="notice-view-all">সব দেখুন</Link>
      </div>

      <ul className="notice-list">
        {notices.map((notice) => (
          <li key={notice.id} className="notice-item">
            <Link to={`/notices/${notice.slug}`} className="notice-link">
              {notice.title}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default NoticeBoardPreview;
