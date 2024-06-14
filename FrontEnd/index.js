async function fetchCategories() {
    try {
        let response = await fetch("http://localhost:5678/api/categories");
        if (!response.ok) {
            throw new Error('Network response was not ok ' + response.statusText);
        }
        return await response.json();
    } catch (error) {
        console.error('There was a problem with the fetch operation:', error);
    }
}

async function fetchWorks() {
    try {
        let response = await fetch("http://localhost:5678/api/works");
        if (!response.ok) {
            throw new Error('Network response was not ok ' + response.statusText);
        }
        return await response.json();
    } catch (error) {
        console.error('There was a problem with the fetch operation:', error);
    }
}

function displayWorks(works, category) {
    let gallery = document.querySelector(".gallery");
    gallery.innerHTML = ""; // Clear existing works

    works.forEach(work => {
        if (!category || work.category === category) {
            let newfigure = document.createElement("figure");
            let img = document.createElement("img");
            let figcaption = document.createElement("figcaption");

            img.src = work.imageUrl;
            img.alt = work.title;
            figcaption.textContent = work.title;

            newfigure.appendChild(img);
            newfigure.appendChild(figcaption);
            gallery.appendChild(newfigure);
        }
    });
}

function displayCategories(categories) {
    let categoriesDiv = document.querySelector(".categories");
    categoriesDiv.innerHTML = ""; // Clear existing categories
    
    // Add "All" button to show all works
    let allButton = document.createElement("button");
    allButton.textContent = "Tous";
    allButton.addEventListener("click", () => {
        document.querySelectorAll('.categories button').forEach(btn => btn.classList.remove('active'));
        allButton.classList.add('active');
        filterWorksByCategory(null);
    });
    categoriesDiv.appendChild(allButton);
    allButton.classList.add('active'); // Set "Tous" as active by default

    categories.forEach(category => {
        let button = document.createElement("button");
        button.textContent = category.name;
        button.addEventListener("click", () => {
            document.querySelectorAll('.categories button').forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');
            filterWorksByCategory(category.name);
        });
        categoriesDiv.appendChild(button);
    });
}

async function filterWorksByCategory(category) {
    let works = await fetchWorks();
    displayWorks(works, category);
}

async function init() {
    let categories = await fetchCategories();
    displayCategories(categories);

    let works = await fetchWorks();
    displayWorks(works);
}

// Initialiser l'affichage
init();


