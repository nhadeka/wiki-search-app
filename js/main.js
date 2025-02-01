import { clearSearchText, setSearchFocus, showClearTextButton, clearPushListener } from "./searchBar.js"
import { getSearchTerm, retrieveSearchResults } from "./dataFunctions.js"
import { deleteSearchResults, buildSearchResults, clearStatsLine, setStatsLine } from "./searchResults.js"

document.addEventListener("readystatechange", (event) => {
    if (event.target.readyState === "complete") {   //loaded everything, ready to initialize app
        initApp();
    }
})

const initApp = () => {
    //set the search focus
    setSearchFocus();
    //3 listeners clear text
    const search = document.getElementById("search");
    search.addEventListener("input", showClearTextButton);
    const clear = document.getElementById("clear");
    clear.addEventListener("click", clearSearchText);
    clear.addEventListener("keydown", clearPushListener);

    const form = document.getElementById("searchBar");
    form.addEventListener("submit", submitTheSearch);
}

//procedural "workflow" function
const submitTheSearch = (event) => {
    event.preventDefault();  //form's default behavior is reload to page
    //delete search results
    deleteSearchResults();
    //process the search
    processTheSearch();
    //set the search focus
    setSearchFocus();
}

//procedural functions
//interacting with wikipedia api

const processTheSearch = async () => {  // it's all about promises with async:)
    // clear the stats line
    clearStatsLine();
    const searchTerm = getSearchTerm();
    if (searchTerm === "") return;
    const resultArray = await retrieveSearchResults(searchTerm);
    if (resultArray.length) buildSearchResults(resultArray);
    //set stats line
    setStatsLine(resultArray.length);


}