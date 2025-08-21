// // // utils/api.js

// import axios from "axios";

// export const getFormOptionData = async (apiUrl, queryData) => {
//   const accessToken = localStorage.getItem("accessToken");

//   const { data } = await axios.get(apiUrl, {
//     params: queryData,
//     headers: {
//       Authorization: `Bearer ${accessToken}`,
//       "Content-Type": "application/json",
//     },
//   });
//   return data;
// };

// /**
//  * Reusable function to fetch data from the API
//  * @param {string} endpoint - API endpoint
//  * @param {Object} queryData - Query parameters for the API call
//  * @returns {Promise<Array>} - API response data or an empty array
//  */
// export const fetchFromFieldsData = async (createNewAccessToken, endpoint, queryData = {}) => {


//   const apiUrl = `${import.meta.env.VITE_API_URL}/${endpoint}/`;
//   try {
//     return await getFormOptionData(apiUrl, queryData);
//   } catch (error) {
//     if (error.response?.status === 401) {
//       await createNewAccessToken();
//       return await getFormOptionData(apiUrl, queryData);
//     }
//     console.error(`Error fetching data from ${endpoint}:`, error);
//     return [];
//   }
// };



// utils/api.js

import axios from "axios";

// Fetches data from the API with authorization and query parameters
export const getFormOptionData = async (apiUrl, queryData) => {
  const accessToken = localStorage.getItem("accessToken");

  const { data } = await axios.get(apiUrl, {
    params: queryData,
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "application/json",
    },
  });
  return data;
};

/**
 * Reusable function to fetch data from the API
 * @param {function} createNewAccessToken - Function to refresh the access token
 * @param {string} endpoint - API endpoint
 * @param {Object} queryData - Query parameters for the API call
 * @returns {Promise<Array>} - API response data or an empty array
 */
export const fetchData = async (createNewAccessToken, endpoint, queryData = {}) => {
  const apiUrl = `${import.meta.env.VITE_API_URL}/${endpoint}/`;

  try {
    return await getFormOptionData(apiUrl, queryData);
  } catch (error) {
    if (error.response?.status === 401) {
      await createNewAccessToken(); // Refresh the token
      return await getFormOptionData(apiUrl, queryData);
    }
    console.error(`Error fetching data from ${endpoint}:`, error);
    return []; // Return empty array in case of errors
  }
};
