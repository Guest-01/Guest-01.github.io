---
title: "Astro로 시작하는 정적 사이트 개발"
description: "Astro 프레임워크의 기본 개념과 장점을 알아봅니다"
publishDate: 2024-01-15
tags: ["astro", "web", "tutorial"]
draft: false
---

# Astro란?

Astro는 콘텐츠 중심 웹사이트를 위한 현대적인 정적 사이트 생성기입니다. 기본적으로 JavaScript를 제거하여 빠른 로딩 속도를 제공합니다.

## 주요 특징

### 1. 제로 JavaScript 기본 설정
Astro는 필요한 경우에만 JavaScript를 전송합니다. 대부분의 콘텐츠는 순수 HTML로 렌더링됩니다.

### 2. 아일랜드 아키텍처
필요한 컴포넌트만 선택적으로 인터랙티브하게 만들 수 있습니다.

```astro
---
import InteractiveComponent from './Interactive.jsx';
---

<div>
  <h1>정적 콘텐츠</h1>
  <InteractiveComponent client:load />
</div>
```

### 3. 프레임워크 독립적
React, Vue, Svelte 등 원하는 프레임워크를 함께 사용할 수 있습니다.

## 시작하기

```bash
npm create astro@latest
cd my-astro-site
npm run dev
```

## 결론

Astro는 블로그, 마케팅 사이트, 포트폴리오 등 콘텐츠 중심 웹사이트에 최적화된 선택입니다.
