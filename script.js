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

// Element Definitions
const searchButton = document.querySelector(".search__btn");

// Search Results Pane
const searchResults = document.querySelector(".search-results"); // Search Results Pane
const results = document.querySelector(".results"); // Search results
const resultsOptions = document.querySelector(".results-options"); // sorting options container
const pagination = document.querySelector(".pagination"); // pagination container
// const errorSearch = document.querySelector(".error-search");
// const spinnerSearch = document.querySelector(".spinner-search");

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
    sortBy: "relevancy", // By default, set search results to sort by relevancy
  },
  bookmarks: [],
};

//////////////////////////////////////////////////////////
///////////////////*** Functions: News Pane related */

// Function: Create News Object: Convert a chosen news data into the object that fits our format, and return such object

// Function: Load News: Use a property as id from the chosen news object (address hash?) and render the object properties

// Function: Render News

// Function: Render Spinner for news Pane

// Function: Render Error messages for News Pane

// Function: clear news pane content

//////////////////////////////////////////////////////////
///////////////////*** Functions: Search Results related */

// Function: (?)Get Query: Function to return search input value
function getQuery() {
  // Store input value to 'query'
  const inputQuery = document.querySelector(".search__field").value;

  // Store query into state object
  state.search.query = inputQuery;

  // Clear input value
  clearInput();

  return inputQuery;
}
// Function: Sorting method (?) How to incorporate into get query function?

// Function: Clear Input: Function to clear input value
function clearInput() {
  document.querySelector(".search__field").value = "";
}

// Function: Load search results: pass in a string (input query) & page number, use it to fetch data, and store results and search metadata in state object
const loadSearchResults = async function (
  query = state.search.query,
  pageNum = state.search.page
) {
  try {
    // If fetch takes too long, return error
    // Use current sortBy and resultsPerPage values in state object
    const response = await Promise.race([
      fetch(
        `https://newsapi.org/v2/everything?q=${query}&sortBy=${state.search.sortBy}&pageSize=${state.search.resultsPerPage}&page=${pageNum}&apiKey=${API_KEY}`
      ),
      timeout(TIMEOUT_SEC),
    ]);
    // Convert JSON to javascript object using json()
    // Data only contains the chosen results on selected page
    const data = await response.json();
    console.log(response);
    console.log(data);
    // console.log(data.articles[0].content); // Below data only for own understanding
    // console.log("Total Results:", data.totalResults);
    // console.log("Title:", data.articles[0].title);

    // If response status isn't OK, throw new error()
    if (!response.ok) throw new Error(`${response.status}: ${data.message}`);

    // Save articles to state object (below way not needed, just save data.article directly into resultsToDisplay object)
    // Convert(map) the each 'article' object into the object of your own format
    // state.search.resultsToDisplay = data.articles.map((art) => {
    //   return {
    //     title: art.title, // article title
    //     url: art.url, // article address
    //     urlToImage: art.urlToImage, // article image
    //     source: art.source.name, // e.g. a website name
    //     publishedAt: art.publishedAt, // time of publish
    //   };
    // });

    // Save the articles object into state object
    state.search.resultsToDisplay = data.articles;
    // assign totalResults property to state object
    state.search.totalResults = data.totalResults;
    // assign query property to state object
    state.search.query = query;
    // ***??? Set page number to 1 (by default)
    state.search.page = 1;

    // Checking state object
    console.log(state);
    console.log("Source name:", state.search.resultsToDisplay[0].source.name);
    console.log("Sort by:", state.search.sortBy);
    console.log("query:", state.search.query);

    // Return results for rendering
    // return search.resultsToDisplay;
  } catch (err) {
    //Temp error handling
    console.error(`${err}🩳🩳`);
    // Check: resultsToDisplay is empty
    console.log(state);
  }
};

