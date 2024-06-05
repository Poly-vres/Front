// Fonction pour charger le contenu d'un fichier
function loadContent(url, elementId, callback) {
    fetch(url)
        .then(response => response.text())
        .then(data => {
            document.getElementById(elementId).innerHTML = data;
            if (callback) callback();
        })
        .catch(error => console.error('Erreur:', error));
}

loadContent('header.html', 'header', function() {
    const userLink = document.getElementById('user-link');

    if (!userLink) {
        console.error('Élément avec ID "user-link" non trouvé');
        return;
    }

    console.log('Élément avec ID "user-link" trouvé');

    userLink.addEventListener('click', function() {
        console.log('Click sur le utilisateur');

        var token = localStorage.getItem('auth');
        if (token === 'disconnected') {
            console.log('Utilisateur non connecté, redirection vers logPage.html');
            window.location.href = 'logPage.html';
            return;
        } else if (token === 'connectedUser') {
            console.log('Utilisateur connecté, redirection vers userPage.html');
            window.location.href = 'userPage.html';
            return;
        } else if (token === 'connectedAdmin') {
            console.log('Utilisateur connecté en tant qu\'admin, redirection vers adminPage.html');
            window.location.href = 'admin_page.html';
            return;
        } else [
            console.log('Pas de token trouvé, redirection vers logPage.html'),
            window.location.href = 'logPage.html'
        ]
    });
});


loadContent('footer.html', 'footer');

console.log('Contenus loaded');
