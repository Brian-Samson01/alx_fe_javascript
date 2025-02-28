document.addEventListener("DOMContentLoaded", () => {
    const quoteDisplay = document.getElementById("quoteDisplay");
    const newQuoteBtn = document.getElementById("newQuote");
    const addQuoteBtn = document.getElementById("addQuoteBtn");
    const newQuoteText = document.getElementById("newQuoteText");
    const newQuoteCategory = document.getElementById("newQuoteCategory");

    // Ensure quotes array exists
    let quotes = [
        { text: "The purpose of our lives is to be happy.", category: "Life" },
        { text: "Success is not the key to happiness. Happiness is the key to success.", category: "Success" },
        { text: "Do what you can, with what you have, where you are.", category: "Motivation" }
    ];

    // Load quotes from local storage if available
    function loadQuotesFromStorage() {
        const storedQuotes = JSON.parse(localStorage.getItem("quotes"));
        if (Array.isArray(storedQuotes)) {
            quotes = storedQuotes;
        }
    }

    // Function to display a random quote
    function displayRandomQuote() {
        if (quotes.length === 0) {
            quoteDisplay.textContent = "No quotes available.";
            return;
        }
        const randomIndex = Math.floor(Math.random() * quotes.length);
        const randomQuote = quotes[randomIndex];
        quoteDisplay.textContent = `"${randomQuote.text}" - ${randomQuote.category}`;
    }

    // Function to add a new quote
    function addQuote() {
        const text = newQuoteText.value.trim();
        const category = newQuoteCategory.value.trim();

        if (text === "" || category === "") {
            alert("Please enter both a quote and a category.");
            return;
        }

        // Create a new quote object
        const newQuote = { text, category };
        quotes.push(newQuote);

        // Update Local Storage
        localStorage.setItem("quotes", JSON.stringify(quotes));

        // Clear input fields
        newQuoteText.value = "";
        newQuoteCategory.value = "";

        alert("Quote added successfully!");
    }

    // Load stored quotes on page load
    loadQuotesFromStorage();

    // Event listeners
    newQuoteBtn.addEventListener("click", displayRandomQuote);
    addQuoteBtn.addEventListener("click", addQuote);
});
