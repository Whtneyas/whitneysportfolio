const hamburgerButton = document.querySelector('button.hamburger');
const navigationList = document.querySelector('nav ul');

hamburgerButton.addEventListener('click', () => {
  navigationList.classList.toggle('active');
});

// Load header content from external HTML file

fetch('header.html')
  .then(response => response.text())
  .then(data => {
    document.getElementById('header').innerHTML = data;
  });