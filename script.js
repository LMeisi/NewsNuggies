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

// day.js
// import relativeTime from "./node_modules/dayjs/plugin/relativeTime.js"; // display relativeTime

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
    sortBy: "popularity", // By default, set search results to sort by popularity
  },
  bookmarks: [],
};

// State Variables
// Search button click State: If it's search by 'search button' click, variable is true, otherwise (if clicking on sort buttons), false; default to true
let searchBtnClick = true;

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

// ********TO DO: add a state variable as input, so when clicking on search button is the initial search, when that happens state variable is true, then change the 'sortby' property to default "by popularity", otherwise, don't change the 'sortby' property
// Function: Load search results: pass in a string (input query) & page number, use it to fetch data, and store results and search metadata in state object
const loadSearchResults = async function (
  query = state.search.query,
  pageNum = state.search.page
) {
  try {
    // Check if it's search button click, if so, assign 'popularity' to search results; Otherwise, do nothing.
    if (searchBtnClick) {
      state.search.sortBy = "popularity";
    }
    // Test sort options
    console.log(state.search.sortBy);
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
    // NOTE: If no results are returned, no error will be thrown, empty results array will be saved to search results. When render, this error will be guarded and checked to print error message
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
    console.log(state.search.resultsToDisplay);
    console.log("Source name:", state.search.resultsToDisplay[0].source.name);
    console.log("Sort by:", state.search.sortBy);
    console.log("query:", state.search.query);

    // What does it return? Looks program is the same if I don't specify 'return' below (?)
    return state.search.resultsToDisplay;
  } catch (err) {
    //Temp error handling
    console.error(`${err}🩳🩳`);

    // return err
    throw err;
  }
};

// **********************************************************************************************************************
// Below function NOT NEEDED for loading results - Above function will save selected array to display in state
// Function: Get Search Results Page: Pass in a page number, and return the array of search results that are on that page
// Default number is in the state object (when clicking on search button, page 1 is returned)
// function getSearchResultsPage(page = state.search.page) {
// state.search.page = page; // assign new page number to state object

//'page' represents the number of the page to be rendered
// 'resultsPerPage' is how many results we want shown on one page of preview
//e.g. If we want 10 results on page, then below multiply by 10
//e.g. page '1' below will return 0, and 10...
// e.g. ...the slice method below will cut the results before array[0] and before array[10] (i.e. [0] thru [9])
// const start = (page - 1) * state.search.resultsPerPage; // 0;
// const end = page * state.search.resultsPerPage; // 9;

//Return the selected results only
//   return state.search.resultsToDisplay;
// }
// **********************************************************************************************************************

// Function: Render Search Results ('data' argument passed in is state.search)
function renderSearchResults(data) {
  // Clear results, resultOptions, pagination, also: error/spinner if available
  clearSearchResults();

  // ***START HERE:Check again to see if works
  // Guard Clause, if returned results are empty (no results returned), render error
  if (data.resultsToDisplay.length == 0) {
    renderErrorSearchResults();
  }

  // checking
  console.log(data.resultsToDisplay);

  // Generate markup for each search result, map and join them into one html code string
  // NOTE::: <!-- Using the fade out way to fade out multiple line truncation for result.title: https://css-tricks.com/line-clampin/ -->
  // Use moment.js here moment(result.publishedAt).fromNow() to get the time difference from publishedAt till now. moment.js API takes in the format directly and spits out '... ago'
  const resultsMarkup = data.resultsToDisplay
    .map((result) => {
      // return generated markup
      return `<li class="preview">
            <a class="preview__link" href="">
              <!-- Flexbox Vertical -->
              <div class="preview-container d-flex flex-column">
                <!-- Top grid -->
                <div class="preview-info row">
                  <!-- Col containing source and title - flexbox -->
                  <div class="preview-data col-8 d-flex flex-column">
                    <p class="preview__publisher">${result.source.name}</p>
                    <h4 class="preview__title">
                      ${result.title}
                    </h4>
                  </div>
                  <!-- Col containing url img -->
                  <div
                    class="preview-fig-container col-4 d-flex justify-content-end"
                  >
                    <figure class="preview__fig">
                      <img
                        src="${result.urlToImage}"
                        alt="newsImg"
                      />
                    </figure>
                  </div>
                </div>
                <!-- Bottom grid -->
                <div class="preview-support-info row align-items-center">
                  <!-- Published time from now -->
                  <div class="preview-pub-time-container col-8">
                    <p class="preview-pub-time">${moment(
                      result.publishedAt
                    ).fromNow()}</p>
                  </div>
                  <!-- Bookmark? -->
                  <div
                    class="preview-bookmark-container col-4 d-flex justify-content-end"
                  >
                    <button class="btn--round btn-round-preview" type="button">
                      <svg class="">
                        <use href="img/icons.svg#icon-bookmark-fill"></use>
                      </svg>
                    </button>
                  </div>
                </div>
              </div>
            </a>
          </li>`;
    })
    .join("");

  // render results
  results.insertAdjacentHTML("afterbegin", resultsMarkup);

  // render results options container
  renderResultsOptions(data.totalResults, data.resultsPerPage);

  // Render Pagination, pass in current page number (state.search.page)
  renderPagination(data.totalResults, data.resultsPerPage, data.page);
}

