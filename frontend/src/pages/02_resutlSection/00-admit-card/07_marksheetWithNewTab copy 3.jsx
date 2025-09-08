import { renderToString } from "react-dom/server";
import PropTypes from "prop-types";
// import TabulationSheetWithNewTab from "./03_tabulation_sheet_with_new_tab"; 
import { ResultContextAPIProvider } from "ContextAPI/MarksInputBySubjectContext";
import AdmitCardPrinter from "./AdmitCardPrinter";
const OpenNewTabWithHeader = ({
  students,
  studentsCommonInfo,
  HeadSignature,
  instituteInfo,
}) => {
  const openInNewTab = () => {
    // Get the current page's head content (includes CSS, JS, meta tags, etc.)
    const headContent = document.head.innerHTML;

    // Render the TabulationSheet component to static HTML

    const renderedContent = renderToString(
      <ResultContextAPIProvider  >
        <AdmitCardPrinter
          students={students}
          studentsCommonInfo={studentsCommonInfo}
          HeadSignature={HeadSignature}
          instituteInfo={instituteInfo}
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
            <style>
              @media print {
                @page {
                  margin: 0 !important;
                }
                html, body {
                  margin: 0 !important;
                  padding: 0 !important;
                  width: 100%;
                  height: 100%;
                  background-color: red !important;
                  -webkit-print-color-adjust: exact !important;
                  print-color-adjust: exact !important;
                }
                .single-marksheet {
                  margin: 0 !important;
                  padding: 0 !important;
                  width: 100% !important;
                  height: 100% !important;
                  background-color: green !important;
                }
              }
            </style>
          </head>
          <body>
            <div class="single-marksheet">
              jsfkdla jsdafl kjsadlf kjsadflk jasdflk jasdlfkj asdlfkj saldfkj sladkfj lsadkfj lsadkfj lsdf jasldfkj lsadkf j
            </div>
            <script>
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
      টেবুলেশনশীট প্রিন্ট করুন
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
