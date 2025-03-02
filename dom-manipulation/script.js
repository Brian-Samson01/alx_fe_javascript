document.addEventListener("DOMContentLoaded", () => {
    const quoteDisplay = document.getElementById("quoteDisplay");
    const newQuoteBtn = document.getElementById("newQuote");
    const categoryFilter = document.getElementById("categoryFilter");
    const importFileInput = document.createElement("input");
    importFileInput.type = "file";
    importFileInput.id = "importFile";
    importFileInput.accept = ".json";
    importFileInput.onchange = importFromJsonFile;
    document.body.appendChild(importFileInput);

    let quotes = JSON.parse(localStorage.getItem("quotes")) || [
        { text: "The only limit to our realization of tomorrow is our doubts of today.", category: "Motivation" },
        { text: "In the middle of every difficulty lies opportunity.", category: "Inspiration" },
        { text: "Life is 10% what happens to us and 90% how we react to it.", category: "Life" }
    ];

    function saveQuotes() {
        localStorage.setItem("quotes", JSON.stringify(quotes));
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
        if (selectedCategory === "All Categories") {
            showRandomQuote();
        } else {
            const filteredQuotes = quotes.filter(q => q.category === selectedCategory);
            if (filteredQuotes.length === 0) {
                quoteDisplay.innerHTML = "No quotes available for this category.";
            } else {
                const randomIndex = Math.floor(Math.random() * filteredQuotes.length);
                quoteDisplay.innerHTML = `"${filteredQuotes[randomIndex].text}" - (${filteredQuotes[randomIndex].category})`;
            }
        }
    }

    function showRandomQuote() {
        if (quotes.length === 0) {
            quoteDisplay.innerHTML = "No quotes available. Please add a new one.";
            return;
        }
        const randomIndex = Math.floor(Math.random() * quotes.length);
        const selectedQuote = quotes[randomIndex];
        quoteDisplay.innerHTML = `"${selectedQuote.text}" - (${selectedQuote.category})`;
        sessionStorage.setItem("lastViewedQuote", quoteDisplay.innerHTML);
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

    function exportToJsonFile() {
        const jsonData = JSON.stringify(quotes, null, 2);
        const blob = new Blob([jsonData], { type: "application/json" });
        const url = URL.createObjectURL(blob);
        
        const downloadAnchor = document.createElement("a");
        downloadAnchor.href = url;
        downloadAnchor.download = "quotes.json";
        
        document.body.appendChild(downloadAnchor);
        downloadAnchor.click();
        document.body.removeChild(downloadAnchor);
        
        URL.revokeObjectURL(url);
    }

    function importFromJsonFile(event) {
        const fileReader = new FileReader();
        fileReader.onload = function(event) {
            try {
                const importedQuotes = JSON.parse(event.target.result);
                if (!Array.isArray(importedQuotes)) throw new Error("Invalid JSON format");
                quotes.push(...importedQuotes);
                saveQuotes();
                populateCategories();
                alert('Quotes imported successfully!');
                showRandomQuote();
            } catch (error) {
                alert("Error importing quotes: " + error.message);
            }
        };
        fileReader.readAsText(event.target.files[0]);
    }

    if (!document.getElementById("exportQuotesButton")) {
        const exportButton = document.createElement("button");
        exportButton.id = "exportQuotesButton";
        exportButton.innerText = "Export Quotes";
        exportButton.addEventListener("click", exportToJsonFile);
        document.body.appendChild(exportButton);
    }

    newQuoteBtn.addEventListener("click", () => {
        showRandomQuote();
    });
    
    createAddQuoteForm();
    populateCategories();
    
    const lastSelectedCategory = localStorage.getItem("selectedCategory") || "All Categories";
    categoryFilter.value = lastSelectedCategory;
    filterQuotes();

    const lastViewedQuote = sessionStorage.getItem("lastViewedQuote");
    if (lastViewedQuote) {
        quoteDisplay.innerHTML = lastViewedQuote;
    } else {
        showRandomQuote();
    }
});