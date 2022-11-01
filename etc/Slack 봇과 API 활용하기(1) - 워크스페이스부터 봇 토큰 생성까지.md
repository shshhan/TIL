최근 슬랙 봇을 활용하여 알림을 보내는 기능을 구현하고 사용 중입니다.

아직 슬랙에 익숙하진 않지만 평소에 생각만 하던 기능을 봇으로 구현해보니 추후에 또 다른 봇을 만들어 활용할 수 있겠다는 생각이 들었습니다!
그래서 추후 다시 봇을 만들 제가 참고하기 위하여, 그리고 저처럼 이제 막 슬랙 봇을 알아가는 분들을 위하여 제가 봇을 만들었던 과정과 활용한 내용을 함께 기록 해두려고 합니다 :)

## 슬랙 워크스페이스 생성

슬랙 봇은 워크스페이스를 바탕으로 생성할 수 있으므로, 만약 슬랙에 처음 가입하여 워크스페이스가 없다면 우선 새 워크스페이스를 개설해야 합니다.

![](https://velog.velcdn.com/images/shawnhansh/post/177b3138-2858-423d-8376-28b1601fc3d0/image.png)

슬랙 메인 좌측의 워크스페이스가 모여있는 메뉴의 + 버튼을 눌러 새 워크스페이스를 개설할 수 있습니다.

![](https://velog.velcdn.com/images/shawnhansh/post/c3723c62-9451-4b90-8860-b1e3b903070a/image.png)

이후에 나오는 정보 입력은 간단한 내용들이니 스킵하도록 하겠습니다.

## 슬랙 봇 생성
![](https://velog.velcdn.com/images/shawnhansh/post/728d2e92-d311-40ba-9935-825a6ebc3061/image.png)

[슬랙 help center](https://slack.com/intl/ko-kr/help)에서 검색창에 봇을 입력하면 이렇게 자동완성 검색어가 나타납니다.



## 앱 생성

[슬랙 api center의 앱 생성 화면](https://api.slack.com/apps?new_app=1)으로 접속하여 앱 생성을 시작해보겠습니다.

![](https://velog.velcdn.com/images/shawnhansh/post/7e74823b-e319-44ca-b66e-8ab8e7951f1e/image.png)

![](https://velog.velcdn.com/images/shawnhansh/post/8869fdf4-a6dc-4a12-af29-638c745c069e/image.png)

처음 뜨는 팝업창에서 From scratch를 선택합니다.
만약 팝업창이 뜨지 않았다면 바깥 화면 좌측 상단에 Create New App 버튼을 클릭하면 해당 팝업이 열립니다.

![](https://velog.velcdn.com/images/shawnhansh/post/80e71098-74cd-42d5-ae1a-d467621a055d/image.png)

앱 이름을 입력하고 앱을 사용할 워크스페이스를 설정해주세요.
앱 이름은 추후에도 변경 가능하지만, 워크스페이스는 한번 설정하면 변경이 불가합니다.
설정을 완료하면 Create App 버튼을 클릭하여 생성을 마무리 합니다.

## 봇 설정

![](https://velog.velcdn.com/images/shawnhansh/post/287785d5-7249-4d2e-b153-5d1026320531/image.png)

봇 생성이 끝나면 Basic Information으로 이동하게 됩니다.
이 화면에서는 앱에 기능을 추가하거나 접속 정보를 확인할 수 있습니다.

![](https://velog.velcdn.com/images/shawnhansh/post/ead95c08-7d99-4753-9244-db5bbfc7dd93/image.png)

Add features and funtionality 드랍 다운 버튼을 클릭하여 하위 메뉴 중 Bots를 선택합니다.

### 토큰 설정

![](https://velog.velcdn.com/images/shawnhansh/post/89818d89-37b7-4d74-875a-57512c0a8ce8/image.png)

App Home 화면으로 이동했습니다.
봇을 생성하기 위해서는 봇 토큰의 Scope을 설정해야 합니다.
Review Scopes To Add 버튼을 클릭합니다.

![](https://velog.velcdn.com/images/shawnhansh/post/781679b8-7a24-45c0-8cdd-eaf46150fd52/image.png)

OAuth & Permissions 화면으로 이동했습니다.
스크롤을 내려 Scopes 설정 화면에서 Add an OAuth Scope 버튼을 선택합니다.

![](https://velog.velcdn.com/images/shawnhansh/post/9a7de440-0b62-4742-a5c4-c661e2fa190a/image.png)

그리고 본인이 이용할 봇의 토큰에 필요한 Scope를 추가해줍니다.

그럼 여기에서 Scope이 무엇인지, 어떤 Scope을 추가할지에 대한 의문이 생길 수 있습니다.
봇 토큰의 Scope은 '봇의 권한'이라고 이해하면 편합니다.
추후 Slack API를 이용할 때 봇 토큰에 대한 특정 Scope을 요구하는데, 
봇의 토큰이 해당 Scope을 갖고 있지 않다면 해당 API 이용이 어렵습니다.

![](https://velog.velcdn.com/images/shawnhansh/post/bb8ba1d9-1742-4e1f-9964-02e68ece13ea/image.png)



[Slack API문서](https://api.slack.com/apis)를 확인하여 이용할 API를 미리 알아본 뒤 Scope을 설정하고
개발 단계에서 추가로 필요한 Scope이 생긴다면 언제든 추가할 수 있습니다.

저는 우선 봇이 채널에 메세지를 발송할 수 있는 chat.postMessage API만 이용한다고 가정하고 진행하도록 하겠습니다.

![](https://velog.velcdn.com/images/shawnhansh/post/f1730c89-73c1-4b83-a173-1676fe3163f0/image.png)

토큰의 Scope 설정이 마무리되었다면 스크롤을 조금 올려 OAuth Tokens for Your Workspace 항목의 Install to Workspace 버튼을 클릭합니다.

![](https://velog.velcdn.com/images/shawnhansh/post/7c881650-fc4d-4244-96e7-f3e44da32483/image.png)

봇이 워크스페이스에 대한 엑세스 권한 요청 화면이 나타납니다.
허용 버튼을 선택하고 넘어갑니다.

![](https://velog.velcdn.com/images/shawnhansh/post/9ccbd841-92d4-40d2-ac9b-fb331a683ceb/image.png)

Bot User OAuth Token이 생성되었습니다.

이제 소스에서 이 토큰을 활용하여 Slack API를 활용할 수 있습니다.
소스에서의 내용은 다음 포스팅에서 다루도록 하겠습니다.

---
출처
슬랙 help center
https://slack.com/intl/ko-kr/help/articles/115005265703-%EC%9B%8C%ED%81%AC%EC%8A%A4%ED%8E%98%EC%9D%B4%EC%8A%A4%EC%97%90-%EB%8C%80%ED%95%9C-%EB%B4%87-%EC%83%9D%EC%84%B1