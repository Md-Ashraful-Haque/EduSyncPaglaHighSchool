
import { renderToString } from 'react-dom/server';
import PropTypes from 'prop-types';

// Component to open a new tab with the same header, CSS, JS, and rendered React components
const OpenNewTabWithHeader = ({ divContent }) => {
  const openInNewTab = () => {
    // Get the current page's head content (includes CSS, JS, meta tags, etc.)
    const headContent = document.head.innerHTML;

    // Get the header content from the existing page
    // Assuming the header is a <header> element; adjust selector if needed 

    // Render the React components to static HTML
    const renderedContent = Array.isArray(divContent)
      ? divContent.map((component) => renderToString(component)).join('')
      : renderToString(divContent);

    // Open a new tab
    const newTab = window.open('', '_blank');

    if (newTab) {
      // Write the full HTML structure to the new tab
      newTab.document.write(`
        <!DOCTYPE html>
        <html>
          <head>
            ${headContent}
          </head>
          <body> 
            <div>${renderedContent}</div>
            
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
      alert('Please allow pop-ups for this website.');
    }
  };

  return (
    <button 
      onClick={openInNewTab}
      className="button-1"
    >
      মার্কশীট প্রিন্ট করুন
    </button>
  );
};
OpenNewTabWithHeader.propTypes = {
  divContent: PropTypes.oneOfType([
    PropTypes.node,
    PropTypes.arrayOf(PropTypes.node)
  ]).isRequired,
};

export default OpenNewTabWithHeader; 