document.addEventListener('DOMContentLoaded', () => {
  const mainNav = document.getElementById('main-nav');
  if (!mainNav) return;

  const menuToggles = mainNav.querySelectorAll('.menu-toggle');
  const allNavLinks = mainNav.querySelectorAll('a[href^="#"]');

  // --- 1. XỬ LÝ CLICK ĐỂ MỞ/ĐÓNG MENU CON ---
  menuToggles.forEach(toggle => {
    toggle.addEventListener('click', (event) => {
      event.preventDefault(); // Ngăn hành vi nhảy trang mặc định
      const parentLi = toggle.parentElement;

      // Nếu menu này chưa mở, hãy đóng tất cả các menu khác trước
      if (!parentLi.classList.contains('submenu-open')) {
        closeAllSubmenus();
      }

      // Mở hoặc đóng menu hiện tại
      parentLi.classList.toggle('submenu-open');
    });
  });

  // Hàm tiện ích để đóng tất cả các submenu
  function closeAllSubmenus() {
    mainNav.querySelectorAll('.has-submenu.submenu-open').forEach(submenu => {
      submenu.classList.remove('submenu-open');
    });
  }

  // --- 2. XỬ LÝ ACTIVE MENU KHI CUỘN TRANG (SCROLLSPY) ---

  // Lấy tất cả các section và subsection có ID tương ứng với link trong menu
  const sectionsToObserve = Array.from(allNavLinks)
    .map(link => {
      try {
        // Dùng querySelector để lấy cả section và các thẻ h3, h4...
        return document.querySelector(link.getAttribute('href'));
      } catch (e) {
        return null;
      }
    })
    .filter(el => el !== null); // Lọc bỏ các link không hợp lệ

  if (sectionsToObserve.length === 0) return;

  // Sử dụng IntersectionObserver để theo dõi hiệu quả
  const observer = new IntersectionObserver((entries) => {
    let latestVisibleEntry = null;

    // Tìm mục cuối cùng (thấp nhất trên trang) đang hiển thị
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        latestVisibleEntry = entry.target;
      }
    });

    // Nếu có một mục đang hiển thị, active nó
    if (latestVisibleEntry) {
      const id = latestVisibleEntry.getAttribute('id');
      activateLinkAndParents(id);
    }
  }, {
    // rootMargin giúp xác định "vùng giữa" của màn hình
    // Mục nào đi vào vùng này sẽ được coi là active
    rootMargin: "-30% 0px -60% 0px",
    threshold: 0
  });

  // Bắt đầu theo dõi tất cả các section
  sectionsToObserve.forEach(section => {
    observer.observe(section);
  });

  // Hàm để active link và mở menu cha tương ứng
  function activateLinkAndParents(id) {
    // 1. Bỏ active tất cả các link trước
    allNavLinks.forEach(link => link.classList.remove('active'));

    // 2. Tìm và active link tương ứng
    const activeLink = mainNav.querySelector(`a[href="#${id}"]`);
    if (!activeLink) return;

    activeLink.classList.add('active');

    // 3. Tìm xem link này có nằm trong menu con không
    const parentSubmenu = activeLink.closest('.has-submenu');

    // 4. Mở menu cha và đóng các menu khác
    if (parentSubmenu) {
      // Nếu menu cha chưa mở, hãy đóng các menu khác và mở nó ra
      if (!parentSubmenu.classList.contains('submenu-open')) {
        closeAllSubmenus();
        parentSubmenu.classList.add('submenu-open');
      }
    } else {
      // Nếu đây là link menu cha, đóng tất cả các menu con khác
      closeAllSubmenus();
    }
  }
});