export const SITE = {
  name: 'HH. Jang', // 사이트 이름 (네비게이션 로고)
  title: 'HH. Jang - Dev Blog', // 기본 페이지 제목 (브라우저 탭)
  description: 'A personal blog for sharing what I learn.', // SEO를 위한 기본 사이트 설명
  author: {
    name: '장호현', // 작성자 이름
    profile: 'https://avatars.githubusercontent.com/u/49602144?v=4', // 프로필 사진 경로 (선택 사항)
    email: 'cloudonly21@gmail.com', // 이메일 주소
    github: 'https://github.com/Guest-01', // GitHub 프로필 URL
    // linkedin: '', // LinkedIn 프로필 URL
  },
  
  // giscus 댓글 시스템 설정
  comments: {
    // giscus.app에서 생성된 스크립트를 아래에 붙여넣으세요
    // 빈 문자열이면 댓글이 비활성화됩니다
    giscusScript: `
      <!-- giscus.app에서 생성된 스크립트를 여기에 붙여넣으세요 -->
      <script src="https://giscus.app/client.js"
        data-repo="Guest-01/Guest-01.github.io"
        data-repo-id="R_kgDOQBRo6w"
        data-category="Announcements"
        data-category-id="DIC_kwDOQBRo684Cwkrj"
        data-mapping="pathname"
        data-strict="0"
        data-reactions-enabled="1"
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
