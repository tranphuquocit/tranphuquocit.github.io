document.addEventListener('DOMContentLoaded', () => {
  // --- KHAI BÁO BIẾN ---
  const mainNav = document.getElementById('main-nav');
  const hamburgerBtn = document.getElementById('menu-hamburger-button');
  const overlay = document.getElementById('menu-overlay');
  const body = document.body;

  if (!mainNav || !hamburgerBtn || !overlay) return;

  const menuToggles = mainNav.querySelectorAll('.menu-toggle');
  const allNavLinks = mainNav.querySelectorAll('a[href^="#"]');

  // --- HÀM ĐIỀU KHIỂN MENU DI ĐỘNG ---
  function toggleMobileMenu() {
    hamburgerBtn.classList.toggle('active');
    mainNav.classList.toggle('is-open');
    overlay.classList.toggle('is-visible');
    body.classList.toggle('menu-active');
  }

  // --- CÁC SỰ KIỆN CHO MENU DI ĐỘNG ---
  hamburgerBtn.addEventListener('click', toggleMobileMenu);
  overlay.addEventListener('click', toggleMobileMenu);

  // Tự động đóng menu di động khi nhấn vào một link
  allNavLinks.forEach(link => {
    link.addEventListener('click', () => {
      if (mainNav.classList.contains('is-open')) {
        toggleMobileMenu();
      }
    });
  });

  // --- XỬ LÝ CLICK ĐỂ MỞ/ĐÓNG MENU CON ---
  menuToggles.forEach(toggle => {
    toggle.addEventListener('click', (event) => {
      event.preventDefault();
      const parentLi = toggle.parentElement;
      if (!parentLi.classList.contains('submenu-open')) {
        closeAllSubmenus();
      }
      parentLi.classList.toggle('submenu-open');
    });
  });

  function closeAllSubmenus() {
    mainNav.querySelectorAll('.has-submenu.submenu-open').forEach(submenu => {
      submenu.classList.remove('submenu-open');
    });
  }

  // --- XỬ LÝ ACTIVE MENU KHI CUỘN TRANG (SCROLLSPY) ---
  const sectionsToObserve = Array.from(allNavLinks)
    .map(link => document.querySelector(link.getAttribute('href')))
    .filter(el => el !== null);

  if (sectionsToObserve.length === 0) return;

  const observer = new IntersectionObserver((entries) => {
    let latestVisibleEntry = null;
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        latestVisibleEntry = entry.target;
      }
    });
    if (latestVisibleEntry) {
      const id = latestVisibleEntry.getAttribute('id');
      activateLinkAndParents(id);
    }
  }, {
    rootMargin: "-30% 0px -60% 0px",
    threshold: 0
  });

  sectionsToObserve.forEach(section => observer.observe(section));

  function activateLinkAndParents(id) {
    allNavLinks.forEach(link => link.classList.remove('active'));
    const activeLink = mainNav.querySelector(`a[href="#${id}"]`);
    if (!activeLink) return;

    activeLink.classList.add('active');
    const parentSubmenu = activeLink.closest('.has-submenu');

    if (parentSubmenu) {
      if (!parentSubmenu.classList.contains('submenu-open')) {
        closeAllSubmenus();
        parentSubmenu.classList.add('submenu-open');
      }
    } else {
      closeAllSubmenus();
    }
  }
});