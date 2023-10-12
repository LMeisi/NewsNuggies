// Import API URL from config
import { API_URL_SEARCH } from "./config.js";
// Import API Key from config
import { API_KEY } from "./config.js";
// Import timeout secs used in timeout function from config
import { TIMEOUT_SEC } from "./config.js";
// Import timeout secs used in timeout function from config
import { RES_PER_PAGE } from "./config.js";
// Import Timeout function from helpers.js
import { timeout } from "./helpers.js";

// Create State object - Object that contains the data for the current search query and results
// Consider updating/clearing every time 'search' button is clicked?
const state = {
  news: {}, // Pick and Copy from state.search.resultsToRender array based on some form of id (what?)
  search: {
    query: "",
    totalResults: 0, // Number of total search results for the query
    resultsToDisplay: [], // Results (articles) actually received on query and to be displayed on page, a chosen result will be copied into the state.news object
    page: 1, //state variable for current page number (that's being displayed), pagination will use this variable
    resultsPerPage: RES_PER_PAGE, // 'resultsPerPage' is how many results we want shown on one page of search results, get it from config.js (RES_PER_PAGE)
  },
  bookmarks: [],
};

let searchQuery = "Apple";

///////////////////*** Functions: News Pane related */

// Function: Create News Object: Convert a chosen news data into the object that fits our format, and return such object

// Function: Load News: Use a property as id from the chosen news object (address hash?) and render the object properties

// Function: Render News

// Function: Render Spinner for news Pane

// Function: Render Error messages for News Pane

// Function: clear news pane content

///////////////////*** Functions: Search Results related */

// Function: (?)Get Query: Function to return search input value

// Function: Sorting method (?) How to incorporate into get query function?

// Function: Clear Input: Function to clear input value

// Function: Load search results: pass in a string (input query), use it to fetch data, and store results in state object
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

    // Convert(map) the 'data' object into the object of your own format
    state.search.resultsToDisplay = data.articles.map((art) => {
      return {
        title: art.title, // article title
        url: art.url, // article address
        source: art.source.name, // e.g. a website name
        publishedAt: art.publishedAt, // time of publish
      };
    });

    // ***Set page number to 1 (by default)
    state.search.page = 1;

    // ***START HERE: Test above state object after above code execution

    // Need below data to render
    // console.log(data.articles[0].content); // Below data only for own understanding
    console.log("Total Results:", data.totalResults);
    console.log("Title:", data.articles[0].title);
    console.log("Description:", data.articles[0].description);
    console.log("URL:", data.articles[0].url);
    console.log("URLtoImage:", data.articles[0].urlToImage);
    console.log("PublishTime:", data.articles[0].publishedAt);
    console.log("Author:", data.articles[0].author);
    console.log("Source name:", data.articles[0].source.name);
  } catch (err) {
    //Temp error handling
    console.error(`${err}🩳🩳`);
  }
};

// Function: Get Search Results Page: Pass in a page number, and return the array of search results that are on that page

// Function: Render Search Results

// Function: Update Search Results

// Function: Render Spinner for Search Results

// Function: Render Error messages for search results

// Function: Clear Search results

///////////////////*** Functions: Pagination */

// Function: Pagination control: Click on page button, updates search results and page buttons

// Function: Pagination button Render: Display pages (used for default display AND when clicking on page buttons)

///////////////////*** Functions: Auxiliary Functions, Bookmark features */

// Function: init(): local storage, initialize

// Functions: Bookmark (?)

///////////////////** Event Listeners */

// Search button event handler

// Hashchange/load event handler (?)

// Clicking on search results event handler (?)

// Bookmark event handler (?)

///////////////////*** Function calls */
loadSearchResults(searchQuery);

//////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////

// Backup code pieces

// Ajax Fetch query code
// // Option 1: use Fetch.then.
// let query = `${API_URL_SEARCH}${searchQuery}&from=2023-10-09&sortBy=popularity&apiKey=${API_KEY}`;
// let req = new Request(query);

// fetch(req)
//   .then(function (response) {
//     console.log(response.json());
//   })
//   .catch((err) => {
//     console.log(`${err} is here!!!`);
//   });
