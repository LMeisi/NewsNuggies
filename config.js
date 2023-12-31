// API KEY
export const API_KEY = "3064d86652684181a62614f285547be7";

// API URL for search
export const API_URL_SEARCH = "https://newsapi.org/v2/everything?q=";
// e.g. https://newsapi.org/v2/everything?q=Apple&from=2023-10-10&sortBy=popularity&apiKey=API_KEY

// API URL for top headlines of a country
export const API_URL_HEADLINES =
  "https://newsapi.org/v2/top-headlines?country=";
// e.g. https://newsapi.org/v2/top-headlines?country=us&apiKey=API_KEY

// API URL for headlings from a specific source
export const API_URL_SOURCE = "https://newsapi.org/v2/top-headlines?sources=";
// e.g. https://newsapi.org/v2/top-headlines?sources=bbc-news&apiKey=API_KEY

// # of sec before displaying error message on ajax call
export const TIMEOUT_SEC = 10;

// For displaying number of results per search results page
export const RES_PER_PAGE = 7;
