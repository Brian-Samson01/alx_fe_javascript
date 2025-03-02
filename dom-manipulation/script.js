document.addEventListener("DOMContentLoaded", () => {
    const quoteDisplay = document.getElementById("quoteDisplay");
    const newQuoteBtn = document.getElementById("newQuote");
    const categoryFilter = document.getElementById("categoryFilter");
    const serverURL = "https://jsonplaceholder.typicode.com/posts"; // Simulated server endpoint

    let quotes = JSON.parse(localStorage.getItem("quotes")) || [
        { text: "The only limit to our realization of tomorrow is our doubts of today.", category: "Motivation" },
        { text: "In the middle of every difficulty lies opportunity.", category: "Inspiration" },
        { text: "Life is 10% what happens to us and 90% how we react to it.", category: "Life" }
    ];

    function saveQuotes() {
        localStorage.setItem("quotes", JSON.stringify(quotes));
    }

    async function fetchQuotesFromServer() {
        try {
            const response = await fetch(serverURL);
            const serverQuotes = await response.json();
            return serverQuotes.map(q => ({ text: q.title, category: "General" }));
        } catch (error) {
            console.error("Error fetching quotes from server:", error);
            return [];
        }
    }

    async function syncQuotes() {
        const serverQuotes = await fetchQuotesFromServer();
        if (serverQuotes.length) {
            const newQuotes = serverQuotes.filter(sq => !quotes.some(lq => lq.text === sq.text));
            if (newQuotes.length) {
                quotes = [...newQuotes, ...quotes];
                saveQuotes();
                populateCategories();
                showRandomQuote();
                alert("New quotes synced from the server.");
            }
        }
    }

    function populateCategories() {
        const uniqueCategories = ["All Categories", ...new Set(quotes.map(q => q.category))];
        categoryFilter.innerHTML = "";
        uniqueCategories.forEach(category => {
            const option = document.createElement("option");
            option.value = category;
            option.textContent = category;
            categoryFilter.appendChild(option);
        });
    }

    function filterQuotes() {
        const selectedCategory = categoryFilter.value;
        localStorage.setItem("selectedCategory", selectedCategory);
        const filteredQuotes = selectedCategory === "All Categories" ? quotes : quotes.filter(q => q.category === selectedCategory);
        if (filteredQuotes.length === 0) {
            quoteDisplay.textContent = "No quotes available for this category.";
        } else {
            const randomQuote = filteredQuotes[Math.floor(Math.random() * filteredQuotes.length)];
            quoteDisplay.textContent = `"${randomQuote.text}" - (${randomQuote.category})`;
        }
    }

    function showRandomQuote() {
        if (quotes.length === 0) {
            quoteDisplay.textContent = "No quotes available. Please add a new one.";
            return;
        }
        const randomQuote = quotes[Math.floor(Math.random() * quotes.length)];
        quoteDisplay.textContent = `"${randomQuote.text}" - (${randomQuote.category})`;
        sessionStorage.setItem("lastViewedQuote", quoteDisplay.textContent);
    }

    function createAddQuoteForm() {
        const formContainer = document.createElement("div");
        formContainer.id = "quoteFormContainer";
        
        const inputText = document.createElement("input");
        inputText.id = "newQuoteText";
        inputText.type = "text";
        inputText.placeholder = "Enter a new quote";
        
        const inputCategory = document.createElement("input");
        inputCategory.id = "newQuoteCategory";
        inputCategory.type = "text";
        inputCategory.placeholder = "Enter quote category";
        
        const addButton = document.createElement("button");
        addButton.innerText = "Add Quote";
        addButton.addEventListener("click", addQuote);
        
        formContainer.appendChild(inputText);
        formContainer.appendChild(inputCategory);
        formContainer.appendChild(addButton);
        
        document.body.appendChild(formContainer);
    }

    function addQuote() {
        const newQuoteText = document.getElementById("newQuoteText").value.trim();
        const newQuoteCategory = document.getElementById("newQuoteCategory").value.trim();
        
        if (!newQuoteText || !newQuoteCategory) {
            alert("Please enter both a quote and a category.");
            return;
        }
        
        quotes.push({ text: newQuoteText, category: newQuoteCategory });
        saveQuotes();
        populateCategories();
        document.getElementById("newQuoteText").value = "";
        document.getElementById("newQuoteCategory").value = "";
        alert("Quote added successfully!");
        showRandomQuote();
    }

    newQuoteBtn.addEventListener("click", showRandomQuote);
    categoryFilter.addEventListener("change", filterQuotes);
    createAddQuoteForm();
    populateCategories();

    const lastSelectedCategory = localStorage.getItem("selectedCategory") || "All Categories";
    categoryFilter.value = lastSelectedCategory;
    filterQuotes();

    const lastViewedQuote = sessionStorage.getItem("lastViewedQuote");
    if (lastViewedQuote) {
        quoteDisplay.textContent = lastViewedQuote;
    } else {
        showRandomQuote();
    }

    setInterval(syncQuotes, 30000); // Sync with server every 30 seconds
});
