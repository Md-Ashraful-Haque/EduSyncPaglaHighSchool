import { renderToString } from "react-dom/server";
import PropTypes from "prop-types";
// import TabulationSheetWithNewTab from "./03_tabulation_sheet_with_new_tab"; 
import { ResultContextAPIProvider } from "ContextAPI/MarksInputBySubjectContext";
import ShowDataBeforePrint from "./ShowDataBeforePrint";
// import { useMarksInputBySubjectContext } from "ContextAPI/MarksInputBySubjectContext";
import "./Attendance.scss";
const PrintPage = ({
  students, 
  instituteInfo,
  shiftToYearInfo,
  date 
}) => {
  const openInNewTab = () => {
    // Get the current page's head content (includes CSS, JS, meta tags, etc.)
    const headContent = document.head.innerHTML;
    // const { shiftToYearInfo, updateshiftToYearInfo } = useMarksInputBySubjectContext();
    // Render the TabulationSheet component to static HTML

    const renderedContent = renderToString(
      <ResultContextAPIProvider  >
        <ShowDataBeforePrint
          students={students} 
          instituteInfo={instituteInfo}  
          shiftToYearInfo={shiftToYearInfo}
          date={date}
        />  
      </ResultContextAPIProvider>
    );

    // Open a new tab
    
    const newTab = window.open("", "_blank");

    if (newTab) {
      // Write the full HTML structure to the new tab
      newTab.document.write(`
        <!DOCTYPE html>
        <html>
          <head>
            ${headContent}
            

          </head>
          <body>
            <div class="admit-card-container">
              ${renderedContent}
            </div>
            <script>
            document.title = "Attendance_${shiftToYearInfo?.year}_${shiftToYearInfo?.shift}_${shiftToYearInfo?.class.class_name}_${shiftToYearInfo?.section.section_name}_${shiftToYearInfo?.group.group_name_bengali} ";
              
              window.onload = function () {
                window.print();
              };
            </script>
          </body>
        </html>
      `);

      newTab.document.close(); // Ensure the document is finalized
      // Add event listener for afterprint
      newTab.addEventListener('afterprint', () => {
        newTab.close(); // Close the tab after printing
      });
    } else {
      alert("Please allow pop-ups for this website.");
    }
  };

  return (
    <button onClick={openInNewTab} className="button-1">
      প্রিন্ট করুন
    </button>
  );
};

PrintPage.propTypes = {
  firstStudent: PropTypes.node,
  examAndInstituteInfo: PropTypes.object.isRequired,
  showBangla: PropTypes.func.isRequired,
  results: PropTypes.array.isRequired,
  highest_marks: PropTypes.object.isRequired,
  all_subject: PropTypes.object.isRequired,
  shiftToYearInfo: PropTypes.object.isRequired,
};

export default PrintPage;
