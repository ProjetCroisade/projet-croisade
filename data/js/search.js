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

// Dropdown navigation
document.querySelectorAll('.has-dropdown').forEach(item => {
  let closeTimer = null;

  item.addEventListener('mouseenter', () => {
    clearTimeout(closeTimer);
    item.classList.add('open');
  });

  item.addEventListener('mouseleave', () => {
    closeTimer = setTimeout(() => {
      item.classList.remove('open');
    }, 150);
  });
});

// Close dropdown on outside click
document.addEventListener('click', e => {
  if (!e.target.closest('.has-dropdown')) {
    document.querySelectorAll('.has-dropdown.open').forEach(item => {
      item.classList.remove('open');
    });
  }
});
