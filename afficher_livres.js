const apiURL = "http://146.59.233.238:3000/library_books";



fetch(apiURL)
    .then(response => response.json()) // Convertir la réponse en JSON
    .then(data => {

    const bookList = document.getElementById('book-list');
    data.forEach(book => {
        const bookItem = document.createElement('div');
        bookItem.className = 'book-item';
        bookItem.innerHTML = `
            <h2 class="title">${book.title}</h2>
            <p class="author">Author: ${book.author}</p>
            <P class="genre">Genre : ${book.genre}</h2>
        `;
        bookList.appendChild(bookItem);
    })
})
    .catch(error => console.error('Error fetching books:', error));


