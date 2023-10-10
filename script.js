// Import API URL from config
import { API_URL_SEARCH } from "./config.js";
// Import API Key from config
import { API_KEY } from "./config.js";
// Import timeout secs used in timeout function from config
import { TIMEOUT_SEC } from "./config.js";
// Import Timeout function from helpers.js
import { timeout } from "./helpers.js";

let searchQuery = "Apple";

// // Option 1: Fetch.then.
// let query = `${API_URL_SEARCH}${searchQuery}&from=2023-10-09&sortBy=popularity&apiKey=${API_KEY}`;
// let req = new Request(query);

// fetch(req)
//   .then(function (response) {
//     console.log(response.json());
//   })
//   .catch((err) => {
//     console.log(`${err} is here!!!`);
//   });

// Option 2: Async await function
const loadSearchResults = async function (query) {
  try {
    // If fetch takes too long, return error
    const response = await Promise.race([
      fetch(
        `https://newsapi.org/v2/everything?q=${query}&sortBy=popularity&pageSize=50&page=1&apiKey=${API_KEY}`
      ),
      timeout(TIMEOUT_SEC),
    ]);
    // Convert JSON to javascript object using json()
    const data = await response.json();
    console.log(response);
    console.log(data);

    // If response status isn't OK, throw new error()
    if (!response.ok) throw new Error(`${response.status}: ${data.message}`);

    // If no error, return data
    // return data;

    // console.log(data.articles[0].content);
    // Need below data to render
    console.log("Total Results:", data.totalResults);
    console.log("Title:", data.articles[0].title);
    console.log("Description:", data.articles[0].description);
    console.log("URL:", data.articles[0].url);
    console.log("URLtoImage:", data.articles[0].urlToImage);
    console.log("PublishTime:", data.articles[0].publishedAt);
    console.log("Author:", data.articles[0].author);
    console.log("Source name:", data.articles[0].source.name);
    // Page number? Page size?
  } catch (err) {
    //Temp error handling
    console.error(`${err}🩳🩳`);
  }
};

loadSearchResults(searchQuery);
