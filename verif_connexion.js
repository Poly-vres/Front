document.addEventListener('DOMContentLoaded', function() {
    console.log('Script chargé et DOM prêt');
    const userLink = document.getElementById('user-link');

    if (!userLink) {
        console.error('Élément avec ID "user-link" non trouvé');
        return;
    }

    console.log('Élément avec ID "user-link" trouvé');

    // Initialiser l'état de connexion à 'disconnected' pour les tests
    localStorage.setItem('auth', 'disconnected');

    userLink.addEventListener('click', function() {
        console.log('Click sur le lien user');

        var token = localStorage.getItem('auth');
        if (token === 'disconnected') {
            console.log('Utilisateur non connecté, redirection vers logPage.html');
            window.location.href = 'logPage.html';
            return;
        } else if (token === 'connected') {
            console.log('Utilisateur connecté, redirection vers userPage.html');
            window.location.href = 'userPage.html';
            return;
        }
    });
});
