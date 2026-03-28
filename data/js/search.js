new PagefindUI({
  element: "#search",
  showSubResults: true
});

const currentPage = window.location.pathname.split('/').pop() || 'index.html';
document.querySelectorAll('nav ul li a').forEach(link => {
  if (link.getAttribute('href') === currentPage) {
    link.classList.add('active');
  }
});