// Function: Render Pagination based on current page displayed
function renderPagination(totalResults, resultsPerPage, curPage) {
  // Total number of pages to be displayed for this particular search
  const numPages = Math.ceil(totalResults / resultsPerPage);
  console.log(numPages);

  // Use data attribute 'data-goto' to denote what page the button click to go to (internally for JS to understand)
  // Without data attribute, we wouldn't know which button refers to which page (internally)

  // Case 1: if on Page 1, and there are other pages - display next page button only
  if (curPage === 1 && numPages > 1) {
    const markup = `
      <!-- Empty space  -->
      <div class="col-4"></div>
      <div class="col-4"></div>
      <!-- Next page button  -->
      <button data-goto="${
        curPage + 1
      }" class="btn--inline col-4 pagination__btn--prev justify-content-center" type="button">
        <span>Page ${curPage + 1}</span>
        <ion-icon name="arrow-forward-outline"></ion-icon>
      </button>
      `;

    pagination.insertAdjacentHTML("afterbegin", markup);
  }

  // Case 2: if on Last Page - if current page is equal to num of pages - only display previous page button
  else if (curPage === numPages && numPages > 1) {
    const markup = `
      <!-- Next page button  -->
      <button data-goto="${
        curPage - 1
      }" class="btn--inline col-4 pagination__btn--next justify-content-center" type="button">
        <ion-icon name="arrow-back-outline"></ion-icon>
        <span>Page ${curPage - 1}</span>
      </button>
      <!-- Empty space  -->
      <div class="col-4"></div>
      <div class="col-4"></div>
      `;

    pagination.insertAdjacentHTML("afterbegin", markup);
  }

  // Case 3: if on Other pages - display both previous and next pages buttons
  else if (curPage < numPages) {
    const markup = `
      <!-- Prev page button  -->  
      <button data-goto="${
        curPage - 1
      }" class="btn--inline col-4 pagination__btn--prev justify-content-center" type="button">
        <ion-icon name="arrow-back-outline"></ion-icon>
        <span>Page ${curPage - 1}</span>
      </button>
      <!-- Empty space  -->
      <div class="col-4"></div>
      <!-- Next page button  -->
      <button data-goto="${
        curPage + 1
      }" class="btn--inline col-4 pagination__btn--next justify-content-center" type="button">
          <span>Page ${curPage + 1}</span>
          <ion-icon name="arrow-forward-outline"></ion-icon>
      </button>
      `;

    pagination.insertAdjacentHTML("afterbegin", markup);
  }

  // Case 4: if on Page 1, and there are NO other pages
  else {
  } // Don't append any HTML
}

// Function: Update Search Results

// Function: Render Spinner for Search Results
function renderSpinnerSearchResults() {
  // Clear search results pane
  clearSearchResults();

  const markup = `
    <div class="spinner spinner-search">
      <svg>
        <use href="img/icons.svg#icon-loader"></use>
      </svg>
    </div>`;

  // render spinner
  searchResults.insertAdjacentHTML("afterbegin", markup);
}

