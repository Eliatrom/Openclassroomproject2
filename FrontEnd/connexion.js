document.addEventListener('DOMContentLoaded', function() {
    document.getElementById('loginForm').addEventListener('submit', async function(event) {
    event.preventDefault(); // Empêcher le rechargement de la page

    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    const response = await fetch('http://localhost:5678/api/users/login', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email, password })
    });

    const result = await response.json();

    if (response.ok) {
        localStorage.setItem('token', result.token); 
        window.location.href = 'index.html';
    } else {
        const errorMessage = document.getElementById('errorMessage');
        errorMessage.textContent = 'Email ou mot de passe incorrect.';
        errorMessage.style.display = 'block';
    }
    });
});