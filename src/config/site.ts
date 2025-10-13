export const SITE = {
  name: 'TIL', // 사이트 이름 (네비게이션 로고)
  title: 'TIL - Today I Learned', // 기본 페이지 제목 (브라우저 탭)
  description: 'A personal blog for sharing what I learn.', // SEO를 위한 기본 사이트 설명
  author: {
    name: '홍재훈', // 작성자 이름
    profile: '/profile-picture.png', // 프로필 사진 경로 (선택 사항)
    email: 'your-email@example.com', // 이메일 주소
    github: 'https://github.com/your-username', // GitHub 프로필 URL
    linkedin: 'https://linkedin.com/in/your-username', // LinkedIn 프로필 URL
  },
  
  // giscus 댓글 시스템 설정
  comments: {
    // giscus.app에서 생성된 스크립트를 아래에 붙여넣으세요
    // 빈 문자열이면 댓글이 비활성화됩니다
    giscusScript: `
      <!-- giscus.app에서 생성된 스크립트를 여기에 붙여넣으세요 -->
      <script src="https://giscus.app/client.js"
        data-repo="Guest-01/devlog-template"
        data-repo-id="R_kgDOPXxtWQ"
        data-category="Announcements"
        data-category-id="DIC_kwDOPXxtWc4CuJlk"
        data-mapping="pathname"
        data-strict="0"
        data-reactions-enabled="0"
        data-emit-metadata="0"
        data-input-position="bottom"
        data-theme="light"
        data-lang="ko"
        crossorigin="anonymous"
        async>
</script>
    `.trim()
  }
};
