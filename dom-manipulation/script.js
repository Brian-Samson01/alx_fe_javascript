document.addEventListener("DOMContentLoaded", () => {
    const quoteDisplay = document.getElementById("quoteDisplay");
    const newQuoteBtn = document.getElementById("newQuote");
    const categoryFilter = document.createElement("select");
    categoryFilter.id = "categoryFilter";
    categoryFilter.addEventListener("change", filterQuotes);
    document.body.insertBefore(categoryFilter, quoteDisplay);

    let quotes = JSON.parse(localStorage.getItem("quotes")) || [
        { text: "The only limit to our realization of tomorrow is our doubts of today.", category: "Motivation" },
        { text: "In the middle of every difficulty lies opportunity.", category: "Inspiration" },
        { text: "Life is 10% what happens to us and 90% how we react to it.", category: "Life" }
    ];

    function saveQuotes() {
        localStorage.setItem("quotes", JSON.stringify(quotes));
    }

    saveQuotes();

    function populateCategories() {
        categoryFilter.innerHTML = '<option value="all">All Categories</option>';
        const categories = [...new Set(quotes.map(q => q.category))];
        categories.forEach(category => {
            const option = document.createElement("option");
            option.value = category;
            option.innerText = category;
            categoryFilter.appendChild(option);
        });
    }

    function showRandomQuote() {
        const selectedCategory = categoryFilter.value;
        const filteredQuotes = selectedCategory === "all" ? quotes : quotes.filter(q => q.category === selectedCategory);
        if (filteredQuotes.length === 0) {
            quoteDisplay.innerHTML = "No quotes available for this category.";
            return;
        }
        const randomIndex = Math.floor(Math.random() * filteredQuotes.length);
        const selectedQuote = filteredQuotes[randomIndex];
        quoteDisplay.innerHTML = `"${selectedQuote.text}" - (${selectedQuote.category})`;
        sessionStorage.setItem("lastViewedQuote", quoteDisplay.innerHTML);
    }

    function filterQuotes() {
        localStorage.setItem("selectedCategory", categoryFilter.value);
        showRandomQuote();
    }

    function createAddQuoteForm() {
        const formContainer = document.createElement("div");
        
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
        
        if (newQuoteText === "" || newQuoteCategory === "") {
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

    newQuoteBtn.addEventListener("click", () => {
        showRandomQuote();
    });
    
    createAddQuoteForm();
    populateCategories();
    
    const lastViewedQuote = sessionStorage.getItem("lastViewedQuote");
    if (lastViewedQuote) {
        quoteDisplay.innerHTML = lastViewedQuote;
    } else {
        showRandomQuote();
    }

    const lastSelectedCategory = localStorage.getItem("selectedCategory");
    if (lastSelectedCategory) {
        categoryFilter.value = lastSelectedCategory;
    }
});
