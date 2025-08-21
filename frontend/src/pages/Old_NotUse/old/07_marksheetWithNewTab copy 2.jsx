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
                margin: 0;
              }

              body {
                  // border: 1px solid red;
                  
                  transform: scale(0.98);       /* Adjust the scale factor */
                  transform-origin: top left center;  /* Prevent shifting */
                  margin: 0px;
                  padding: 0px;
                  // max-width: 352mm; 
                  
              }

              .tabulation-sheet-container{ 
                width: 100%;  
                margin: 8px;
                box-sizing: border-box;
                padding: 24px;  
                break-after: page; 

                border: 1px solid rgb(234, 230, 230);;
                border-radius: 12px;

              }

              @media print {
                
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
