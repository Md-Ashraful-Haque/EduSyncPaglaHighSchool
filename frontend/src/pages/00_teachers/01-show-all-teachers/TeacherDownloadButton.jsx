import { useRef, useState } from "react";
import { useReactToPrint } from "react-to-print"; 
import { ArrowDownIcon,ArrowDownTrayIcon } from "@heroicons/react/24/solid";
import { doGetAPIcall } from "Utils/utilsFunctions/UtilFuntions"; 
import TeacherPrintPage from "../../00-page-components/printableComponent/TeacherPrintPage";
import { useAppContext } from "ContextAPI/AppContext";

export default function TeacherDownloadButton({ showText,details, teacherId = null }) {
  const contentRef = useRef(null);
  const [teachers, setTeachers] = useState([]);
  const [loading, setLoading] = useState(false);
  const { createNewAccessToken,instituteInfo } = useAppContext();

  const handleDownload = async () => {
    setLoading(true);
    try {
      let response;

      if (teacherId) {
        // ✅ Fetch only one teacher
        response = await doGetAPIcall(
          createNewAccessToken,
          `teachers/${teacherId}`, // Single teacher endpoint
          {}
        );
        // console.log(response);
        setTeachers([response]); // Wrap in array for print-loop
      } else {
        // ✅ Fetch all teachers
        const requestData = {
          page: 1,
          itemPerPage: 5000,
        };
        response = await doGetAPIcall(createNewAccessToken, "teachers", requestData);
        setTeachers(response.results || response);
      }

      setTimeout(() => printPDF(), 400);
    } catch (error) {
      console.error("PDF fetch failed", error);
      alert("Failed to fetch teacher(s) for PDF download");
    }
    setLoading(false);
  };

  const printPDF = useReactToPrint({
    contentRef, 
    documentTitle: teacherId ? "Teacher Information" : "All Teachers Information",
    pageStyle: `
      @page { size: A4; margin: 10mm; }
      body { font-family: Arial; }
    `,
  });

  return (
    <>
      <button
        onClick={handleDownload}
        disabled={loading}
        className="group flex items-center px-3 sm:px-3 py-2 text-sm font-medium text-gray-700 hover:text-purple-700 hover:bg-purple-100 disabled:opacity-50"
      >
        <div className="flex items-center space-x-3">
          <div className="border border-purple-700 rounded-full p-1.5 group-hover:border-white group-hover:bg-white/20 transition-all duration-300">
            <ArrowDownTrayIcon className="w-4 h-4 text-purple-700 group-hover:text-purple-700" />
          </div>
          {showText && (
            <span className="font-semibold text-xs lg:text-sm">
              {/* {loading ? "Loading..." : teacherId ? "" : details ? "ডাউনলোড করুন" : "সংক্ষিপ্ত"}  */}
              {loading ? "Loading..." : teacherId ? "" : details ? "বিস্তারিত" : "সংক্ষিপ্ত"} 
            </span>
          )}
        </div>
      </button>

      <div className="print-container">
        <TeacherPrintPage ref={contentRef} teachers={teachers} instituteInfo={instituteInfo} />
      </div>
    </>
  );
}

