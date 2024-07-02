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


const addPhotoModal = document.getElementById('addPhotoModal');
const editModal = document.getElementById('editModal');
const openAddPhotoModalBtn = document.getElementById('openAddPhotoModal');
openAddPhotoModalBtn.addEventListener('click', () => {
    addPhotoModal.style.display = 'flex';
    editModal.style.display ='none'
    loadCategories();
});
// ${localStorage.getItem('token')}
let photoId = 1;
const addPhotoForm = document.getElementById('addPhotoForm');

addPhotoForm.addEventListener('submit', (event) => {
    event.preventDefault();

    const formData = new FormData();
    const title = addPhotoForm.querySelector('input[name="title"]').value;
    const categoryId = addPhotoForm.querySelector('select[name="category"]').value;
    const imageFile = addPhotoForm.querySelector('input[name="image"]').files[0];

    formData.append('title', title);
    formData.append('imageUrl', imageFile);
    formData.append('category', categoryId);

    console.log('Form data:', {
        title,
        categoryId,
        imageFile
    });

    fetch('http://localhost:5678/api/works', {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
        body: formData
    })
    .then(response => {
        if (!response.ok) {
            return response.json().then(err => { throw new Error(err.message); });
        }
        return response.json();
    })
    .then(newPhoto => {
        console.log('Success:', newPhoto);
        addPhotoToGallery(newPhoto);
        addPhotoToEditModal(newPhoto);
        addPhotoForm.reset();
        addPhotoModal.style.display = 'none';
    })
    .catch((error) => {
        console.error('Error:', error);
    });
});
const gallery = document.getElementById('gallery');
function addPhotoToEditModal(photo) {
    const img = document.createElement('img');
    img.src = photo.url;
    img.alt = photo.title;

    const deleteIcon = document.createElement('span');
    deleteIcon.classList.add('delete-icon');
    deleteIcon.innerHTML = '&times;';
    deleteIcon.addEventListener('click', () => {
        removePhoto(photo.id);
    });

    const container = document.createElement('div');
    container.classList.add('image-container');
    container.appendChild(img);
    container.appendChild(deleteIcon);

    gallery.appendChild(container);
}

function addPhotoToGallery(photo) {
    const img = document.createElement('img');
    img.src = photo.url;
    img.alt = photo.title;
    img.classList.add('gallery-photo');

    const container = document.createElement('div');
    container.classList.add('image-container');
    container.appendChild(img);

    document.getElementById('index-gallery').appendChild(container);
}

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

function openModal() {
    document.getElementById('editModal').style.display = 'flex';
}

const editButton = document.getElementById('editProjects').addEventListener("click", () => {
    openModal();
});

function closeModal() {
    document.getElementById('editModal').style.display = 'none';
    document.getElementById('addPhotoModal').style.display = 'none'
}

window.addEventListener("keydown", e => {
    if(e.key === 'Escape')
        closeModal();
})
function loadCategories() {
    const categorySelect = document.getElementById('category');
    fetch('http://localhost:5678/api/categories')
        .then(response => response.json())
        .then(categories => {
            categorySelect.innerHTML = '<option value="">Sélectionnez une catégorie</option>';
            categories.forEach(category => {
                let option = document.createElement('option');
                option.value = category.id;
                option.textContent = category.name;
                categorySelect.appendChild(option);
            });
        })
        .catch(error => console.error('Erreur:', error));
}

const closebutton = document.querySelectorAll('.close')
closebutton.forEach(button => {
     button.addEventListener('click', () => {
        closeModal(editModal);
        closeModal(addPhotoModal);
    });
});


window.addEventListener('click', (event) => {
    if (event.target === editModal) {
        closeModal(editModal);
    }
    if (event.target === addPhotoModal) {
        closeModal(addPhotoModal);
    }
});

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