// Function: Render Error messages for search results
// If no argument passed, use default message
function renderErrorSearchResults(
  errorMsg = "No news found for your query! Please try another one!"
) {
  // Error Msg check
  console.log(errorMsg);

  // Generate markup
  const errorMarkup = `
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
  searchResults.insertAdjacentHTML("afterbegin", errorMarkup);
}

// Renders result options container (used for when rendering search results)
function renderResultsOptions(totalResults, resultsPerPage) {
  const optionsMarkup = `
  <!-- results totals container-->
  <div class="results-total-container">
    <div class="results-total d-flex">
      <p class="results-total-title me-2 mb-1">Total Results:</p>
      <p class="results-total-num me-5 mb-0 fw-bold">${totalResults}</p>
      <p class="results-total-page me-2 mb-0">Total Pages:</p>
      <p class="results-total-page-num mb-0 fw-bold">${Math.ceil(
        totalResults / resultsPerPage
      )}</p>
    </div>
  </div>
  <!-- "sort by" -->
  <div class="sort-title col-5">
    <p>Sort by:</p>
  </div>
  <!-- sort options -->
  <div class="sort-container col-7 d-flex justify-content-around">
    <div class="sort-option sort-option-relevancy">
      <button class="btn-sort sort-btn-relevancy text-decoration-none bg-transparent border-0" type="button">
        <p>Relevancy</p>
      </a>
    </div>
    <div class="sort-option sort-option-publishedat">
      <button class="btn-sort sort-btn-publishedat text-decoration-none bg-transparent border-0" type="button">
        <p>Date</p>
      </a>
    </div>
    <div class="sort-option sort-option-popularity">
      <button class="btn-sort sort-btn-popularity text-decoration-none bg-transparent border-0" type="button">
        <p>Popularity</p>
      </a>
    </div>`;

  resultsOptions.insertAdjacentHTML("afterbegin", optionsMarkup);
}

// Function: Clear Search results: results, resultOptions, pagination, also: error/spinner if available
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

  // If input exists, set below to true, so when calling loadSearchResults function, sort option will default to 'popularity'
  searchBtnClick = true;

  // render spinner in search results
  renderSpinnerSearchResults();

  // Use .then to render loaded results
  //  Call async LoadSearchResults, after results come back, then render the results, otherwise, wont work!!!
  // Pass in the search query and page number (default is 1) to save results to state object
  loadSearchResults(searchQuery, 1)
    .then((p) => {
      // p is the returned promise, not sure what it is, but doesn't matter, just need to use then here.
      // Check statements
      console.log(state.search.resultsToDisplay);

      // Clear spinner
      clearSearchResults();
      // Render search results based on resultsToDisplay in state object
      // Render doesn't need to be async, all data is already local
      renderSearchResults(state.search);
    })
    .catch((err) => {
      // Clear spinner
      clearSearchResults();

      // If search returns error, loadSearResults will return a Promise with an error as its value, that error is caught and error message will be printed
      console.log(err);
      renderErrorSearchResults();
    });
});

// Hashchange/load event handler (?)

// Clicking on search results event handler (?)

// Bookmark event handler (?)

// EVENT LISTENER: Sort by Relevancy click
// NOTE: Vanilla javascript won't work here unless use event.target, jQuery is easier here
$("body").on("click", ".sort-btn-relevancy", function (e) {
  console.log("sort by relevancy");

  // Save new sortby value to state object
  state.search.sortBy = "relevancy";

  //  Set below to false, not a search button click, so when loading loadSearchResults function, sort option won't default to 'popularity'
  searchBtnClick = false;

  // render spinner in search results
  renderSpinnerSearchResults();

  // Same as above, Call async LoadSearchResults, after results come back, then render the results, otherwise, wont work!!!
  // Pass in the search query and page number (default is 1) to save results to state object
  loadSearchResults(state.search.query, state.search.page)
    .then((p) => {
      // p is the returned promise, not sure what it is, but doesn't matter, just need to use then here.
      // Check statements
      console.log(state.search.resultsToDisplay);

      // Clear spinner
      clearSearchResults();
      // Render search results based on resultsToDisplay in state object
      // Render doesn't need to be async, all data is already local
      renderSearchResults(state.search);

      // Render Pagination
    })
    .catch((err) => {
      // Clear spinner
      clearSearchResults();

      // If search returns error, loadSearResults will return a Promise with an error as its value, that error is caught and error message will be printed
      console.log(err);
      renderErrorSearchResults();
    });
});

// EVENT LISTENER: Sort by Date click
$("body").on("click", ".sort-btn-publishedat", function (e) {
  console.log("sort by published date clicked");

  // Save new sortby value to state object
  state.search.sortBy = "publishedAt";

  //  Set below to false, not a search button click, so when loading loadSearchResults function, sort option won't default to 'popularity'
  searchBtnClick = false;

  // render spinner in search results
  renderSpinnerSearchResults();

  // Same as above, Call async LoadSearchResults, after results come back, then render the results, otherwise, wont work!!!
  // Pass in the search query and page number (default is 1) to save results to state object
  loadSearchResults(state.search.query, state.search.page)
    .then((p) => {
      // p is the returned promise, not sure what it is, but doesn't matter, just need to use then here.
      // Check statements
      console.log(state.search.resultsToDisplay);

      // Clear spinner
      clearSearchResults();
      // Render search results based on resultsToDisplay in state object
      // Render doesn't need to be async, all data is already local
      renderSearchResults(state.search);

      // ***CONTINUE HERE AFTER RENDERING SEARCH RESULTS
    })
    .catch((err) => {
      // Clear spinner
      clearSearchResults();

      // If search returns error, loadSearResults will return a Promise with an error as its value, that error is caught and error message will be printed
      console.log(err);
      renderErrorSearchResults();
    });
});

// EVENT LISTENER: Sort by Popularity click
$("body").on("click", ".sort-btn-popularity", function (e) {
  console.log("sort by popularity clicked");

  // Save new sortby value to state object
  state.search.sortBy = "popularity";

  //  Set below to false, not a search button click, so when loading loadSearchResults function, sort option won't default to 'popularity'
  searchBtnClick = false;

  // render spinner in search results
  renderSpinnerSearchResults();

  // Same as above, Call async LoadSearchResults, after results come back, then render the results, otherwise, wont work!!!
  // Pass in the search query and page number (default is 1) to save results to state object
  loadSearchResults(state.search.query, state.search.page)
    .then((p) => {
      // p is the returned promise, not sure what it is, but doesn't matter, just need to use then here.
      // Check statements
      console.log(state.search.resultsToDisplay);

      // Clear spinner
      clearSearchResults();
      // Render search results based on resultsToDisplay in state object
      // Render doesn't need to be async, all data is already local
      renderSearchResults(state.search);

      // ***CONTINUE HERE AFTER RENDERING SEARCH RESULTS
    })
    .catch((err) => {
      // Clear spinner
      clearSearchResults();

      // If search returns error, loadSearResults will return a Promise with an error as its value, that error is caught and error message will be printed
      console.log(err);
      renderErrorSearchResults();
    });
});
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

// BUGS
// 1. When results return is invalid - especially img, consider replacing img with a custom made local img with logo
// 2. Sometimes when displaying images (or articles), it moves to the left of the container instead of justifying to the end (right side) WHY??? Height? Width? already set width to 100%...
// 3. Some result objects would be "REMOVED", how to actually remove those results from my searach results, e.g. below: (note: sometimes author is null, that's fine, maybe use 'content' or 'title' to check for it)
// {
// author: null
// content: "[Removed]"
// description: "[Removed]"
// publishedAt: "1970-01-01T00:00:00Z"
// source: {id: null, name: '[Removed]'}
// title: "[Removed]"
// url: "https://removed.com"
// urlToImage: null
// }
// 4. Fade out the last line of search results (3 lines total (?))

// Potential Improvements
// 1. Add languages, search in different languages
