document.addEventListener("DOMContentLoaded", function() {
    const urlParams = new URLSearchParams(window.location.search);
    const id = urlParams.get('id');
  
    const apiURL = `http://146.59.233.238:3000/library_books`;
    fetch(apiURL)
      .then(response => response.json())
      .then(data => {
        const book = data[id-1]; // Récupérer le livre correspondant à l'ID
    
        // Afficher les détails du livre dans la page
        document.getElementById('book-details').innerHTML = `
            <h2 class="titre_livre">${book.title}</h2>
            <p class="author">Author: ${book.author}</p>
            <p class="genre">Genre: ${book.genre}</p>
            <p class="edition">Edition: ${book.edition}</p>
            <p class="year">Year: ${book.year}</p>
            <p class="placement">Placement: ${book.placement}</p>
            <p class="reservation-status ${book.reservated_by ? 'reserved' : 'available'}">${book.reservated_by ? 'Borrowed' : 'Available'}</p>
                  `;
      })
      .catch(error => console.error('Error fetching book details:', error));
  });
    
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
  