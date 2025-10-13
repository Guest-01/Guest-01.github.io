# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## 프로젝트 개요
재사용 가능한 개발 블로그 템플릿입니다. Astro 5.12.0 + Content Collections 기반의 정적 사이트 생성기로, 콘텐츠 기반 구조를 사용합니다.

## 주요 명령어

### 개발 서버
```bash
npm run dev          # 개발 서버 실행 (localhost:4321)
npm run build        # 프로덕션 빌드 (./dist/ 폴더에 생성)
npm run preview      # 빌드 미리보기
```

### 코드 품질 검사
```bash
npm run astro check               # TypeScript 및 Astro 검사 (타입 체크 + 린팅)
```

### Astro CLI
```bash
npm run astro add <integration>    # 통합 추가
npm run astro -- --help          # CLI 도움말
```

## 코드 아키텍처

### 디렉토리 구조
- `src/config/site.ts`: 사이트 전역 설정 (이름, 네비게이션, giscus 댓글 등)
- `src/components/`: 재사용 가능한 컴포넌트
  - `Comments.astro`: giscus 댓글 시스템 (조건부 렌더링)
- `src/content/`: Content Collections (블로그 포스트)
  - `config.ts`: 스키마 정의
  - `blog/`: 마크다운 블로그 포스트
- `src/data/`: JSON 데이터 파일
  - `projects.json`: 프로젝트 정보
  - `resume.json`: 이력서 정보
- `src/layouts/Layout.astro`: 메인 레이아웃 (네비게이션, 다크모드, 플로팅 앱바)
- `src/pages/`: 페이지 컴포넌트 (동적 콘텐츠 로딩)
- `src/types/`: TypeScript 타입 정의

### Content Collections 스키마
**블로그 포스트** (`src/content/blog/`):
```typescript
{
  title: string,           // 포스트 제목 (필수)
  description?: string,    // 포스트 설명 (선택)
  publishDate: Date,       // 발행 날짜 (필수)
  updatedDate?: Date,      // 수정 날짜 (선택)
  tags: string[],          // 태그 배열 (기본값: [])
  draft: boolean           // 초안 여부 (기본값: false)
}
```

### 콘텐츠 관리 시스템
- **블로그**: Astro Content Collections로 마크다운 파일 관리 (Zod 스키마 검증)
- **프로젝트**: JSON 기반 구조화된 데이터
- **이력서**: JSON 기반 구조화된 데이터
- **설정**: TypeScript 설정 파일로 개인화

### 주요 기능
- **다크모드 지원**: 시스템 설정 감지, 로컬 저장소 유지, FOUC 방지 최적화
- **플로팅 네비게이션**: 스크롤 시 앱바 플로팅 효과 (20px 임계값)
- **giscus 댓글 시스템**: GitHub 기반 댓글, 다크모드 자동 동기화
- **반응형 디자인**: 768px 브레이크포인트, 모바일 최적화
- **타입 안전성**: Content Collections + Zod 스키마 검증
- **자동 날짜 정렬**: 블로그 포스트 최신순 정렬 및 한국어 포맷팅

## 템플릿 사용법

### 1. 개인화 설정
`src/config/site.ts`에서 개인 정보 수정:
- 이름, 이메일, 소셜 링크
- 네비게이션 메뉴 구성
- 사이트 메타데이터
- **giscus 댓글**: `comments.giscusScript`에 giscus.app에서 생성된 스크립트 붙여넣기

### 2. 콘텐츠 추가
- **블로그**: `src/content/blog/` 에 마크다운 파일 추가
- **프로젝트**: `src/data/projects.json` 수정
- **이력서**: `src/data/resume.json` 수정

### 3. 댓글 시스템 활성화
- giscus.app에서 저장소 설정 후 스크립트 생성
- `src/config/site.ts`의 `giscusScript` 필드에 붙여넣기
- 자동으로 블로그 포스트에 댓글 기능 활성화
- 다크모드 토글 시 댓글 테마 자동 동기화

## 스타일링 시스템
- 컴포넌트별 스코프 스타일
- 일관된 다크모드 색상 시스템
- 반응형 디자인 (768px 브레이크포인트)
- 고정폭 폰트 날짜 표시

## UI/UX 시스템

### 다크모드 구현
- **FOUC 방지**: 인라인 스크립트로 즉시 테마 적용
- **시스템 연동**: `prefers-color-scheme` 자동 감지
- **상태 유지**: localStorage로 사용자 선택 기억
- **전역 동기화**: `data-theme` 속성으로 모든 컴포넌트 연동

### 플로팅 네비게이션
- **트리거**: 스크롤 20px 이후 플로팅 효과 활성화
- **스타일**: 둥근 모서리, 그림자, 반투명 배경 (backdrop-filter)
- **성능**: `passive: true` 스크롤 이벤트 최적화
- **반응형**: 모바일에서 패딩 및 여백 최적화

### giscus 댓글 통합
- **조건부 렌더링**: 스크립트 존재 시에만 댓글 섹션 표시
- **테마 동기화**: 다크모드 토글 시 실시간 테마 변경
- **초기화**: iframe 로드 완료 후 현재 테마 적용
- **안전성**: 타이밍 처리 및 무한 루프 방지

## 기술 스택
- **프레임워크**: Astro 5.12.0
- **언어**: TypeScript (strict 모드)
- **콘텐츠**: Content Collections + JSON
- **스타일링**: 스코프 CSS
- **타입 체크**: Zod 스키마 + TypeScript
- **댓글 시스템**: giscus (GitHub 기반)

## 개발 상태
- ✅ Content Collections 설정 완료
- ✅ 동적 콘텐츠 로딩 구현
- ✅ 다크모드 완전 지원 (FOUC 방지 포함)
- ✅ 플로팅 네비게이션 구현
- ✅ giscus 댓글 시스템 통합 (다크모드 동기화)
- ✅ TypeScript 타입 정의 완료
- ✅ 템플릿화 완료