import { renderToString } from "react-dom/server";
import PropTypes from "prop-types";
// import TabulationSheetWithNewTab from "./03_tabulation_sheet_with_new_tab";
import TabulationSheet from "./03_tabulation_sheet";
import { ResultContextAPIProvider } from "ContextAPI/MarksInputBySubjectContext";

// Component to open a new tab with the same header, CSS, JS, and rendered React components
const OpenNewTabWithHeader = ({
  examAndInstituteInfo,
  showBangla,
  results,
  highest_marks,
  all_subject,
  bySubjectVars,
  resultOption,
}) => {
  const openInNewTab = () => {
    // Get the current page's head content (includes CSS, JS, meta tags, etc.)
    const headContent = document.head.innerHTML;

    // Render the TabulationSheet component to static HTML

    const renderedContent = renderToString(
      <ResultContextAPIProvider initialValues={bySubjectVars}>
        <TabulationSheet
          examAndInstituteInfo={examAndInstituteInfo}
          showBangla={showBangla}
          results={results}
          highest_marks={highest_marks}
          all_subject={all_subject}
          resultOption={resultOption}
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
              @page {
                size: legal landscape; /* 14in × 8.5in */
                margin: 2mm;
                padding: 0px;
              }

              html, body {
                width: 14in;   /* slightly less than legal width */
                height: auto;
                margin: 0;
                padding: 0;
                box-sizing: border-box;
                overflow: hidden;
                background: white;
              }

              body {
                border: none;
              }

              .tabulation-sheet-container { 
                width: 100%;
                box-sizing: border-box;
                padding: 0px;
                overflow-x: auto;
              }

              @media print {
                html, body {
                  width: 14in;
                  height: auto;
                  margin: 0px !important;
                  padding: 0px !important;
                  // border: 1px solid green;
                  transform: scale(0.98);
                  transform-origin: top left center;
                }

                .tabulation-sheet-container {
                  overflow: visible !important;

                  
                }

                /* Optional page numbering (Chrome may ignore this) */
                @page {
                  @bottom-right {
                    content: "Page " counter(page) " of " counter(pages) "    "!important;
                  }
                    margin-bottom: 0.60in;
                }
              }

              /* Scale for screen only */
              @media screen {
                body {
                  transform: scale(0.98);
                  transform-origin: top left center;
                  // border: 1px solid green; 
                  margin: 0px;
                  padding: 0px;
                  background-color: white !important;
                }
              }
            </style>



          </head>
          <body>
            <div class="tabulation-sheet download-using-new-tab">
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
  children: PropTypes.node,
  examAndInstituteInfo: PropTypes.object.isRequired,
  showBangla: PropTypes.func.isRequired,
  results: PropTypes.array.isRequired,
  highest_marks: PropTypes.object.isRequired,
  all_subject: PropTypes.object.isRequired,
  bySubjectVars: PropTypes.object.isRequired,
};

export default OpenNewTabWithHeader;
