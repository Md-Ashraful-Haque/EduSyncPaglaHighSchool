// utils/api.js

import axios from "axios";

// export const getFormOptionData = async (apiUrl, queryData) => {
//   const accessToken = localStorage.getItem("accessToken"); 

//   // ⛔ Skip API call if any critical param is missing
//   // if (!accessToken || Object.values(queryData).some((v) => !v)) {
//   //   console.warn("Skipping API call due to missing parameters: getFormOptionData", queryData);
//   //   return [];
//   // }

//   try {
//     const { data } = await axios.get(apiUrl, {
//       params: queryData,
//       headers: {
//         Authorization: `Bearer ${accessToken}`,
//         "Content-Type": "application/json",
//       },
//     });
//     console.log("API call successful:", apiUrl, "with query:", queryData, "Response:", data);
//     return data;
//   } catch (error) { 
//     console.log("API call failed silently:", apiUrl, "Error:", error);
//     return []; // or return null / {} depending on your use case
//   }
// };

// Fetches data from the API with authorization and query parameters
export const getFormOptionData = async (apiUrl, queryData) => {
  const accessToken = localStorage.getItem("accessToken");
  // console.log("Fetching data from API:", apiUrl, "with query:", queryData);

  // ⛔ Skip API call if any critical param is missing
  if (!accessToken || Object.values(queryData).some((v) => !v)) {
    // console.warn("Skipping API call due to missing parameters: getFormOptionData", queryData);
    return [];
  }


  const { data } = await axios.get(apiUrl, {
    params: queryData,
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "application/json",
    },
  });
  // console.log("API call successful:", apiUrl, "with query:", queryData, "Response:", data);
  return data;
};

/**
 * Reusable function to fetch data from the API
 * @param {function} createNewAccessToken - Function to refresh the access token
 * @param {string} endpoint - API endpoint
 * @param {Object} queryData - Query parameters for the API call
 * @returns {Promise<Array>} - API response data or an empty array
 */
export const fetchData = async (
  createNewAccessToken,
  endpoint,
  queryData = {}
) => {
  const apiUrl = `${import.meta.env.VITE_API_URL}/${endpoint}/`;

  // ⛔ Skip API call if any critical param is missing
  if (!createNewAccessToken || Object.values(queryData).some((v) => !v)) {
    // console.warn("Skipping API call due to missing parameters fetchData:", queryData);
    return [];
  }

  try {
    return await getFormOptionData(apiUrl, queryData);
  } catch (error) {
    if (error.response?.status === 401) {
      await createNewAccessToken(); // Refresh the token
      return await getFormOptionData(apiUrl, queryData);
    }
    // console.error(`Error fetching data from ${endpoint}:`, error);
    return []; // Return empty array in case of errors
  }
};