// Below function NO NEED for loading results - Above function will save selected array to display in state
// Function: Get Search Results Page: Pass in a page number, and return the array of search results that are on that page
// Default number is in the state object (when clicking on search button, page 1 is returned)
function getSearchResultsPage(page = state.search.page) {
  state.search.page = page; // assign new page number to state object

  //'page' represents the number of the page to be rendered
  // 'resultsPerPage' is how many results we want shown on one page of preview
  //e.g. If we want 10 results on page, then below multiply by 10
  //e.g. page '1' below will return 0, and 10...
  // e.g. ...the slice method below will cut the results before array[0] and before array[10] (i.e. [0] thru [9])
  const start = (page - 1) * state.search.resultsPerPage; // 0;
  const end = page * state.search.resultsPerPage; // 9;

  //Return the selected results only
  return state.search.resultsToDisplay;
}

// Function: Render Search Results
function renderSearchResults(data) {
  // Clear current results and sort options
  clearSearchResults();

  // ***START HERE:Check again to see if works
  // Guard Clause, if results are not valid, return error
  if (data.length == 0) {
    renderErrorSearchResults();
  }

  // ***START HERE: how to render;
}
// Function: Update Search Results

// Function: Render Spinner for Search Results
function renderSpinnerSearchResults() {
  const markup = `
    <div class="spinner spinner-search">
      <svg>
        <use href="img/icons.svg#icon-loader"></use>
      </svg>
    </div>`;

  // Clear sorting options container and search results
  clearSearchResults();
  // render spinner
  searchResults.insertAdjacentHTML("afterbegin", markup);
}

// Function: Render Error messages for search results
function renderErrorSearchResults() {
  // Error Msg
  const errorMsg = "No News found for your query! Please try another one!";
  console.log(errorMsg);

  // Generate markup
  const markup = `
    <div class="error error-search">
      <div>
        <svg>
          <use href="img/icons.svg#icon-alert-triangle"></use>
        </svg>
      </div>
      <p>${errorMsg}</p>
    </div>
  `;

  // Clear sorting options container and search results & pagination - Not needed, renderSearchResults already cleared it

  // render error message
  searchResults.insertAdjacentHTML("afterbegin", markup);
}

// Function: Clear Search results
function clearSearchResults() {
  // Clear results and resultsOptions and pagination containers
  results.innerHTML = "";
  resultsOptions.innerHTML = "";
  pagination.innerHTML = "";

  // If error/spinner exists, remove them
  if (document.querySelector(".error-search") !== null) {
    document.querySelector(".error-search").remove();
  }
  if (document.querySelector(".spinner-search") !== null) {
    document.querySelector(".spinner-search").remove();
  }
}

//////////////////////////////////////////////////////////
///////////////////*** Functions: Pagination */

// Function: Pagination control: Click on page button, updates search results and page buttons

// Function: Pagination button Render: Display pages (used for default display AND when clicking on page buttons)

//////////////////////////////////////////////////////////
///////////////////*** Functions: Auxiliary Functions, Bookmark features */

// Function: init(): local storage, initialize

// Functions: Bookmark (?)

//////////////////////////////////////////////////////////
///////////////////*** Control Flow */

//////////////////////////////////////////////////////////
///////////////////** Event Listeners */

// Search button event handler
searchButton.addEventListener("click", function () {
  // Get query input and save to searchQuery
  let searchQuery = getQuery();
  console.log(searchQuery);

  // guard clause - If no search term, exit and do nothing
  if (searchQuery == "") {
    return;
  }

  // Pass in the search query and page number (default is 1) to save results to state object
  loadSearchResults(searchQuery, 1);
  // Check
  console.log(state.search.resultsToDisplay);

  // Render search results based on resultsToDisplay in state object
  const resultsToRender = state.search.resultsToDisplay;
  renderSearchResults(resultsToRender);
});

// Hashchange/load event handler (?)

// Clicking on search results event handler (?)

// Bookmark event handler (?)

// Sort by Relevancy button click

// Sort by Relevancy Date click

// Sort by Relevancy Popularity click

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
