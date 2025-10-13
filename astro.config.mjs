// @ts-check
import { defineConfig } from 'astro/config';

// GitHub Pages 배포를 위한 동적 설정
const isGitHubPages = process.env.GITHUB_ACTIONS === 'true';
const repositoryName = process.env.GITHUB_REPOSITORY?.split('/')[1] || '';
const repositoryOwner = process.env.GITHUB_REPOSITORY_OWNER || '';

// username.github.io 형태의 특수 저장소인지 확인
const isUserSite = repositoryName === `${repositoryOwner}.github.io`;

// https://astro.build/config
export default defineConfig({
  // GitHub Pages에서는 site URL 설정 (SEO, RSS 등에 필요)
  site: isGitHubPages 
    ? `https://${repositoryOwner}.github.io`
    : 'http://localhost:4321',
  
  // username.github.io 저장소는 루트에서 서빙, 일반 저장소는 서브패스에서 서빙
  base: isGitHubPages && !isUserSite ? `/${repositoryName}/` : '/',
});
