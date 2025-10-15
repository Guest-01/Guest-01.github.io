---
title: '나만의 블로그로 이전하기'
description: 'SSG(Static Site Generation) 특화 프레임워크인 Astro 사용기'
publishDate: 2025-10-15
tags: ['SSG', 'Blog']
draft: false
---

### 배경

제가 처음으로 기술 블로그를 시작한 것은 티스토리에서였습니다. 당시 티스토리는 초대장이 있어야만 가입할 수 있었고, 어렵게 가입했지만 마크다운 지원이 미흡했습니다. 대신 자체 에디터로 글을 작성해야 했고, 무엇보다 마음에 드는 UI/UX나 디자인 템플릿을 찾기 어려웠습니다.

또한 개발자라면 상용 서비스가 아닌 직접 호스팅을 해야 하지 않을까 하는 생각에 GitHub Pages를 알아보게 되었습니다. 다만 아직 블로그를 처음부터 개발하기에는 부담스러웠고, 이미 Jekyll이나 Gatsby 같은 프레임워크를 활용한 블로그 템플릿들이 많이 있어서 그중 [마음에 드는 템플릿](https://github.com/jbee37142/gatsby-starter-bee)을 fork하여 블로그를 운영했습니다.

하지만 제가 선택했던 템플릿은 이제 다소 레거시가 되어버린 Gatsby를 사용했고, 결정적으로 Node.js 버전 14에서만 빌드가 가능했습니다. 그래서 `nvm`과 같은 버전 매니저를 통해 빌드할 때마다 14 버전으로 전환해야 하는 불편함이 있었습니다.

기왕이면 최신 라이브러리를 사용하고, 제가 원하는 UI와 디자인을 자유롭게 구현해보고자 이번에는 직접 개발해보기로 마음먹었습니다. 회사에서 Claude Code Max 구독을 제공해주고 있었기에 AI를 활용하면 충분히 가능하다는 확신이 있었고, 그것이 용기를 주었습니다.

실제 코딩은 AI에게 맡길 예정이지만, 어떤 도구를 사용할지, 프로젝트 구성은 어떻게 할지와 같은 기술적인 의사결정은 제가 직접 알아보고 검토할 계획이었습니다.

### 기술 검토

블로그와 같은 사이트는 일반적으로 동적 콘텐츠보다는 정적 콘텐츠 중심이며, SEO가 매우 중요하기 때문에 SSG(Static Site Generation) 방식으로 개발하는 것이 일반적입니다. SSG에 특화된 프레임워크로는 예전에 Ruby 기반의 Jekyll, React 기반의 Gatsby 등이 유명했습니다. 하지만 지금은 이들이 거의 레거시가 되었고, 최근에는 Hugo와 Astro가 가장 주목받고 있습니다.

물론 Next.js나 Nuxt와 같은 더 범용적이고 유명한 프레임워크들도 SSG를 지원합니다. 하지만 저는 SSG에 더욱 특화된 프레임워크를 경험해보고 싶었고, 그 결과 Astro를 선택하게 되었습니다.

### Astro란?

Astro는 콘텐츠 중심의 웹사이트를 구축하기 위해 설계된 현대적인 SSG 프레임워크입니다. 기본적으로 제로 JavaScript를 지향하며, "Islands Architecture"를 통해 필요한 부분만 인터랙티브하게 만들어 뛰어난 성능을 제공합니다. React, Vue, Svelte 등 다양한 프레임워크를 함께 사용할 수 있으며, 마크다운 콘텐츠 관리를 위한 타입 세이프한 Content Collections API를 제공합니다. 블로그, 포트폴리오, 문서 사이트처럼 콘텐츠가 중심이 되고 높은 성능과 SEO가 중요한 프로젝트에 최적화되어 있습니다.

위 설명은 공식 문서에서 가져온 내용입니다. 하지만 실제로 사용하면서 가장 와닿았던 부분은 뛰어난 개발 경험(DX)이었습니다. `layouts`나 `pages`와 같은 파일 기반 라우팅이 기본으로 제공되고, `.astro` 확장자의 자체 문법은 매우 직관적이어서 배우기 쉬웠습니다. 최신 프레임워크답게 HMR을 지원하는 개발 서버가 내장되어 있고, 빌드 속도도 매우 빨랐습니다. TypeScript 지원 및 Tailwind CSS 같은 외부 라이브러리와의 통합도 훌륭했습니다.

<details>
<summary>아래는 간단한 <code>.astro</code> 파일의 예시입니다.</summary>

```astro
---
// 이 부분은 서버에서 실행되는 JavaScript 영역입니다 (frontmatter)
const title = "내 블로그";
const posts = [
  { id: 1, title: "첫 번째 글", date: "2024-01-01" },
  { id: 2, title: "두 번째 글", date: "2024-01-15" },
  { id: 3, title: "세 번째 글", date: "2024-02-01" },
];
---

<!-- 이 아래부터는 HTML 템플릿 영역입니다 -->
<!DOCTYPE html>
<html lang="ko">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>{title}</title>
  </head>
  <body>
    <header>
      <h1>{title}</h1>
    </header>
    
    <main>
      <ul>
        {posts.map((post) => (
          <li>
            <a href={`/posts/${post.id}`}>
              {post.title} - {post.date}
            </a>
          </li>
        ))}
      </ul>
    </main>
  </body>
</html>
```
</details>

### 미니멀한 디자인

이렇게 만들어진 새 블로그는 미니멀한 디자인을 갖추고 필요한 기능만 담았습니다. 디자인이 다소 단조롭고 폰트가 조금 크게 느껴질 수 있지만, 세부 조정은 차차 해나갈 예정입니다.

본 블로그의 템플릿이 마음에 드신다면 아래 링크에서 `Use this template`을 통해 자유롭게 사용하실 수 있습니다.

https://github.com/Guest-01/devlog-template