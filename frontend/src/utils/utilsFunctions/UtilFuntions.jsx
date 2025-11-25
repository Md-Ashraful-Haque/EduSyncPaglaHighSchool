import axios from "axios";


export const areAllFieldsFilled = (vars) => {
  // Check if all fields are filled (not null, undefined, or an empty string)
  return Object.values(vars).every(
    (value) => value !== null && value !== undefined && value !== ""
  );
};


export const areAllFieldsFilledExceptMarkType = (vars) => {
  return Object.entries(vars)
    .filter(([key]) => key !== "mark_type_display") // ignore this field
    .every(([_, value]) => value !== null && value !== undefined && value !== "");
};

export function markTypeBangla(markType) {
  const mapping = {
    "Objective (MCQ)": "এমসিকিউ",
    "Theory": "তাত্ত্বিক",
    "Practical": "ব্যবহারিক",
    "Written(CQ)": "সিকিউ", 
    "Continuous Assessment": "ধারাবাহিক মূল্যায়ন",
    "Class Test": "ক্লাস টেস্ট",
    "Annual Exam": "বার্ষিক পরীক্ষা",
  };

  return mapping[markType] || markType; // fallback to original if not found
}

const formatTime12h = (timeString) => {
  if (!timeString) return "";

  // Handle "HH:MM" or "HH:MM:SS"
  const [hour, minute] = timeString.split(":");

  const date = new Date();
  date.setHours(hour, minute);

  return date.toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  });
}
export default formatTime12h;

/**
 * Reusable function to save form data to the API
 * @param {function} createNewAccessToken - Function to refresh the access token
 * @param {string} endpoint - API endpoint
 * @param {Object} payload - Data to be sent in the request body
 * @param {string} method - HTTP method, e.g., "POST" or "PUT"
 * @returns {Promise<Object>} - API response data or an error object
 */



// export const saveFormData = async (
//   createNewAccessToken,
//   endpoint,
//   payload = {},
//   method = "POST"
// ) => {
//   const apiUrl = `${import.meta.env.VITE_API_URL}/${endpoint}/`;
//   const accessToken = localStorage.getItem("accessToken");

//   try {
//     const { data } = await axios({
//       url: apiUrl,
//       method,
//       headers: {
//         Authorization: `Bearer ${accessToken}`,
//         "Content-Type": "application/json",
//       },
//       data: payload, // Send the form data in the request body
//     });
//     return data; // Return the successful response data
//   } catch (error) {
//     if (error.response?.status === 401) {
//       await createNewAccessToken(); // Refresh the token
//       return await saveFormData(
//         createNewAccessToken,
//         endpoint,
//         payload,
//         method
//       );
//     }
//     console.error(`Error saving data to ${endpoint}:`, error);
//     throw error; // Throw error to handle it on the calling side
//   }
// };


export const saveFormData = async (
  createNewAccessToken,
  endpoint,
  payload = {},
  method = "POST"
) => {
  const apiUrl = `${import.meta.env.VITE_API_URL}/${endpoint}/`;
  const accessToken = localStorage.getItem("accessToken");

  try {
    const headers = {
      Authorization: `Bearer ${accessToken}`,
    };

    // Only set Content-Type to JSON if payload is NOT FormData
    if (!(payload instanceof FormData)) {
      headers["Content-Type"] = "application/json";
    }

    const { data } = await axios({
      url: apiUrl,
      method,
      headers,
      data: payload, // Can be FormData or JSON
    });

    return data;
  } catch (error) {
    if (error.response?.status === 401) {
      await createNewAccessToken();
      return await saveFormData(createNewAccessToken, endpoint, payload, method);
    }
    console.error(`Error saving data to ${endpoint}:`, error);
    throw error;
  }
};




