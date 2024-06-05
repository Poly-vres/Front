document.addEventListener('DOMContentLoaded', () => {
    const apiUrlBook = 'http://146.59.233.238:3000/library_books';
    const apiUrlUser = 'http://146.59.233.238:3000/library_users';
    let userTab = [];
    let bookCount = 0;
    let userCount = 0;

    fetchData(apiUrlBook, data => {
        bookCount = data.length;
        populateTable(data, '#data-table-1 tbody', createTableBookRow);
        updateStats(bookCount, userCount);
    });
    fetchData(apiUrlUser, data => {
        userTab = data;
        userCount = data.filter(user => user.id > 4).length;
        populateTable(data.filter(user => user.id > 4), '#data-table-2 tbody', createTableUserRow);
        updateStats(bookCount, userCount);
    });

    document.getElementById('borrow-form').addEventListener('submit', event => handleBorrowFormSubmit(event, userTab));

    // Open the first tab by default
    document.querySelector(".tablinks").click();
});

function fetchData(url, callback) {
    fetch(url)
        .then(response => response.json())
        .then(data => callback(data))
        .catch(error => console.error(`Error fetching data from ${url}:`, error));
}

function populateTable(data, tableBodySelector, createRowFunction) {
    const tableBody = document.querySelector(tableBodySelector);
    tableBody.innerHTML = ''; // Clear the table body before populating
    data.forEach(item => {
        const row = createRowFunction(item);
        tableBody.appendChild(row);
    });
}

function updateStats(bookCount, userCount) {
    const statsDiv = document.getElementById('stats');
    statsDiv.textContent = `Nombre de livres: ${bookCount} | Nombre d'utilisateurs: ${userCount}`;
}

function handleBorrowFormSubmit(event, userTab) {
    event.preventDefault();
    const userSurname = document.getElementById('user').value;
    const bookId = document.getElementById('book-id').value;
    const errorMessage = document.getElementById('error-message');
    
    const foundUser = userTab.find(user => user.surname === userSurname);
    if (foundUser) {
        const userId = foundUser.id;
        apiRequest(`http://146.59.233.238:3000/library_books/reserve/${userId}/${bookId}`, 'POST')
            .then(() => {
                updateButtons(`button[data-book-id="${bookId}"]`, 'btn-green', 'btn-red', 'Rendre', () => rendre(bookId));
                errorMessage.style.display = 'none';
                document.getElementById('popup-form').style.display = 'none';
            })
            .catch(error => console.error('Erreur lors de l\'emprunt du livre:', error));
    } else {
        errorMessage.style.display = 'block';
    }
}

function createTableBookRow(book) {
    const row = document.createElement('tr');
    const buttonHTML = book.borrowed === -1 || book.borrowed === null
        ? `<button class="btn-green" data-book-id="${book.id}" onclick="emprunter(${book.id})">Emprunter</button>`
        : `<button class="btn-red" data-book-id="${book.id}" onclick="rendre(${book.id})">Rendre</button>`;
    row.innerHTML = `
        <td>${book.id}</td>
        <td>${book.author}</td>
        <td>${book.title}</td>
        <td>${book.edition}</td>
        <td>${book.year}</td>
        <td>${book.genre}</td>
        <td>${book.reservated_by}</td>
        <td>${buttonHTML}</td>
    `;
    return row;
}

function createTableUserRow(user) {
    const row = document.createElement('tr');
    const buttonHTML = getUserStatusButtonHTML(user);
    row.innerHTML = `
        <td>${user.id}</td>
        <td>${user.name}</td>
        <td>${user.surname}</td>
        <td>${buttonHTML}</td>
    `;
    return row;
}

function getUserStatusButtonHTML(user) {
    switch (user.status) {
        case 'pending':
            return `<button class="btn-blue-big" data-user-id="${user.id}" onclick="updateUserStatus(${user.id}, 'approved', 'btn-blue-big', 'btn-green-big', 'Membre', suspendre)">À valider</button>`;
        case 'approved':
            return `<button class="btn-green-big" data-user-id="${user.id}" onclick="updateUserStatus(${user.id}, 'revoked', 'btn-green-big', 'btn-red-big', 'Suspendu', valider)">Membre</button>`;
        case 'revoked':
            return `<button class="btn-red-big" data-user-id="${user.id}" onclick="updateUserStatus(${user.id}, 'pending', 'btn-red-big', 'btn-blue-big', 'À valider', accepter)">Suspendu</button>`;
        default:
            return '';
    }
}

function emprunter(bookId) {
    document.getElementById('book-id').value = bookId;
    document.getElementById('popup-form').style.display = 'block';
}

function rendre(bookId) {
    apiRequest(`http://146.59.233.238:3000/library_books/reserve/${null}/${bookId}`, 'POST')
        .then(() => updateButtons(`button[data-book-id="${bookId}"]`, 'btn-red', 'btn-green', 'Emprunter', () => emprunter(bookId)))
        .catch(error => console.error('Erreur lors de la tentative de rendre le livre:', error));
}

function updateButtons(buttonSelector, removeClass, addClass, buttonText, onClickFunction) {
    document.querySelectorAll(buttonSelector).forEach(button => {
        button.classList.remove(removeClass);
        button.classList.add(addClass);
        button.innerText = buttonText;
        button.onclick = onClickFunction;
    });
}

function updateUserStatus(userId, status, removeClass, addClass, buttonText, nextFunction) {
    apiRequest(`http://146.59.233.238:3000/library_user_status_update/${userId}/${status}`, 'POST')
        .then(() => updateButtons(`button[data-user-id="${userId}"]`, removeClass, addClass, buttonText, () => nextFunction(userId)))
        .catch(error => console.error(`Erreur lors de la mise à jour de l'utilisateur avec l'ID ${userId} :`, error));
}

function apiRequest(url, method) {
    return fetch(url, { method })
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        });
}

function suspendre(userId) {
    updateUserStatus(userId, 'revoked', 'btn-green-big', 'btn-red-big', 'Suspendu', valider);
}

function valider(userId) {
    updateUserStatus(userId, 'pending', 'btn-red-big', 'btn-blue-big', 'À valider', accepter);
}

function accepter(userId) {
    updateUserStatus(userId, 'approved', 'btn-blue-big', 'btn-green-big', 'Membre', suspendre);
}

function closePopup() {
    document.getElementById('popup-form').style.display = 'none';
}

function openTab(evt, tabName) {
    document.querySelectorAll('.tabcontent').forEach(tabcontent => {
        tabcontent.style.display = 'none';
    });
    document.querySelectorAll('.tablinks').forEach(tablink => {
        tablink.className = tablink.className.replace(' active', '');
    });
    document.getElementById(tabName).style.display = 'block';
    evt.currentTarget.className += ' active';
}

function loadHTML(elementId, filePath) {
    fetch(filePath)
        .then(response => response.text())
        .then(data => {
            document.getElementById(elementId).innerHTML = data;
        })
        .catch(error => console.error('Error loading HTML:', error));
}

document.addEventListener('DOMContentLoaded', () => {
    loadHTML('header', 'header.html');
    loadHTML('footer', 'footer.html');
});

document.getElementById('logout-button').addEventListener('click', function() {
    console.log('Déconnexion');
    localStorage.setItem('auth', 'disconnected');
    window.location.href = 'logPage.html';
});