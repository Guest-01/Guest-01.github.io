---
title: "Content Collections로 타입 안전한 콘텐츠 관리하기"
description: "Astro Content Collections의 강력한 타입 안전성을 활용하는 방법"
publishDate: 2024-02-20
tags: ["astro", "typescript", "content-collections"]
draft: false
---

# Content Collections란?

Content Collections는 Astro에서 마크다운 및 MDX 콘텐츠를 타입 안전하게 관리할 수 있는 기능입니다.

## 왜 Content Collections를 사용할까?

### 타입 안전성
Zod 스키마를 통해 frontmatter의 타입을 검증합니다.

```typescript
import { z, defineCollection } from 'astro:content';

const blogCollection = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    publishDate: z.date(),
    tags: z.array(z.string()).default([]),
  }),
});
```

### 자동 완성
TypeScript가 콘텐츠 필드를 인식하여 IDE에서 자동 완성을 제공합니다.

### 빌드 타임 검증
잘못된 frontmatter가 있으면 빌드 시점에 에러를 발생시킵니다.

## 사용 예시

```typescript
import { getCollection } from 'astro:content';

const blogPosts = await getCollection('blog', ({ data }) => {
  return data.draft !== true;
});
```

## 결론

Content Collections를 사용하면 대규모 콘텐츠 사이트도 안전하게 관리할 수 있습니다.
