---
title: '안드로이드 PWA, 결국 Chrome 설치를 권하게 된 이유'
description: '삼성 인터넷의 PWA 설치 실패와 인앱 브라우저를 거치며 설치 경로를 Chrome으로 정리한 과정'
publishDate: 2026-09-14
tags: ['PWA', 'Android', '트러블슈팅']
draft: true
---

<!--
  초안입니다. draft: true 라서 사이트에는 나오지 않습니다.
  "TODO" 로 표시한 곳은 저장소 기록만으로는 알 수 없어 비워 둔 부분입니다.
  이미지는 이 폴더에 파일을 넣고 ![설명](./파일명.png) 으로 바꿔 주세요.
-->

> 이 글은 AI와 함께 작성했습니다.

최근에 [펼침](https://github.com/Guest-01/text-viewer-pwa)이라는 모바일 txt 뷰어를 PWA로 만들었습니다. 앱 스토어를 거치지 않고 브라우저에서 바로 설치해서, 홈 화면 아이콘으로 열고 오프라인에서도 쓰는 것이 목표였습니다.

PWA는 "한 번 만들면 어디서나 설치된다"고들 하지만, 실제로 안드로이드에서 설치 버튼을 누르게 만들기까지는 생각보다 여러 번 막혔습니다. 삼성 인터넷에서는 설치가 실패했고, 우회해서 설치에 성공한 뒤에도 문제가 남았으며, 카카오톡으로 공유한 링크에서는 설치 자체가 불가능했습니다. 결국 **안드로이드에서는 Chrome으로 설치하도록 안내한다**는 결론에 이르렀는데, 이 글은 그 과정을 정리한 것입니다.

<!-- TODO: 확인한 환경을 적어 주세요. 예: 기기 모델, Android 버전, 삼성 인터넷 버전, Chrome 버전 -->

이 글의 내용은 2026년 9월 기준입니다. 브라우저 쪽 문제는 언제든 고쳐질 수 있으니 시점을 감안하고 읽어주세요. 글에 실은 코드는 설명을 위해 실제 코드를 조금 줄인 것입니다.

### 목표: 설치, 그리고 공유로 파일 받기

펼침에서 PWA로 얻고 싶었던 것은 세 가지입니다.

1. 홈 화면에 설치해 주소창 없이 전체 화면으로 실행
2. 오프라인에서도 동작
3. 파일 관리자에서 txt 파일을 "공유"하면 펼침이 받아서 열기

3번은 [Web Share Target](https://developer.mozilla.org/en-US/docs/Web/Progressive_web_apps/Manifest/Reference/share_target)으로 구현합니다. 매니페스트에 `share_target`을 선언하면 설치된 PWA가 안드로이드의 공유 대상 목록에 나타납니다. 파일을 받아야 하므로 `POST`와 `multipart/form-data`를 씁니다.

```json
{
  "share_target": {
    "action": "./share-target",
    "method": "POST",
    "enctype": "multipart/form-data",
    "params": {
      "title": "title",
      "text": "text",
      "url": "url",
      "files": [
        { "name": "file", "accept": ["text/plain", "text/markdown", ".txt", ".text", ".md", ".log"] }
      ]
    }
  }
}
```

Chrome에서는 이대로 설치도 되고 공유도 잘 받았습니다. 문제는 삼성 인터넷이었습니다.

### 삼성 인터넷에서 설치가 실패한다

삼성 인터넷에서 설치를 누르면 **"다운로드하지 못했습니다"**라는 메시지와 함께 설치가 실패했습니다.

<!-- TODO 이미지: 삼성 인터넷의 설치 실패 화면 캡처 -->

안드로이드에서 PWA를 "앱처럼" 설치하면 브라우저는 WebAPK라는 작은 APK를 만들어 설치합니다. 이 APK는 기기에서 만들어지는 것이 아니라 브라우저 제조사의 서버가 매니페스트를 읽어 만들어 주는데, 삼성 인터넷은 Chrome과 별개로 자체 서버를 씁니다. 그리고 이 서버가 `share_target`(`POST`)이 들어 있는 매니페스트를 처리하지 못했습니다.

<!-- TODO: share_target 이 원인이라는 것을 어떻게 알아냈는지 적어 주세요.
     (예: 매니페스트 항목을 하나씩 빼 보며 확인, 원격 디버깅 로그 등)
     이 글에서 독자가 가장 궁금해할 대목입니다. -->

같은 매니페스트로 Chrome에서는 문제없이 설치되므로, 매니페스트가 잘못된 것이 아니라 삼성 인터넷 쪽의 제약입니다.

### 우회: 삼성 인터넷에만 다른 매니페스트 주기

`share_target`만 빼면 설치가 된다면, 삼성 인터넷에만 그것을 뺀 매니페스트를 주면 됩니다. `share_target`을 제외하고는 내용이 완전히 같은 `manifest-samsung.webmanifest`를 하나 더 만들고, `<head>`에서 User-Agent를 보고 바꿔 끼웁니다.

```html
<link rel="manifest" id="manifest-link" href="./manifest.webmanifest">
<script>
  // 삼성 인터넷에만 share_target을 뺀 매니페스트를 연결한다
  if (/SamsungBrowser/i.test(navigator.userAgent)) {
    document.getElementById('manifest-link').href = './manifest-samsung.webmanifest';
    document.documentElement.classList.add('no-share');
  }
</script>
```

브라우저가 매니페스트를 읽기 전에 바꿔야 하므로 `<link>` 바로 아래의 인라인 스크립트로 넣었습니다.

`html`에 붙인 `no-share` 클래스는 안내 문구를 위한 것입니다. 설치 안내 카드에 "파일 관리자에서 공유로 바로 보낼 수 있다"는 문구가 있는데, 삼성 인터넷으로 설치한 앱에서는 이 기능이 빠지므로 약속하면 안 됩니다. CSS에서 `.no-share .share-only { display: none; }`으로 그 문구만 숨깁니다.

이 방식의 단점은 매니페스트가 두 벌이 된다는 것입니다. 이름이나 색을 바꿀 때 두 파일을 함께 고쳐야 합니다. 대신 삼성이 서버를 고치면 스크립트, 사본 매니페스트, `.no-share` 규칙만 지우고 원래대로 돌아가면 되도록 한곳에 모아 두었습니다.

### 설치는 되지만 남는 문제들

이제 삼성 인터넷에서도 설치가 됩니다. 하지만 설치 과정과 설치 후의 모습에서 문제가 두 가지 더 나왔습니다.

**첫째, Play 프로텍트가 설치를 막습니다.** Android 14 이상에서 삼성 인터넷으로 설치하면 "안전하지 않은 앱 차단됨" 경고가 뜹니다. 삼성 인터넷이 만드는 WebAPK의 `targetSdk`가 낮아서, 오래된 안드로이드 버전용 앱으로 취급되기 때문입니다. "더 알아보기"를 눌러 "무시하고 설치"로 통과할 수는 있지만, 처음 보는 사용자에게 "안전하지 않은 앱"이라는 경고를 넘기라고 할 수는 없습니다. 삼성 인터넷 저장소에도 [같은 문제가 보고](https://github.com/SamsungInternet/support/issues/123)되어 있고, 같은 PWA를 Chrome으로 설치하면 경고가 뜨지 않습니다.

<!-- TODO 이미지: Play 프로텍트 "안전하지 않은 앱 차단됨" 경고 화면 캡처 -->

**둘째, 화면 위아래에 검은 띠가 남습니다.** 설치한 앱을 열면 상태 바와 하단 제스처 핸들 영역이 검게 남아, 전체 화면으로 책만 보이게 하려던 의도와 달라집니다. 삼성 인터넷이 만드는 앱 껍데기가 시스템 바 영역을 앱 화면 밖에 두고, 다크 모드에서는 매니페스트의 밝은 `theme_color`를 받아들이지 않기 때문입니다.

<!-- TODO 이미지: 삼성 인터넷으로 설치한 앱의 검은 띠 화면 캡처 (가능하면 Chrome 설치본과 나란히) -->

두 가지 모두 브라우저가 만드는 앱 껍데기의 문제라서 웹 앱의 코드로는 고칠 수 없습니다. 여기에 공유로 파일 받기가 빠진 것까지 더하면, 삼성 인터넷으로 설치한 펼침은 처음 목표했던 세 가지 중 하나를 잃고 나머지도 온전하지 않은 상태가 됩니다.

### 결정: Chrome에서 설치하도록 안내하기

그래서 방향을 바꿨습니다. 삼성 인터넷에서도 설치가 "되게" 만드는 데서 멈추지 않고, **Chrome에서 설치하도록 권하기로** 했습니다.

삼성 인터넷으로 접속하면 설치 안내 카드의 내용이 달라집니다.

- 본문: "삼성 인터넷으로 설치하면 Play 프로텍트 경고가 뜨고 화면 위아래에 검은 띠가 남습니다. Chrome으로 설치하면 이런 문제가 없습니다."
- 주 버튼: **Chrome에서 설치**
- 보조 버튼: 여기서 설치

삼성 인터넷으로 설치하는 길을 막지는 않았습니다. 문제를 알고도 삼성 인터넷을 쓰고 싶은 사람은 "여기서 설치"를 누르면 됩니다.

"Chrome에서 설치" 버튼은 안드로이드의 `intent://` 주소로 현재 페이지를 Chrome에서 엽니다.

```js
// Android에서 target을 Chrome으로 여는 intent 주소
function chromeIntentUrl(target) {
  const u = new URL(target);
  return `intent://${u.host}${u.pathname}${u.search}`
    + `#Intent;scheme=${u.protocol.replace(':', '')}`
    + `;package=com.android.chrome`
    + `;S.browser_fallback_url=${encodeURIComponent(target)};end`;
}

installChromeButton.addEventListener('click', () => {
  location.href = chromeIntentUrl(new URL('./', location.href).href);
});
```

`package=com.android.chrome`으로 여는 앱을 Chrome으로 지정하고, `S.browser_fallback_url`에는 Chrome이 없을 때 대신 열 주소를 넣습니다. 이 주소는 사용자가 버튼을 누른 동작 안에서만 동작하므로, 페이지가 뜨자마자 자동으로 보내는 식으로는 쓸 수 없습니다.

### 또 다른 입구: 인앱 브라우저

Chrome으로 안내하기로 정하고 나니 입구가 하나 더 보였습니다. 펼침의 링크를 카카오톡으로 받은 사람은 카카오톡 안의 브라우저로 페이지를 열게 됩니다.

카카오톡, 라인, 네이버, 인스타그램 같은 앱의 인앱 브라우저에서는 PWA를 설치할 수 없습니다. 설치가 가능할 때 브라우저가 보내는 `beforeinstallprompt` 이벤트가 오지 않기 때문에, 설치 안내 카드도 뜨지 않습니다. 사용자는 설치할 수 있다는 사실조차 모르고 지나갑니다.

그래서 인앱 브라우저를 감지하면 설치 카드 대신 "이 브라우저에서는 앱으로 설치할 수 없습니다"라는 카드와 **브라우저에서 열기** 버튼을 보여주기로 했습니다. 감지는 User-Agent로 합니다.

```js
// 반환: null(일반 브라우저) | { app: 'kakao'|'line'|'other', android, ios }
function inAppBrowser() {
  const ua = navigator.userAgent;
  const android = /Android/i.test(ua);
  const ios = /iPhone|iPad|iPod/i.test(ua);
  let app = null;
  if (/KAKAOTALK/i.test(ua)) app = 'kakao';
  else if (/\bLine\//i.test(ua)) app = 'line';
  else if (/NAVER\(inapp|DaumApps|Instagram|FBAN|FBAV|FB_IAB|; wv\)/i.test(ua)) app = 'other';
  // iOS WebView에는 Safari 토큰이 없다
  else if (ios && !/Safari\//i.test(ua)) app = 'other';
  return app ? { app, android, ios } : null;
}
```

탈출 방법이 따로 있는 카카오톡과 라인만 구분하고, 나머지는 하나로 묶었습니다.

### Chrome을 먼저 여는 탈출

인앱 브라우저에서 외부 브라우저로 내보내는 방법은 이미 알려진 것들이 있습니다.

| 앱 | 방법 | 비고 |
|---|---|---|
| 카카오톡 | `kakaotalk://web/openExternal?url=...` | 비공식이지만 널리 쓰이는 스킴 |
| 라인 | 주소에 `openExternalBrowser=1` 파라미터 추가 | 공식 |

처음에는 이 방법들을 그대로 썼습니다. 그런데 두 방법 모두 기기의 **기본 브라우저**로 열어 줍니다. 삼성 기기의 기본 브라우저는 삼성 인터넷이므로, 카카오톡에서 빠져나온 사용자는 앞에서 본 문제들이 있는 삼성 인터넷에 도착합니다. Chrome으로 안내하겠다는 결정과 어긋납니다.

그래서 순서를 바꿨습니다. 안드로이드에서는 어느 인앱 브라우저든 **Chrome intent를 먼저 시도**하고, 그것이 막혔을 때만 앱별 방법으로 넘어갑니다.

```js
// 앞에서부터 차례로 시도할 주소들. 비어 있으면 방법이 없는 것 (iOS의 일반 WebView)
function externalBrowserUrls(inApp, target) {
  const urls = [];
  if (inApp.android) urls.push(chromeIntentUrl(target));
  if (inApp.app === 'kakao') {
    urls.push('kakaotalk://web/openExternal?url=' + encodeURIComponent(target));
  }
  if (inApp.app === 'line') {
    const u = new URL(target);
    u.searchParams.set('openExternalBrowser', '1');
    urls.push(u.href);
  }
  return urls;
}
```

#### 실패를 어떻게 알아내는가

어려운 부분은 "이 방법이 막혔다"는 것을 알아내는 일입니다. `location.href`에 주소를 넣는 것만으로는 성공했는지 실패했는지 알려주는 값이 돌아오지 않습니다. 그래서 두 가지 신호를 씁니다.

**하나는 시간입니다.** 외부 브라우저가 실제로 열리면 지금 페이지는 화면에서 가려집니다. 1.5초가 지났는데도 페이지가 여전히 보이고 있다면 그 방법은 막힌 것으로 보고 다음 방법을 시도합니다.

**다른 하나는 페이지가 다시 뜨는 경우입니다.** Chrome이 설치되어 있지 않으면 intent는 `browser_fallback_url`에 적어 둔 주소, 즉 지금 이 페이지를 인앱 브라우저 안에서 다시 엽니다. 페이지가 새로 로드되면 타이머도 변수도 사라지므로, 시도하기 전에 "다음에 할 차례"를 `sessionStorage`에 적어 둡니다. 페이지가 뜰 때 그 값이 남아 있으면 앞선 시도가 실패해 되돌아온 것이므로, 사용자가 버튼을 다시 누르지 않아도 다음 방법을 바로 이어갑니다.

```js
const STEP_KEY = 'tv.inappEscapeStep';

function tryEscape(urls, step) {
  if (step >= urls.length) {
    sessionStorage.removeItem(STEP_KEY);
    showFallback(); // 주소 붙여넣기 안내
    return;
  }
  sessionStorage.setItem(STEP_KEY, String(step + 1));
  setTimeout(() => {
    if (document.visibilityState === 'visible') tryEscape(urls, step + 1);
  }, 1500);
  location.href = urls[step];
}

// 외부 브라우저가 실제로 열렸다면 진행 단계를 지운다
document.addEventListener('visibilitychange', () => {
  if (document.visibilityState === 'hidden') sessionStorage.removeItem(STEP_KEY);
});

// 진행 단계가 남은 채 페이지가 새로 떴다면 앞선 시도가 되돌아온 것
const resumeStep = Number(sessionStorage.getItem(STEP_KEY)) || 0;
if (resumeStep > 0) tryEscape(externalBrowserUrls(inApp, target), resumeStep);
```

성공해서 페이지가 가려질 때 단계를 지우는 것도 중요합니다. 지우지 않으면 나중에 인앱 브라우저로 돌아와 버튼을 다시 눌렀을 때 Chrome을 건너뛰고 다음 방법부터 시작하게 됩니다.

모든 방법이 실패하면 마지막 수단으로 주소 붙여넣기를 안내합니다. 클립보드 복사는 사용자 동작 안에서만 허용되므로, 버튼을 누른 순간에 주소를 미리 복사해 두고 실패했을 때는 "주소를 복사했습니다. 브라우저 주소창에 붙여넣어 주세요"라는 안내만 보여줍니다.

한 가지 더, 페이지가 뜨자마자 자동으로 내보내지는 않았습니다. intent가 사용자 동작을 요구하기도 하지만, 공유된 링크를 잠깐 보려던 사람을 다른 앱으로 쫓아내고 싶지 않았기 때문입니다.

### 남은 한계

이렇게 정리하고도 해결하지 못한 것들이 있습니다.

- **삼성 인터넷과 Chrome은 저장소가 분리되어 있습니다.** 펼침은 책을 서버가 아니라 브라우저의 IndexedDB에 저장합니다. 삼성 인터넷 탭에서 넣어 둔 책은 Chrome으로 설치한 앱에서 보이지 않습니다. 그래서 안내 카드에 "여기서 넣어 둔 책은 Chrome으로 옮겨지지 않습니다"라는 문장을 넣었습니다.
- **iOS의 일반적인 인앱 브라우저에는 탈출 방법이 없습니다.** 카카오톡과 라인을 제외하면 주소를 복사해 붙여넣게 하거나 "다른 브라우저로 열기" 메뉴를 안내하는 것이 전부입니다.
- **카카오톡의 탈출 스킴은 비공식입니다.** 언제든 동작하지 않게 될 수 있어서, 주 경로가 아니라 차선책으로만 둡니다.
- **Chrome이 없는 기기도 있습니다.** 이 경우에는 앱별 방법으로 기본 브라우저를 열고, 삼성 인터넷이라면 "여기서 설치"로 설치할 수 있습니다.

### 마치며

정리하면, 안드로이드에서 PWA의 설치 경로는 이렇게 됐습니다.

| 들어온 곳 | 안내 |
|---|---|
| Chrome | 그대로 설치 |
| 삼성 인터넷 | Chrome에서 설치를 권하고, 여기서 설치는 보조로 남김 |
| 인앱 브라우저 | Chrome으로 열기를 먼저 시도하고, 안 되면 기본 브라우저, 그것도 안 되면 주소 붙여넣기 |

처음에는 "삼성 인터넷에서 설치가 안 된다"는 버그 하나를 고치려던 것이었는데, 고치고 보니 설치가 되는 것과 쓸 만하게 설치되는 것은 다른 문제였습니다. 모든 브라우저에서 똑같이 동작하게 만드는 대신, 제대로 동작하는 한 곳으로 사용자를 데려가는 쪽이 더 나은 경험이 될 때도 있다는 것을 배웠습니다.

PWA는 표준이지만 설치는 브라우저마다 구현이 다릅니다. 국내 안드로이드 사용자를 대상으로 PWA를 만든다면 Chrome만 확인하지 말고 삼성 인터넷과 카카오톡 인앱 브라우저에서도 설치 과정을 직접 밟아 보기를 권합니다.

<!-- TODO: 마무리 소감은 제가 쓴 것이니, 실제 생각과 다르면 고쳐 주세요. -->
