---
title: 'GitHub Actions로 Docker 이미지를 자동으로 빌드하고 푸시하기'
description: '부제: Docker Hub 대신 ghcr.io를 사용해본 후기'
publishDate: 2025-12-01
tags: ['GitHub Actions', 'Docker', 'CI/CD']
draft: false
---

도커를 사용한 프로젝트를 진행하다 보면 도커 이미지를 빌드하고 배포하는 일이 자주 생깁니다. 처음에는 로컬에서 `docker build`를 통해 이미지를 만들고 실행해보면서 개발을 진행하기 마련이지만, 개발이 어느정도 완료되고 실제 배포 및 운영을 시작하게 되면 몇가지 고민이 생기게 됩니다.

첫번째로는 *운영 서버로 이미지를 어떻게 전달할 것인가*의 문제입니다. `docker build` 명령어는 로컬 저장소에 이미지를 빌드할 뿐입니다. 따라서 이걸 운영 서버에 전달하는 것은 또 다른 문제입니다. 물론 직접 `docker save`와 `scp`, `docker load` 등의 명령어를 통해 이미지를 옮길 수 있겠지만 일반적으로는 `Git` 저장소를 이용하는 것처럼 **도커 레지스트리(Docker Registry)**라고 불리는 원격 저장소에 이미지를 푸시하고 풀 받아 사용합니다.

두번째는 *이미지 빌드와 푸시를 어떻게 일관적/주기적으로 할 것인가*의 문제입니다. 이미지를 빌드하고 푸시할 때는 여러가지 옵션과 파라미터를 넣을 수 있습니다. 그리고 푸시하기 위한 권한, 인증을 위한 설정도 있어야합니다. 이것을 잘 설정해둔 PC에서 누군가가 주기적으로 코드가 변경될 때마다 빌드/푸시를 해주어야 합니다. 만일 여러 사람이 작업하거나, 다른 PC에서 하게된다면 이런 설정을 잘 복사해야하는 문제가 있습니다.

이런 문제들을 해결하기 위해 CI/CD 파이프라인을 구축하기로 했습니다. 목표는 간단했습니다. **코드를 푸시하면 자동으로 이미지가 빌드되고 레지스트리에 올라가는 것**. 이를 통해 일관된 빌드 환경을 보장하고, 반복 작업을 줄이며, 휴먼 에러를 방지할 수 있습니다.

### GitHub Actions란?

GitHub Actions는 GitHub에 내장된 CI/CD 플랫폼입니다. 별도의 서버를 구축하거나 외부 서비스에 가입할 필요 없이, 저장소에 YAML 파일 하나만 추가하면 바로 사용할 수 있습니다.

기본 개념은 간단합니다. 특정 이벤트(push, PR, schedule 등)가 발생하면 정의해둔 워크플로우가 실행됩니다. 워크플로우는 여러 개의 Job으로 구성되고, 각 Job은 여러 Step을 순차적으로 실행합니다.

```yaml
name: My Workflow
on: push  # 이벤트: 코드가 푸시되면

jobs:
  build:  # Job 이름
    runs-on: ubuntu-latest  # 실행 환경
    steps:  # 실행할 단계들
      - name: Step 1
        run: echo "Hello"
```

#### Jenkins와 비교

CI/CD 도구로 가장 유명한 것은 아마 Jenkins일 것입니다. 저도 회사에서 Jenkins를 사용해본 적이 있는데, GitHub Actions와 비교하면 몇 가지 차이점이 있습니다.

| 항목 | Jenkins | GitHub Actions |
|------|---------|----------------|
| 설치/운영 | 별도 서버 필요 | GitHub 내장 (설치 불필요) |
| 설정 방식 | Groovy 스크립트 (Jenkinsfile) | YAML |
| 비용 | 서버 유지비 | Public 무료, Private 분당 과금 |
| 생태계 | 플러그인 설치 | Marketplace Actions |
| 학습 곡선 | 상대적으로 높음 | 낮음 |