export const doAPIcall = async (
  createNewAccessToken,
  endpoint,
  payload = {},
  method = "POST"
) => {
  const apiUrl = `${import.meta.env.VITE_API_URL}/${endpoint}/`;
  const accessToken = localStorage.getItem("accessToken");

  try {
    const { data } = await axios({
      url: apiUrl,
      method,
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
      data: payload, // Send the form data in the request body
    });
    return data; // Return the successful response data
  } catch (error) {
    if (error.response?.status === 401) {
      await createNewAccessToken(); // Refresh the token
      return await doAPIcall(createNewAccessToken, endpoint, payload, method);
    }
    console.error(`Error saving data to ${endpoint}:`, error);
    throw error; // Throw error to handle it on the calling side
  }
};

// export const doGetAPIcalls = async (createNewAccessToken, endpoint, payload = {}, method = "GET") => {
//   const apiUrl = `${import.meta.env.VITE_API_URL}/${endpoint}/`;
//   const accessToken = localStorage.getItem("accessToken");

//   try {
//     const { data } = await axios({
//       url: apiUrl,
//       method,
//       headers: {
//         Authorization: `Bearer ${accessToken}`,
//         "Content-Type": "application/json",
//       },
//       // data: payload, // Send the form data in the request body
//     });
//     return data; // Return the successful response data
//   } catch (error) {
//     if (error.response?.status === 401) {
//       await createNewAccessToken(); // Refresh the token
//       return await doGetAPIcalls(createNewAccessToken, endpoint, payload, method);
//     }
//     console.error(`Error saving data to ${endpoint}:`, error);
//     throw error; // Throw error to handle it on the calling side
//   }
// };

export const doGetAPIcall = async (
  createNewAccessToken,
  endpoint,
  payload = {},
  method = "GET", // Default is GET
  retryCount = 0
) => {
  const apiUrl = `${import.meta.env.VITE_API_URL}/${endpoint}/`;
  const accessToken = localStorage.getItem("accessToken");
  const maxRetries = 1; // Maximum retry attempts

  try {
    const config = {
      url: apiUrl,
      method,
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
    };

    // Use params for GET, data for other methods (e.g., POST)
    if (method === "GET") {
      config.params = payload;
    } else {
      config.data = payload;
    }

    const { data } = await axios(config);
    return data;
  } catch (error) {
    if (error.response?.status === 401 && retryCount < maxRetries) {
      try {
        await createNewAccessToken(); // Refresh the token
        return await doGetAPIcall(
          createNewAccessToken,
          endpoint,
          payload,
          method,
          retryCount + 1 // Increment retry count
        );
      } catch (tokenError) {
        console.error(`Error refreshing token for ${endpoint}:`, tokenError);
        throw tokenError; // Throw token refresh error
      }
    }
    console.error(`Error calling ${endpoint}:`, error);
    throw error; // Throw original error if not 401 or max retries reached
  }
};

export const doDeleteAPIcalls = async (
  createNewAccessToken,
  endpoint,
  payload = {},
  method = "DELETE"
) => {
  const apiUrl = `${import.meta.env.VITE_API_URL}/${endpoint}/`;
  const accessToken = localStorage.getItem("accessToken");

  try {
    const { data } = await axios({
      url: apiUrl,
      method,
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
      // data: payload, // Send the form data in the request body
    });
    return data; // Return the successful response data
  } catch (error) {
    if (error.response?.status === 401) {
      await createNewAccessToken(); // Refresh the token
      return await doDeleteAPIcalls(
        createNewAccessToken,
        endpoint,
        payload,
        method
      );
    }
    // console.error(`Error saving data to ${endpoint}:`, error);
    throw error; // Throw error to handle it on the calling side
  }
};



/////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////
export const doPublicAPIcall = async (
  endpoint,
  payload = {},
  method = "GET"
) => {
  const apiUrl = `${import.meta.env.VITE_API_URL}/${endpoint}/`;

  try {
    const config = {
      url: apiUrl,
      method,
      headers: {
        "Content-Type": "application/json",
      },
    };

    // GET → params  
    if (method === "GET") {
      config.params = payload;
    }
    // POST/PUT/PATCH → data
    else {
      config.data = payload;
    }

    const { data } = await axios(config);
    return data;
  } catch (error) {
    console.error(`Public API call error (${endpoint}):`, error);
    return [];
  }
};

////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////