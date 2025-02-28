document.addEventListener("DOMContentLoaded", () => {
    const quoteDisplay = document.getElementById("quoteDisplay");
    const newQuoteBtn = document.getElementById("newQuote");
    const addQuoteBtn = document.getElementById("addQuoteBtn");
    const newQuoteText = document.getElementById("newQuoteText");
    const newQuoteCategory = document.getElementById("newQuoteCategory");

    let quotes = [
        { text: "The purpose of our lives is to be happy.", category: "Life" },
        { text: "Success is not the key to happiness. Happiness is the key to success.", category: "Success" },
        { text: "Do what you can, with what you have, where you are.", category: "Motivation" }
    ];

    function showRandomQuote() {
        if (quotes.length === 0) {
            quoteDisplay.textContent = "No quotes available.";
            return;
        }
        const randomIndex = Math.floor(Math.random() * quotes.length);
        quoteDisplay.textContent = `"${quotes[randomIndex].text}" - ${quotes[randomIndex].category}`;
    }

    function addQuote() {
        const text = newQuoteText.value.trim();
        const category = newQuoteCategory.value.trim();

        if (text === "" || category === "") {
            alert("Please enter both a quote and a category.");
            return;
        }

        quotes.push({ text, category });
        localStorage.setItem("quotes", JSON.stringify(quotes));

        newQuoteText.value = "";
        newQuoteCategory.value = "";

        alert("Quote added successfully!");
    }

    function loadQuotesFromStorage() {
        const storedQuotes = JSON.parse(localStorage.getItem("quotes"));
        if (storedQuotes) {
            quotes = storedQuotes;
        }
    }

    loadQuotesFromStorage();
    newQuoteBtn.addEventListener("click", showRandomQuote);
    addQuoteBtn.addEventListener("click", addQuote);
});
