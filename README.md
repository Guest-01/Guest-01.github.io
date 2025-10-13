# 개발 블로그 템플릿

Astro 기반의 미니멀한 개발 블로그 템플릿입니다. 다크모드, 댓글 시스템, TOC, GitHub Pages 자동 배포를 지원합니다.

## 빠른 시작

```bash
npm install
npm run dev
```

## 설정하기

### 1. 사이트 정보 설정

`src/config/site.ts` 파일을 수정하세요:

```typescript
export const SITE = {
  name: '블로그 이름',
  title: '블로그 제목',
  description: '블로그 설명',
  author: {
    name: '작성자 이름',
    email: 'your-email@example.com',
    github: 'https://github.com/your-username',
  },
  comments: {
    giscusScript: `<!-- giscus.app에서 생성한 스크립트 -->`,
  }
};
```

### 2. 콘텐츠 작성

**블로그 포스트** (`src/content/blog/`):
```markdown
---
title: "포스트 제목"
publishDate: 2024-03-15
tags: ["React", "JavaScript"]
---

포스트 내용...
```

**프로젝트** (`src/data/projects.json`):
```json
{
  "projects": [
    {
      "title": "프로젝트 이름",
      "description": "프로젝트 설명",
      "technologies": ["React", "Node.js"],
      "links": {
        "github": "https://github.com/...",
        "demo": "https://..."
      }
    }
  ]
}
```

**이력서** (`src/data/resume.json`):
```json
{
  "profile": {
    "description": ["자기소개"]
  },
  "skills": {
    "frontend": ["React", "TypeScript"]
  },
  "experience": [...]
}
```

### 3. 댓글 설정 (선택)

1. [giscus.app](https://giscus.app)에서 설정
2. 생성된 스크립트를 `src/config/site.ts`의 `giscusScript`에 붙여넣기

## GitHub Pages 배포

1. 이 저장소를 포크
2. 저장소 Settings > Pages > Source를 "GitHub Actions"로 설정
3. `main` 브랜치에 push하면 자동 배포

배포 URL: `https://[사용자명].github.io/[저장소명]`

## 명령어

```bash
npm run dev        # 개발 서버
npm run build      # 프로덕션 빌드
npm run preview    # 빌드 미리보기
npm run astro check # 타입 체크
```

## 문제 해결

- **타입 오류**: `npm run astro check`로 확인
- **콘텐츠 안 보임**: 프론트매터 날짜 형식(`YYYY-MM-DD`) 확인
- **배포 실패**: GitHub Pages가 "GitHub Actions"로 설정되었는지 확인