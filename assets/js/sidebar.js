document.querySelectorAll('#sidebar ul li.nav-item a.nav-link').forEach(link => {
  link.addEventListener('click', (event) => {
    event.preventDefault(); // 기본 동작 방지
    const href = link.getAttribute('href');
    
    // CSS 변수 값 읽어오기
    const sidebar = document.querySelector('#sidebar');
    const sidebarWidth = getComputedStyle(sidebar).getPropertyValue('--sidebar-width').trim();
    
    sidebar.style.width = sidebarWidth; // SCSS 값과 동일하게 설정
    
    setTimeout(() => {
      window.location.href = href; // 페이지 이동
    }, 130);
  });
});
