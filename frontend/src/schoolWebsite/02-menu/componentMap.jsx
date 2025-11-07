// componentMap.js
import ContactInfo from "schoolWebsite/08-contact-info/ContactInfo";
import HistoryOfInstitute from "schoolWebsite/06-history-of-institute/HistoryOfInstitute";
import StudentStatistics from "../09-student-statistics/StudentStatistics";
import NoticeBoard from "../recent/NoticeBoard";
import TeacherInfo from "../10-teacher-info/TeacherInfo";

// import HistoryContent from "../06-history-of-institute/HistoryOfInstitute"; 
import HistoryPage from "../06-history-of-institute/HistoryPage"; 
import ManagingCommitteePage from '../07-managing-committee/ManagingCommitteePage'
import InstituteApproval from "../12-institute-approval/InstituteApproval"; 

export const componentMap = {
  "contact-address": ContactInfo,
  "history": HistoryOfInstitute,
  "school-history": HistoryPage,
  "number-of-students-studying": StudentStatistics,
  "notices": NoticeBoard,
  "managing-committee": ManagingCommitteePage,
  "staff": TeacherInfo,
  "photo-gallery": NoticeBoard,
  "video-gallery": NoticeBoard,
  "permission-and-recognition-of-teaching-in-the-institution": InstituteApproval,
  "category-wise-approved-branch-information": NoticeBoard,
  "our-faculty": TeacherInfo,
  "routine": NoticeBoard,
  "view-results": NoticeBoard,
  "admission-information": NoticeBoard,
  "download-admit-card": NoticeBoard,
  "online-admission": NoticeBoard, 
  "offline-admission-form": NoticeBoard,
  
};
