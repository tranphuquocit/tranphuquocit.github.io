document.addEventListener('DOMContentLoaded', () => {
  // --- KHAI BÁO BIẾN ---
  const mainNav = document.getElementById('main-nav');
  const hamburgerBtn = document.getElementById('menu-hamburger-button');
  const overlay = document.getElementById('menu-overlay');
  const body = document.body;

  if (!mainNav || !hamburgerBtn || !overlay) return;

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

  // **LOGIC MỚI ĐÃ SỬA LỖI**
  // Thiết lập listener cho toàn bộ menu cha
  mainNav.addEventListener('click', (event) => {
    const link = event.target.closest('a'); // Tìm thẻ <a> gần nhất được click
    if (!link) return; // Nếu không click vào link thì không làm gì

    const parentLi = link.parentElement;

    // **Trường hợp 1: Click vào menu cha có submenu (menu-toggle)**
    if (parentLi.classList.contains('has-submenu')) {
      event.preventDefault(); // Ngăn hành vi mặc định của link
      // Chỉ mở/đóng submenu, không đóng menu chính
      if (!parentLi.classList.contains('submenu-open')) {
        closeAllSubmenus();
      }
      parentLi.classList.toggle('submenu-open');
    }
    // **Trường hợp 2: Click vào link con hoặc link đơn**
    else {
      // Chỉ đóng nếu menu đang ở trạng thái mở (trên di động)
      if (mainNav.classList.contains('is-open')) {
        toggleMobileMenu();
      }
      // Không preventDefault(), để link tự động cuộn đến section
    }
  });

  function closeAllSubmenus() {
    mainNav.querySelectorAll('.has-submenu.submenu-open').forEach(submenu => {
      submenu.classList.remove('submenu-open');
    });
  }

  // --- XỬ LÝ ACTIVE MENU KHI CUỘN TRANG (SCROLLSPY) ---
  // Logic này vẫn giữ nguyên, nó hoạt động độc lập
  const allNavLinks = mainNav.querySelectorAll('a[href^="#"]');
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