---
title: "깜빡임 없는 다크모드 구현하기"
description: "FOUC를 방지하는 다크모드 구현 방법과 모범 사례"
publishDate: 2024-03-10
updatedDate: 2024-03-15
tags: ["css", "dark-mode", "ux"]
draft: false
---

# FOUC란?

FOUC (Flash of Unstyled Content)는 페이지 로드 시 스타일이 적용되지 않은 콘텐츠가 깜빡이는 현상입니다.

## 다크모드에서의 FOUC 문제

다크모드 설정이 JavaScript로만 처리되면 페이지 로드 시 라이트 테마가 잠깐 보이는 문제가 발생합니다.

## 해결 방법

### 1. 인라인 스크립트 사용

```html
<script is:inline>
  const theme = localStorage.getItem('theme')
    || (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
  document.documentElement.setAttribute('data-theme', theme);
</script>
```

### 2. CSS 변수 활용

```css
:root[data-theme="light"] {
  --bg-color: #ffffff;
  --text-color: #000000;
}

:root[data-theme="dark"] {
  --bg-color: #1a1a1a;
  --text-color: #ffffff;
}
```

### 3. 시스템 설정 연동

```javascript
const prefersDark = window.matchMedia('(prefers-color-scheme: dark)');
prefersDark.addEventListener('change', (e) => {
  setTheme(e.matches ? 'dark' : 'light');
});
```

## 주의사항

- 인라인 스크립트는 `<head>` 최상단에 배치
- localStorage 접근 전 브라우저 환경 체크
- 시스템 설정과 사용자 설정의 우선순위 고려

## 결론

FOUC를 방지하려면 렌더링 전에 테마를 결정하고 적용해야 합니다.
