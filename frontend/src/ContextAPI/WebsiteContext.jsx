/*eslint no-unused-vars: ["error", { "caughtErrors": "none" }]*/

import { createContext, useState, useContext } from 'react';
import PropTypes from "prop-types";


const WebsiteManagerContext = createContext();

// Create a Provider Component
export const WebsiteContextAPIProvider = ({ children, initialValues = {} }) => { 

  const [websiteVars, setWebsiteVars] = useState({ 
    // notice: initialValues.mark_type_display || '',
    notice:  false,
  });

  // Update specific variable in the `vars` object
  const updateWebsiteVars = (key, value) => {
    // alert("Called");
    setWebsiteVars((prev) => ({
      ...prev,
      [key]: value, // Dynamically update the key
    }));
  }; 

  
  return (
    <WebsiteManagerContext.Provider
      value={{
        websiteVars,
        updateWebsiteVars, 
      }}
    >
      {children}
    </WebsiteManagerContext.Provider>
  );
};

WebsiteContextAPIProvider.propTypes = {
  children: PropTypes.string.isRequired,
};

export const useWebsiteManagerContext = () => useContext(WebsiteManagerContext);

