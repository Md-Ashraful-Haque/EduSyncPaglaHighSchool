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
            ${headContent}
            <style>
              /* Force page size for printing */
              @page {

                size: A4 portrait;
                padding: 5px;
                margin: 30px 15px; 
              }

              html, body {
                margin: 0;
                padding: 0;
                width: 210mm;   /* A4 width */
                height: 297mm;  /* A4 height */
                background: #fff;
              }

              /* Screen preview (optional scaling) */
              @media screen {
                body {
                  transform: scale(0.8);
                  transform-origin: top left;
                  margin: 0 auto; /* center preview */
                }
              }

              /* Print settings */
              @media print {
                html, body {
                  width: 210mm;
                  height: 297mm;
                  margin: 0;
                  padding: 0;
                  background: #fff;
                  -webkit-print-color-adjust: exact;
                  print-color-adjust: exact;
                }

                .marksheet-header {
                  width: 100% !important;
                }

                .school-info {
                  margin-top: 16px !important;
                  margin-bottom: 8px !important;
                }
              }
            </style>

          </head>
          <body>
            <div class="admit-card-container">
              ${renderedContent}
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
