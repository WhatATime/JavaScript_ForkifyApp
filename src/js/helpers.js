//////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////
// HELPER FUNCTIONS

//////////////////////////////////////////////////////////
// IMPORTS
import { TIMEOUT_SEC } from './config';

//////////////////////////////////////////////////////////
// FUNCTIONS

/**
 * Timer function which returns rejected Promise after defined number of seconds
 * @param {number} s Number of seconds until timer executes
 * @returns
 */
const timeout = function (s) {
  // Return rejected Promise
  return new Promise(function (_, reject) {
    // Timeout function, execued after defined number of seconds
    setTimeout(function () {
      reject(new Error(`Request took too long! Timeout after ${s} second`));
    }, s * 1000);
  });
};

/**
 * Asynchronous Fetch API function
 * @param {string} url URL address of API
 * @param {Object} [uploadData] Recipe data which gets uploaded to server to add new recipe. If not specified, then recipe gets fetched from server.
 * @returns
 */
export const AJAX = async function (url, uploadData = undefined) {
  try {
    // Build Promise with fetch API
    // If uploadData is defined, set method to 'POST'
    const fetchPro = uploadData
      ? fetch(url, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          // Parse data Object to JSON stream
          body: JSON.stringify(uploadData),
        })
      : fetch(url);

    // API fetch that races against timer
    // Return first resolved or rejected Promise of fetch or timer
    // If API call takes longer than defined timeout, promise is rejected
    const res = await Promise.race([fetchPro, timeout(TIMEOUT_SEC)]);

    // Parse the Response (JSON stream) to a data Object
    const data = await res.json();

    // Guard clause which returns an error message if response status is not "ok"
    if (!res.ok) throw new Error(`${data.message} (${res.status})`);

    // Return the data Object
    return data;
  } catch (err) {
    // Throw error to be displayed in DOM
    throw err;
  }
};
