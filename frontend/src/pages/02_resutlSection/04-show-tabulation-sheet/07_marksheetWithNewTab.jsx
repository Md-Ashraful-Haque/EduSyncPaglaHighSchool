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
                size: legal landscape;
                /* 14in × 8.5in */
                margin: 28px;
                // margin-bottom: 48px;
                transform: scale(0.98); 
                transform-origin: top left center;


                /* Add page number in the bottom-right */
                @bottom-right {
                  content: " Page " counter(page) " of "counter(pages);
                }
                
              }
              body {
                  // border: 1px solid red;
                  
                  // transform: scale(0.98); 
                  // transform-origin: top left center; 
                  // margin: 0px 8px;
                  margin: 0px;
                  padding: 0px;
                  @media screen {
                    transform: scale(0.90); 
                    transform-origin: top left center;
                  }
              }
              // .download-using-new-tab { 
              //     @media screen {
              //       // padding: 32px !important;
              //     }
              //   }

              .tabulation-sheet-container{ 
                width: 100%;  
                // margin: 12px auto;
                box-sizing: border-box;
                // padding: 0px 24px;  
                padding: 0px 16px;
                break-after: page; 

                // border: 1px solid rgb(234, 230, 230);
                // border-radius: 12px;
                position: relative;
                overflow-x: auto;
                // margin-bottom: 128px;

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
