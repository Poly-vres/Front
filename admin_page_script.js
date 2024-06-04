var userTab = []

document.addEventListener('DOMContentLoaded', () => {
    const apiUrlBook = 'http://146.59.233.238:3000/library_books';
    const apiUrlUser = 'http://146.59.233.238:3000/library_users';
    
    // Fetch data for the book table
    fetch(apiUrlBook)
        .then(response => response.json())
        .then(data => {
            userTab = data
            const tableBody1 = document.querySelector('#data-table-1 tbody');
            
            // Populate the book table
            data.forEach(book => {
                const row1 = createTableBookRow(book, 1);
                tableBody1.appendChild(row1);
            });
        })
        .catch(error => {
            console.error('Error fetching book data:', error);
        });

    // Fetch data for the user table
    fetch(apiUrlUser)
        .then(response => response.json())
        .then(data => {
            console.table(data)
            const tableBody2 = document.querySelector('#data-table-2 tbody');
            
            // Populate the user table
            data.forEach(user => {
                if(user.id > 4 ){
                  const row2 = createTableUserRow(user, 2);
                tableBody2.appendChild(row2);  
                }
                
            });
        })
        .catch(error => {
            console.error('Error fetching user data:', error);
        });

    document.getElementById('borrow-form').addEventListener('submit', (event) => {
        event.preventDefault();
        const user = document.getElementById('user').value;
        const bookId = document.getElementById('book-id').value;
       
       

            // Faire une requête POST vers le serveur avec les ID correspondants
            apiRequest(`http://146.59.233.238:3000/library_books/reserve/1/${bookId}`, 'POST')
                .then(() => {
                    console.log(`Livre emprunté avec l'ID ${bookId} par l'utilisateur ${userId}`);
                    // Mettre à jour le bouton
                    const buttons = document.querySelectorAll(`button[data-book-id="${bookId}"]`);
                    updateButtonState(buttons, 'btn-green', 'btn-red', 'Rendre', () => rendre(bookId, tableNumber));
                    document.getElementById('popup-form').style.display = 'none';
                    closePopup();
                })
                .catch(error => {
                    console.error('Erreur lors de l\'emprunt du livre:', error); 
                    console.log(`Livre emprunté par: ${user}`);

                });
            console.log(`${user} est présent dans le tableau userTab.`);
     
       
       
       
        // Mettre à jour le bouton
        const buttons = document.querySelectorAll(`button[data-book-id="${bookId}"]`);
        buttons.forEach(button => {
            button.classList.remove('btn-green');
            button.classList.add('btn-red');
            button.innerText = 'Rendre';
            button.onclick = () => rendre(bookId);
        });
    });
    
    // Open the first tab by default
    document.querySelector(".tablinks").click();
});

function createTableBookRow(book, tableNumber) {
    const row = document.createElement('tr');
    let buttonHTML = '';
    if (book.borrowed === -1 || book.borrowed === null) {
        buttonHTML = `
            <button class="btn-green" data-book-id="${book.id}" onclick="emprunter(${book.id}, ${tableNumber})">Emprunté</button>
        `;
    } else {
        buttonHTML = `
            <button class="btn-red" data-book-id="${book.id}" onclick="rendre(${book.id}, ${tableNumber})">Rendre</button>
        `;
    }
    row.innerHTML = `
        <td>${book.id}</td>
        <td>${book.author}</td>
        <td>${book.title}</td>
        <td>${book.edition}</td>
        <td>${book.year}</td>
        <td>${book.genre}</td>
        <td>${book.reservated_by}</td>
        <td>
            ${buttonHTML}
        </td>
    `;
    return row;
}

