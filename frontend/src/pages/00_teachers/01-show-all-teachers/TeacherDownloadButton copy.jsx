import { useRef, useState } from "react";
import { useReactToPrint } from "react-to-print"; 
import { ArrowDownIcon } from "@heroicons/react/24/solid";
import { doGetAPIcall } from "Utils/utilsFunctions/UtilFuntions"; 
import TeacherPrintPage from "../../00-page-components/printableComponent/TeacherPrintPage";
import { useAppContext } from "ContextAPI/AppContext";

export default function TeacherDownloadButton({showText}) {
  const contentRef = useRef(null);  // ✅ React-to-print target
  const [teachers, setTeachers] = useState([]);
  const [loading, setLoading] = useState(false);
  const { createNewAccessToken } = useAppContext();

  const handleDownload = async () => {
    setLoading(true);
    try {
      const requestData = {
        page: 1,
        itemPerPage: 5000, // ✅ Fetch all (no pagination)
      };

      const response = await doGetAPIcall(
        createNewAccessToken,
        "teachers", // ✅ Endpoint
        requestData
      );

      setTeachers(response.results || response); // Support paginated or full JSON
      setTimeout(() => printPDF(), 400); // Wait for component to render
    } catch (error) {
      console.error("PDF fetch failed", error);
      alert("Failed to fetch teachers for PDF download");
    }
    setLoading(false);
  };

  // ✅ Latest API format for react-to-print v3+
  const printPDF = useReactToPrint({
    contentRef,  // ✅ Key fix
    documentTitle: "Teachers Information",
    pageStyle: `
      @page { size: A4; margin: 10mm; }
      body { font-family: Arial; }
    `,
  });

  return (
    <>
      {/* <button
        onClick={handleDownload}
        disabled={loading}
        className="flex items-center px-3 py-2 text-sm bg-purple-600 text-white rounded hover:bg-purple-700 disabled:opacity-50"
      >
        <ArrowDownIcon className="w-4 h-4 mr-2" />
        {loading ? "Loading..." : "Download"}
      </button> */}

      <button 
        onClick={handleDownload} 
        // disabled={!vars.is_staff}
        disabled={loading}
        className="group  flex items-center px-2 sm:px-3 py-2 text-sm font-medium text-gray-700 hover:text-purple-700 hover:bg-purple-100 hover:from-blue-500 hover:to-blue-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 border-r border-gray-200 "
      >
        <div className="flex items-center space-x-3">
          <div className="border border-purple-700 rounded-full p-1.5 group-hover:border-white group-hover:bg-white/20 transition-all duration-300">
            <ArrowDownIcon className="w-4 h-4 text-purple-700 group-hover:text-purple-700" /> 
            
          </div>
          
          {showText &&(
            <span className="font-semibold text-xs lg:text-sm ">
              {loading ? "Loading..." : "সকল তথ্য ডাউনলোড করুন"}
            </span>
          )}
        </div>
      </button>

      {/* ✅ Printable component kept off-screen instead of display:none */}
      <div className="print-container">
        <TeacherPrintPage ref={contentRef} teachers={teachers} />
      </div>

    </>
  );
}