Jenkins는 매우 유연하고 강력하지만, 서버를 직접 운영해야 하고 설정이 복잡합니다. 반면 GitHub Actions는 GitHub 저장소를 사용한다면 바로 시작할 수 있고, YAML 문법도 직관적입니다. 소규모 프로젝트나 GitHub 중심의 워크플로우라면 GitHub Actions가 더 적합하다고 생각합니다.

### ghcr.io(GitHub Container Registry)란?

ghcr.io는 GitHub에서 제공하는 컨테이너 레지스트리입니다. GitHub Packages의 일부입니다.

#### Docker Hub와 비교

Docker 이미지를 저장하는 레지스트리로는 Docker Hub가 가장 유명합니다. 하지만 GitHub 프로젝트라면 ghcr.io가 몇 가지 장점이 있습니다.

| 항목 | Docker Hub | ghcr.io |
|------|------------|---------|
| Private 이미지 | 1개 무료, 이후 유료 | 무료 (저장소 용량 내) |
| 인증 | Access Token 별도 발급 | `GITHUB_TOKEN` 자동 제공 |
| GitHub 통합 | 수동 연결 | 저장소와 자동 연결 |
| Rate Limit | 익명 100pulls/6h | 상대적으로 관대 |

가장 큰 장점은 **인증의 편리함**입니다. Docker Hub를 사용하려면 Access Token을 발급받아 GitHub Secrets에 등록해야 합니다. 하지만 ghcr.io는 GitHub Actions에서 자동으로 제공되는 `GITHUB_TOKEN`을 그대로 사용할 수 있어서 별도의 설정이 필요 없습니다.

### 워크플로우 작성하기

이제 실제로 워크플로우를 작성해보겠습니다. `.github/workflows/` 디렉토리에 YAML 파일을 생성하면 됩니다.

```yaml
name: Docker Build & Publish

on:
  push:
    branches:
      - master

jobs:
  build-and-push:
    runs-on: ubuntu-latest
    permissions:
      contents: read
      packages: write

    steps:
      - name: Checkout code
        uses: actions/checkout@v4

      - name: Set up Docker Buildx
        uses: docker/setup-buildx-action@v3

      - name: Log in to GitHub Container Registry
        uses: docker/login-action@v3
        with:
          registry: ghcr.io
          username: ${{ github.actor }}
          password: ${{ secrets.GITHUB_TOKEN }}

      - name: Prepare image name
        run: |
          echo "IMAGE_NAME=$(echo ghcr.io/${{ github.repository_owner }}/my-app | tr '[:upper:]' '[:lower:]')" >> $GITHUB_ENV

      - name: Build and push Docker image
        uses: docker/build-push-action@v6
        with:
          context: .
          push: true
          tags: ${{ env.IMAGE_NAME }}:latest
          cache-from: type=gha
          cache-to: type=gha,mode=max
```

각 부분을 살펴보겠습니다.

#### 트리거 설정

```yaml
on:
  push:
    branches:
      - master
```

`master` 브랜치에 코드가 푸시되면 워크플로우가 실행됩니다. 필요에 따라 `main`이나 다른 브랜치로 변경하면 됩니다.

#### Permissions 설정

```yaml
permissions:
  contents: read
  packages: write
```

이 부분이 중요합니다. `contents: read`는 코드를 체크아웃하기 위해 필요하고, `packages: write`는 ghcr.io에 이미지를 푸시하기 위해 필요합니다. 이 설정이 없으면 `GITHUB_TOKEN`에 권한이 부여되지 않아 푸시가 실패합니다.

#### 주요 Actions

워크플로우에서 사용한 Actions들을 간단히 설명하면:

- **actions/checkout@v4**: 저장소 코드를 체크아웃합니다.
- **docker/setup-buildx-action@v3**: Docker Buildx를 설정합니다. 뒤에서 설명할 GHA 캐시 기능을 사용하려면 필요합니다.
- **docker/login-action@v3**: 컨테이너 레지스트리에 로그인합니다.
- **docker/build-push-action@v6**: 이미지를 빌드하고 푸시합니다.

#### 이미지 네이밍 규칙

