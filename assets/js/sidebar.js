const sidebar = document.querySelector('#sidebar');
let hoverTimeout = null;

// 마우스 올림: 즉시 확장
sidebar.addEventListener('mouseenter', () => {
  if (hoverTimeout) {
    clearTimeout(hoverTimeout);
    hoverTimeout = null;
  }
  sidebar.classList.add('expanded');
  sidebar.classList.remove('collapsed');
});

// 마우스 나감: 200ms 후 축소
sidebar.addEventListener('mouseleave', () => {
  hoverTimeout = setTimeout(() => {
    sidebar.classList.remove('expanded');
    sidebar.classList.add('collapsed');
  }, 200);
});

// 초기 상태는 collapsed 로 세팅
sidebar.classList.add('collapsed');

// 링크 클릭 시
document.querySelectorAll('#sidebar ul li.nav-item a.nav-link').forEach(link => {
  link.addEventListener('click', event => {
    event.preventDefault();
    const href = link.getAttribute('href');

    // 클릭 시 강제로 확장 상태로 변경
    sidebar.classList.add('expanded');
    sidebar.classList.remove('collapsed');

    setTimeout(() => {
      window.location.href = href;
    }, 130);
  });
});
