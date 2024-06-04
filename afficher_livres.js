const apiURL = "http://146.59.233.238:3000/library_books";

function loadContent(url, elementId) {
    fetch(url)
        .then(response => response.text())
        .then(data => {
            document.getElementById(elementId).innerHTML = data;
        })
        .catch(error => console.error('Erreur:', error));
}

loadContent('header.html', 'header');
loadContent('footer.html', 'footer');


fetch(apiURL)
  .then(response => response.json()) // Convertir la réponse en JSON
  .then(data => {

    const bookList = document.getElementById('book-list');
    data.forEach(book => {
      const bookItem = document.createElement('div');
      bookItem.className = 'book-item';
      bookItem.innerHTML = `
          <a href="livreDetail.html?id=${book.id}">
              <h2 class="title">${book.title}</h2>
              <p class="author">Author: ${book.author}</p>
              <p class="genre">Genre : ${book.genre}</p>
          </a>
      `;
      bookList.appendChild(bookItem);
    })
  })
  .catch(error => console.error('Error fetching books:', error));