ghcr.io는 이미지 이름에 **대문자를 허용하지 않습니다**. GitHub 사용자 이름이나 저장소 이름에 대문자가 포함되어 있다면 소문자로 변환해야 합니다.

```yaml
- name: Prepare image name
  run: |
    echo "IMAGE_NAME=$(echo ghcr.io/${{ github.repository_owner }}/my-app | tr '[:upper:]' '[:lower:]')" >> $GITHUB_ENV
```

`tr '[:upper:]' '[:lower:]'` 명령어로 대문자를 소문자로 변환하고, 결과를 환경 변수에 저장합니다.

#### 태깅 전략

위 예시에서는 단순히 `latest` 태그만 사용했지만, 실제 프로젝트에서는 더 다양한 태깅 전략을 사용할 수 있습니다.

```yaml
tags: |
  ${{ env.IMAGE_NAME }}:latest
  ${{ env.IMAGE_NAME }}:${{ github.sha }}
```

`github.sha`는 커밋 해시입니다. 이렇게 하면 특정 커밋의 이미지를 정확히 지정할 수 있어서, 롤백이나 디버깅 시 유용합니다.

### 빌드 캐시로 속도 개선

Docker 이미지 빌드는 시간이 오래 걸릴 수 있습니다. 특히 의존성 설치 단계가 포함되어 있다면 더욱 그렇습니다. GitHub Actions에서는 빌드 캐시를 활용해 이 시간을 크게 줄일 수 있습니다.

```yaml
- name: Build and push Docker image
  uses: docker/build-push-action@v6
  with:
    context: .
    push: true
    tags: ${{ env.IMAGE_NAME }}:latest
    cache-from: type=gha
    cache-to: type=gha,mode=max
```

`cache-from`과 `cache-to` 옵션이 핵심입니다.

- **cache-from: type=gha**: 이전 빌드의 캐시를 가져옵니다.
- **cache-to: type=gha,mode=max**: 현재 빌드의 모든 레이어를 캐시에 저장합니다.

`mode=max`는 최종 이미지뿐만 아니라 중간 레이어까지 모두 캐시하겠다는 의미입니다. 멀티스테이지 빌드를 사용한다면 이 옵션이 특히 유용합니다.

캐시를 적용하면 코드만 변경되고 의존성은 그대로인 경우, 빌드 시간이 절반 이하로 줄어들 수 있습니다. 물론 실제 효과는 Dockerfile 구조와 변경 내용에 따라 다릅니다.

### 배포된 이미지 사용하기

이제 빌드된 이미지를 서버에서 사용해보겠습니다.

```bash
docker pull ghcr.io/username/my-app:latest
docker run -d ghcr.io/username/my-app:latest
```

만약 이미지가 Private이라면 먼저 인증이 필요합니다.

```bash
# Personal Access Token으로 로그인
echo $PAT | docker login ghcr.io -u USERNAME --password-stdin

# 이후 pull 가능
docker pull ghcr.io/username/my-app:latest
```

PAT(Personal Access Token)는 GitHub Settings > Developer settings > Personal access tokens에서 발급받을 수 있습니다. `read:packages` 권한이 필요합니다.

#### Package Visibility 설정 (선택)

기본적으로 ghcr.io에 푸시된 이미지는 Private입니다 (저장소가 Public이더라도 마찬가지입니다). 앞서 PAT를 이용해 Private 이미지를 pull하는 방법을 설명했으므로, 굳이 Public으로 변경할 필요는 없습니다.

만약 누구나 인증 없이 이미지를 pull할 수 있도록 하고 싶다면, GitHub 저장소의 Packages 탭에서 해당 패키지의 설정을 변경하면 됩니다. 단, 한번 Public으로 변경하면 다시 Private으로 되돌릴 수 없으니 주의가 필요합니다.

---

이렇게 GitHub Actions와 ghcr.io를 활용하면 별도의 인프라 없이도 Docker 이미지 빌드와 배포를 자동화할 수 있습니다. 특히 GitHub 저장소를 사용하고 있다면, 인증 설정이 간편하고 저장소와 자연스럽게 연결되는 ghcr.io가 좋은 선택이 될 것 같습니다.
