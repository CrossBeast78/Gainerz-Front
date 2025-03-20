document.addEventListener("DOMContentLoaded", function () {
    const searchBar = document.getElementById("search-bar");
    const searchResults = document.getElementById("search-results");

    searchBar.addEventListener("input", function () {
        let query = searchBar.value.trim();
        if (query.length > 0) {
            fetchResults(query);
        } else {
            searchResults.style.display = "none";
        }
    });

    async function fetchResults(query) {
        try {
            let response = await fetch(`/api/search?q=${encodeURIComponent(query)}`);
            let results = await response.json();
            displayResults(results);
        } catch (error) {
            console.error("Error fetching search results:", error);
        }
    }

    function displayResults(results) {
        searchResults.innerHTML = "<ul>" +
            results.map(result => `<li>${result}</li>`).join("") + "</ul>";
        searchResults.style.display = "block";
    }

    document.addEventListener("click", function (event) {
        if (!searchResults.contains(event.target) && event.target !== searchBar) {
            searchResults.style.display = "none";
        }
    });
});
