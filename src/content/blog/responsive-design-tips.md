---
title: "모바일 퍼스트 반응형 디자인 팁"
description: "효과적인 반응형 웹 디자인을 위한 실용적인 가이드"
publishDate: 2024-04-05
tags: ["css", "responsive", "mobile"]
draft: false
---

# 모바일 퍼스트란?

모바일 기기를 기준으로 디자인하고, 큰 화면에 맞춰 확장하는 접근 방식입니다.

## 주요 원칙

### 1. 컨테이너 쿼리보다 미디어 쿼리

```css
/* 모바일 기본 */
.container {
  padding: 1rem;
}

/* 태블릿 이상 */
@media (min-width: 768px) {
  .container {
    padding: 2rem;
  }
}
```

### 2. 유연한 그리드 시스템

```css
.grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 1rem;
}
```

### 3. 상대 단위 사용

```css
/* 절대 단위 (피하기) */
font-size: 16px;
width: 400px;

/* 상대 단위 (권장) */
font-size: 1rem;
width: min(90%, 400px);
```

## 브레이크포인트 전략

### 일반적인 브레이크포인트

- **모바일**: < 768px
- **태블릿**: 768px ~ 1024px
- **데스크톱**: > 1024px

### 콘텐츠 기반 브레이크포인트

디바이스가 아닌 콘텐츠가 깨지는 지점에 브레이크포인트를 설정하세요.

## 성능 최적화

### 1. 이미지 최적화

```html
<picture>
  <source media="(min-width: 768px)" srcset="large.jpg">
  <img src="small.jpg" alt="반응형 이미지">
</picture>
```

### 2. 조건부 로딩

```javascript
if (window.innerWidth > 768) {
  // 큰 화면에서만 로드
}
```

## 테스트 체크리스트

- [ ] 다양한 화면 크기에서 테스트
- [ ] 터치 인터랙션 검증
- [ ] 가로/세로 모드 확인
- [ ] 성능 측정 (모바일 네트워크)

## 결론

모바일 퍼스트 접근은 더 나은 사용자 경험과 성능을 제공합니다.
