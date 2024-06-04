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
  