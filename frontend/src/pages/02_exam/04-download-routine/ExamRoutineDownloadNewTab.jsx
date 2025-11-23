import { renderToString } from "react-dom/server";
import PropTypes from "prop-types";
// import TabulationSheetWithNewTab from "./03_tabulation_sheet_with_new_tab"; 
import { ResultContextAPIProvider } from "ContextAPI/MarksInputBySubjectContext";
import ExamRoutineDownloadPrinter from "./ExamRoutineDownloadPrinter";
const OpenNewTabWithHeader = ({
  students,
  studentsCommonInfo,
  HeadSignature,
  instituteInfo,
  examRoutine={examRoutine}
}) => {
  const openInNewTab = () => {
    // Get the current page's head content (includes CSS, JS, meta tags, etc.)
    const headContent = document.head.innerHTML;
    
    // Render the TabulationSheet component to static HTML

    const renderedContent = renderToString(
      <ResultContextAPIProvider  >
        <ExamRoutineDownloadPrinter
          students={students}
          studentsCommonInfo={studentsCommonInfo}
          HeadSignature={HeadSignature}
          instituteInfo={instituteInfo}
          examRoutine={examRoutine}
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
              document.title = "ExamRoutine_${studentsCommonInfo?.year}_${studentsCommonInfo?.shift}_${studentsCommonInfo?.class}_${studentsCommonInfo?.section}_${studentsCommonInfo?.group_name_bengali} ";
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

OpenNewTabWithHeader.propTypes = {
  firstStudent: PropTypes.node,
  examAndInstituteInfo: PropTypes.object.isRequired,
  showBangla: PropTypes.func.isRequired,
  results: PropTypes.array.isRequired,
  highest_marks: PropTypes.object.isRequired,
  all_subject: PropTypes.object.isRequired,
  bySubjectVars: PropTypes.object.isRequired,
};

export default OpenNewTabWithHeader;
