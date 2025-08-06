document.querySelectorAll('#sidebar ul li.nav-item a.nav-link').forEach(link => {
  link.addEventListener('click', (event) => {
    event.preventDefault(); // 기본 동작 방지
    const href = link.getAttribute('href');
    document.querySelector('#sidebar').style.width = '300px'; // 사이드바 너비 유지 (v.$sidebar-width 대신 예시 값 사용)
    setTimeout(() => {
      window.location.href = href; // 페이지 이동
    }, 130); //
  });
});