function createTableUserRow(user, tableNumber) {
    const row = document.createElement('tr');
    let buttonHTML = '';
    console.log(user)
    if (user.status == 'pending') { // À valider
        buttonHTML = `
            <button class="btn-blue-big" data-user-id="${user.id}" onclick="accepter(${user.id}, ${tableNumber})">À valider</button>
        `;
    } else if (user.status == 'approved') { // Membre
        buttonHTML = `
            <button class="btn-green-big" data-user-id="${user.id}" onclick="suspendre(${user.id}, ${tableNumber})">Membre</button>
        `;
    } else if (user.status == 'revoked') { // Suspendu
        buttonHTML = `
            <button class="btn-red-big" data-user-id="${user.id}" onclick="valider(${user.id}, ${tableNumber})">Suspendu</button>
        `;
    }
    row.innerHTML = `
        <td>${user.id}</td>
        <td>${user.name}</td>
        <td>${user.surname}</td>
        <td>
            ${buttonHTML}
        </td>
    `;
    return row;
}

function emprunter(bookId) {
    document.getElementById('book-id').value = bookId;
    document.getElementById('popup-form').style.display = 'block';
}

function rendre(bookId) {
    var nullvar = null
    // Faire le POST vers le serveur
    fetch(`http://146.59.233.238:3000/library_books/reserve/${nullvar}/${bookId}`, {
        method: 'POST'
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        console.log(`Livre rendu avec l'ID ${bookId}`);
        // Mettre à jour le bouton
        const buttons = document.querySelectorAll(`button[data-book-id="${bookId}"]`);
        buttons.forEach(button => {
            button.classList.remove('btn-red');
            button.classList.add('btn-green');
            button.innerText = 'Emprunté';
            button.onclick = () => emprunter(bookId);
        });
    })
    .catch(error => {
        console.error('Erreur lors de la tentative de rendre le livre:', error);
    });
}

function updateUserStatus(userId, status, buttonClassToRemove, buttonClassToAdd, buttonText, nextFunction, tableNumber) {
    fetch(`http://146.59.233.238:3000/library_user_status_update/${userId}/${status}`, {
        method: 'POST'
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        console.log(`Utilisateur avec l'ID ${userId} mis à jour avec le statut ${status}`);
        // Mettre à jour le bouton
        const buttons = document.querySelectorAll(`button[data-user-id="${userId}"]`);
        buttons.forEach(button => {
            button.classList.remove(buttonClassToRemove);
            button.classList.add(buttonClassToAdd);
            button.innerText = buttonText;
            button.onclick = () => nextFunction(userId, tableNumber);
        });
    })
    .catch(error => {
        console.error(`Erreur lors de la mise à jour de l'utilisateur avec l'ID ${userId} :`, error);
    });
}

function suspendre(userId, tableNumber) {
    updateUserStatus(userId,"revoked", 'btn-green-big', 'btn-red-big', 'Suspendu', valider, tableNumber);
}

function valider(userId, tableNumber) {
    updateUserStatus(userId, "pending", 'btn-red-big', 'btn-blue-big', 'À valider', accepter, tableNumber);
}

function accepter(userId, tableNumber) {
    updateUserStatus(userId, "approved", 'btn-blue-big', 'btn-green-big', 'Membre', suspendre, tableNumber);
}

function closePopup() {
    document.getElementById('popup-form').style.display = 'none';
}

function openTab(evt, tabName) {
  var i, tabcontent, tablinks;

  // Hide all tabcontent elements
  tabcontent = document.getElementsByClassName("tabcontent");
  for (i = 0; i < tabcontent.length; i++) {
    tabcontent[i].style.display = "none";
  }

  // Remove the class 'active' from all tablinks
  tablinks = document.getElementsByClassName("tablinks");
  for (i = 0; i < tablinks.length; i++) {
    tablinks[i].className = tablinks[i].className.replace(" active", "");
  }

  // Show the current tab and add an 'active' class to the button that opened the tab
  document.getElementById(tabName).style.display = "block";
  evt.currentTarget.className += " active";
}

// Function to load an external HTML file into an element
function loadHTML(elementId, filePath) {
    fetch(filePath)
      .then(response => response.text())
      .then(data => {
        document.getElementById(elementId).innerHTML = data;
      })
      .catch(error => console.error('Error loading HTML:', error));
  }
  
  // Load header and footer
  document.addEventListener('DOMContentLoaded', () => {
    loadHTML('header', 'header.html');
    loadHTML('footer', 'footer.html');
  });

  function apiRequest(url, method) {
    return fetch(url, { method })
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        });
}