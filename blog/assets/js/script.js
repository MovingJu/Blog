// 페이지 렌더 전에 저장된 테마 바로 적용 (깜빡임 방지)
(function preloadTheme() {
  const savedTheme = localStorage.getItem('theme') || 'default-dark';
  const theme = themeMap[savedTheme] || themeMap['default-dark'];
  
  const html = document.documentElement;
  for (const key in theme) {
    html.style.setProperty(`--primary-${key}`, theme[key]);
  }
})();

// DOM 준비되면 셀렉트 박스 초기화 및 이벤트 바인딩
window.addEventListener('DOMContentLoaded', () => {
  const themeSelector = document.getElementById('themeSelector');

  // 옵션 채우기
  for (const themeName in themeMap) {
    const opt = document.createElement('option');
    opt.value = themeName;
    opt.textContent = capitalizeFirstLetter(themeName.replace(/-/g, ' '));
    themeSelector.appendChild(opt);
  }

  // 저장된 테마 선택 상태로
  themeSelector.value = localStorage.getItem('theme') || 'default-dark';

  // 테마 변경 시 적용 및 저장
  themeSelector.addEventListener('change', () => {
    const selectedTheme = themeSelector.value;
    localStorage.setItem('theme', selectedTheme);
    applyTheme(themeMap[selectedTheme]);
  });
});

// 테마 적용 함수
function applyTheme(theme) {
  const html = document.documentElement;
  for (const key in theme) {
    html.style.setProperty(`--primary-${key}`, theme[key]);
  }
}

// 첫 글자 대문자 변환 함수
function capitalizeFirstLetter(string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}