const hamburgerButton = document.querySelector('button.hamburger');
const navigationList = document.querySelector('nav ul');

hamburgerButton.addEventListener('click', () => {
  navigationList.classList.toggle('active');
});

const lightbox = document.getElementById('lightbox');
const lightboxImg = document.getElementById('lightboxImg');
const closeBtn = document.getElementById('closeBtn');
const galleryImgs = document.querySelectorAll('figure img');

let scale = 1;
// Load header content from external HTML file

fetch('header.html')
  .then(response => response.text())
  .then(data => {
    document.getElementById('header').innerHTML = data;
  });



  