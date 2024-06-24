document.addEventListener('DOMContentLoaded', function() {
    const loginButton = document.getElementById('login');
    const logoutButton = document.getElementById('logout');
    const editButton = document.getElementById('editProjects');
    const filtersContainer = document.querySelector('.categories');
    const token = localStorage.getItem('token');

    if (token) {
        loginButton.style.display = 'none';
        logoutButton.style.display = 'inline';
        editButton.style.display = 'inline';
        filtersContainer.style.display = 'none';
        displayEditGallery();
    }
})
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

function displayWorks(works, categoryId = null) {
    let gallery = document.querySelector(".gallery");
    gallery.innerHTML = "";

    works.forEach(work => {
        if (!categoryId || work.category.id === categoryId) {
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
    categoriesDiv.innerHTML = "";
    
    let allButton = document.createElement("button");
    allButton.textContent = "Tous";
    allButton.addEventListener("click", () => {
        document.querySelectorAll('.categories button').forEach(btn => btn.classList.remove('active'));
        allButton.classList.add('active');
        filterWorksByCategory(null);
    });
    categoriesDiv.appendChild(allButton);
    allButton.classList.add('active');

    categories.forEach(category => {
        let button = document.createElement("button");
        button.textContent = category.name;
        button.addEventListener("click", () => {
            document.querySelectorAll('.categories button').forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');
            filterWorksByCategory(category.id);
        });
        categoriesDiv.appendChild(button);
    });
}

async function filterWorksByCategory(categoryId) {
    let works = await fetchWorks();
    displayWorks(works, categoryId);
}

async function init() {
    let categories = await fetchCategories();
    displayCategories(categories);

    let works = await fetchWorks();
    displayWorks(works);
}

function logout() {
    localStorage.removeItem('token');
    window.location.href = 'index.html';
}
const logoutButton = document.getElementById('logout').addEventListener("click", () => {
    logout();
});

function openEditModal() {
    document.getElementById('editModal').style.display = 'block';
}

const editButton = document.getElementById('editProjects').addEventListener("click", () => {
    openEditModal();
});

function closeEditModal() {
    document.getElementById('editModal').style.display = 'none';
}
// const modal = document.querySelector('.modal')
//     document.addEventListener('click', e => {
//         let clickDedans = modal.contains(e.target)
//         if (!clickDedans && document.getElementById('editModal').style.display === 'block') {
//             closeEditModal();
//         }
//     })
window.addEventListener("keydown", e => {
    if(e.key === 'Escape')
    closeEditModal();
})

async function displayEditGallery() {
    const response = await fetch('http://localhost:5678/api/works');
    const works = await response.json();
    const editGallery = document.querySelector('.edit-gallery');

    works.forEach(work => {
        const figure = document.createElement('figure');
        const img = document.createElement('img');
        img.src = work.imageUrl;
        img.alt = work.title;

        const deleteIcon = document.createElement('i');
        deleteIcon.className = 'fas fa-trash-alt delete-icon';
        deleteIcon.onclick = () => deleteWork(work.id, figure);

        figure.appendChild(img);
        figure.appendChild(deleteIcon);
        editGallery.appendChild(figure);
    });
}



async function deleteWork(workId, figureElement) {
    const response = await fetch(`http://localhost:5678/api/works/${workId}`, {
        method: 'DELETE',
        headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
    });

    if (response.ok) {
        figureElement.remove();
    } else {
        alert('Échec de la suppression du travail.');
    }
}

// Initialiser l'affichage
init();


