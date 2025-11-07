import { renderToString } from "react-dom/server";
import PropTypes from "prop-types";
// import TabulationSheetWithNewTab from "./03_tabulation_sheet_with_new_tab"; 
import { ResultContextAPIProvider } from "ContextAPI/MarksInputBySubjectContext";
import MeritReportHeader from "./01-merit-report-header"
import MeritReportTable from "./02_merit_report_table"



import ResultSummaryReport from "./ResultSummaryReport";
// Component to open a new tab with the same header, CSS, JS, and rendered React components
const OpenNewTabWithHeader = ({
  data
}) => {
  const openInNewTab = () => {
    // Get the current page's head content (includes CSS, JS, meta tags, etc.)
    const headContent = document.head.innerHTML;

    // Render the TabulationSheet component to static HTML

    const renderedContent = renderToString(
      <ResultContextAPIProvider >
        <ResultSummaryReport data={data} />
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
              @page {
                // size: legal landscape;
                size: A4 portrait;
                /* 14in × 8.5in */
                margin: 32px;
                margin-bottom: 48px;
                transform: scale(0.98); 
                transform-origin: top left center;


                /* Add page number in the bottom-right */
                @bottom-right {
                  content: " Page " counter(page) " of "counter(pages);
                }
                
              }
              body { 
                  margin: 0px;
                  padding: 0px;
                  @media screen {
                    transform: scale(0.80); 
                    transform-origin: top left center;
                  }
              } 
              .tabulation-sheet-container{ 
                width: 100%;  
                margin: 12px auto;
                box-sizing: border-box;
                padding: 24px;  
                break-after: page; 

                border: 1px solid rgb(234, 230, 230);;
                border-radius: 12px;
                position: relative;
                overflow-x: auto;
                margin-bottom: 128px;

              }

              @media print {
                body {
                  // border: 1px solid red; 
                  margin: 0px;
                  padding: 0px;
                  background-color: white !important;
                }
                .tabulation-sheet-container{
                  overflow: initial;

                }
                .marksheet-header{
                  width: 100%; 
                } 
                .school-info {
                    margin-top: 16px !important;
                    margin-bottom: 8px !important;
                }
              }


            </style>
          </head>
          <body>
            <div class="generate-result">
              <div class="downloadFullResult">
                <div class="tabulation-sheet download-using-new-tab">
                  ${renderedContent}
                </div>
              </div>
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
