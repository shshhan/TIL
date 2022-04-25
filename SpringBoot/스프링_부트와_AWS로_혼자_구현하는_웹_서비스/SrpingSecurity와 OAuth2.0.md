> 해당 내용은 [이동욱님](https://jojoldu.tistory.com/) 저서 '[스프링 부트와 AWS로 혼자 구현하는 웹 서비스](http://www.kyobobook.co.kr/product/detailViewKor.laf?ejkGb=KOR&mallGb=KOR&barcode=9788965402602)'를 공부하며 정리한 내용입니다.

## Spring Security
- 스프링 기반 애플리케이션의 보안을 위한 표준
- 인증(Authentication)과 인가(Authroization) 기능을 가진 프레임워크
	
    - 인증 : 어떤 개체(사용자 또는 장치)의 신원을 확인하는 과정.
    ex) 회원가입, 로그인 등
    - 인가 : 어떤 개체가 어떤 리소스에 접근할 수 있는지 또는 어떤 동작을 수행할 수 있는지를 검증하는 것, 즉 접근 권한을 얻는 일.
    ex) 게시물 등록, 수정, 삭제 등
    
> [여기](https://dextto.tistory.com/234)를 눌러 인증과 인가 더 자세히 알아보기

- 스프링의 다른 프로젝트(MVC, Data, Batch 등)와 마찬가지로 **확장성을 고려하여 설계되었기 때문에 다양한 요구사항을 손쉽게 추가하고 변경할 수 있다.**

## OAuth
- 인터넷 사용자들이 비밀번호를 제공하지 않고 다른 웹사이트 상의 자신들의 정보에 대해 웹사이트나 애플리케이션의 접근 권한을 부여할 수 있는 공통적인 수단으로서 사용되는, 접근 위임을 위한 개방형 표준.
- 일반 사용자들에게 익숙한 '소셜로그인'이 OAuth를 통해 구현된 기능.
- 로그인 시 보안, 이메일 혹은 전화번호 인증, 비밀번호 찾기, 비밀번호 변경 등 **직접 로그인 구현 시 신경써야할 부분과 추가 기능을 OAuth 제공 플랫폼에 맡기면 되어 비즈니스 로직 개발에 집중 할 수 있다.** 

## Spring Boot 1.5와 2.0에서의 OAuth2 연동 방법 차이

### 설정의 간편함

스프링 부트 2.0으로 오면서 OAuth2의 설정 방법이 훨씬 간편해졌다.
두 버전의 application.properties 혹은 application.yml 설정 정보를 살펴보면 아래와 같다.

- 1.5에서의 설정 방법
``` java
google:
	client:
    	clientId: 인증정보
        clientSecret: 인증정보
        accessTokenUri: https://accounts.google.com/o/oauth2/token
        userAuthorizationUri: https://accounts.google.com/o/oauth2/auth
        clientAuthenticationScheme: form
        scope: email, profile
    resource:
    	userInfoUri: https://www.googleapis.com/oauth2/v2/userinfo
```

- 2.X에서의 설정 방법
```
spring:
	security:
    	oauth2:
        	client:
            	clientId: 인증정보
                clientSecret: 인증정보
```

**1.5에서는 url 주소를 모두 명시해야 하지만 2.0에서는 client 인증 정보만 입력하면 된다.**
**2.0에서 CommonOAuth2Provider라는 enum이 새롭게 추가 되었는데, 여기서 구글, 깃허브, 페이스북, 옥타의 기본 설정값을 제공**한다.
이 enum으로 1.5에서 직접 입력하던 설정값을 대체한다.
(하지만 네이버와 같이 CommonOAuth2Provider에서 제공하지 않는 플랫폼의 정보는 개발자가 별도로 추가해줘야 한다.)

> [여기](https://docs.spring.io/spring-security/site/docs/current/api/org/springframework/security/config/oauth2/client/CommonOAuth2Provider.html)를 눌러 Enum CommonOAuth2Provider 확인하기

### 신규 기능 추가와 확장성

스프링 팀에서 1.5에서 사용되던 spring-security-oauth 프로젝트는 유지 상태로 결정했으며, 더는 신규 기능을 추가하지 않고 버그 수정 정도의 기능만 추가될 예정이다. 신규 기능은 oauth2 라이브러리에서만 지원하겠다고 했다.

또한 기존에 사용되던 방식은 확장 포인트가 적절하게 오픈되어 있지 않아 직접 상속하거나 오버라이딩이 필요하지만, 신규 라이브러리는 확장 포인트를 고려해서 설계되었다.

### 1.5에서의 설정을 2.0에서 그대로 사용하기

**spring-security-oauth2-autoconfigure 라이브러리를 사용하면 1.5에서의 설정 방식을 2.0에서도 그대로 사용할 수 있다.**
1.5버전의 레퍼런스를 적용하고 싶거나 기존에 안전하게 작동하던 1.5버전의 방식을 사용하고 싶을 때 유용하다.

---
---

OAuth를 활용하여 소셜로그인을 구현하기 위해서는 플랫폼에 서비스를 먼저 등록해야 한다.
먼저 대표적으로 구글에 서비스를 등록하고 로그인을 구현해보기로 한다.

## 구글 서비스 등록하기

![](https://velog.velcdn.com/images/shawnhansh/post/1645fb4d-bcf4-4d2e-afdf-012a4f111b9e/image.png)

서비스를 등록하기 위해 [구글 클라우드 플랫폼](https://console.cloud.google.com)에 접속한다.
상단 로고 옆에 프로젝트 선택 버튼(기존에 생성했던 프로젝트가 있다면 기존 프로젝트명이 나온다.)을 선택하고 새 프로젝트를 선택한다.

![](https://velog.velcdn.com/images/shawnhansh/post/25fee550-09a4-40fa-9731-af36bab59811/image.png)

프로젝트 이름에 본인이 원하는 이름을 넣고 새 프로젝트를 생성하면 된다.

![](https://velog.velcdn.com/images/shawnhansh/post/2e3f3e01-4add-4404-8a76-cdeaa9af03e7/image.png)

프로젝트가 생성되면 다시 대시보드로 돌아오게 되는데, 상단 로고 옆에 방금전에 생성한 프로젝트의 이름을 확인할 수 있다.
이제 본격적으로 서비스를 등록하기 위해 API 및 서비스 - 사용자 인증 정보를 순서대로 선택한다.

![](https://velog.velcdn.com/images/shawnhansh/post/2e411828-6da9-4924-b6bd-ede26044884d/image.png)

상단의 사용자 인증 정보 만들기 버튼을 선택하고, 하위 메뉴에서 OAuth 클라이언트 ID를 선택한다.

![](https://velog.velcdn.com/images/shawnhansh/post/40e46d31-630e-4a08-a07b-859d2898f7b1/image.png)

OAuth 클라이언트 ID를 만들기 위해서는 동의 화면을 먼저 구성하라는 안내가 나온다. 동의화면 구성 버튼을 선택한다.

![](https://velog.velcdn.com/images/shawnhansh/post/98e5a8e9-fbfc-4ba9-8425-ef78d72ee700/image.png)

User Type을 내부로 선택하면 조직 내부의 사용자만 이용할 수 있기 때문에 외부로 선택하고 만들기를 선택한다.

![](https://velog.velcdn.com/images/shawnhansh/post/d2582543-4a60-4693-9ece-10a9fb869036/image.png)

상단에 있는 앱 정보에 입력하는 항목들은 로그인 동의를 하는 화면에서 실제 유저가 보게 될 정보들이다. 
- 앱 이름 : 구글 로그인 시 사용자에게 노출될 애플리케이션의 이름
- 지원 이메일 : 사용자 동의 화면에 노출될 이메일 주소. 주로 help 이메일을 사용하지만, 개발 연습용이니 편의상 개인 이메일을 적었다.

![](https://velog.velcdn.com/images/shawnhansh/post/346099ac-a9c2-4604-9e02-55f5423470f3/image.png)

아직 개발단계이기 때문에 애플리케이션 홈페이지에는 localhost:port를 적어주었고, 개발자 연락처 정보에는 개인 이메일을 적어주었다.

![](https://velog.velcdn.com/images/shawnhansh/post/c471f764-e254-4090-8a2e-afd9df0c3e59/image.png)

다음으로 넘어가면 등록 중인 서비스에서 사용할 범위를 선택하는 화면이 나타난다. 로그인 기능을 위해 email, profile, openid만 선택했다.
이외 다른 정보들도 사용하고 싶다면 추가하여 사용할 수 있다.

![](https://velog.velcdn.com/images/shawnhansh/post/97e99fe0-4596-42b5-a027-3f343bc466ff/image.png)

다음은 테스트 사용자를 등록하는 화면이다.
추후에 앱 게시 상태를 설정할 수 있는데, 게시 상태가 테스트 일 때는 여기에 등록한 사용자만 구글 로그인 기능을 이용할 수 있다.
ADD USER 버튼을 선택하여 테스트할 이메일을 추가해준다.

![](https://velog.velcdn.com/images/shawnhansh/post/8ea01145-ec00-41d8-9d9d-cebf17f6b41c/image.png)

위의 과정을 모두 마치면 내가 설정한 종합적인 상태를 확인하는 화면이 나타난다.
혹시 잘못된 설정은 없는지 확인한 뒤 대시보드로 돌아가기 버튼을 선택한다.

![](https://velog.velcdn.com/images/shawnhansh/post/983dfbc9-300a-41b8-af39-36ca2f9e078b/image.png)

동의 화면 구성이 완료되었으니 이제 사용자 인증 정보 만들기에서 OAuth 클라이언트ID 생성이 가능하다.
애플리케이션 유형을 웹 애플리케이션으로 설정 후, 콘솔에서 식별할 이름을 입력한다.

**승인된 리디렉션 URI란 서비스에서 파라미터로 인증 정보를 주었을 때 인증이 성공하면 구글에서 리다이렉트할 URL**이다.
**스프링 부트 2.x버전의 스프링 시큐리티에서는 기본적으로 {도메인}/login/oauth2/code/{소셜서비스코드}로 리다이렉트 URL을 지원**하기 때문에, 개발자가 별도로 리다이렉트 URL을 지원하는 Controller를 만들 필요가 없다.
현재는 개발 단계이기 때문에 localhost:port만 등록하지만, 추후에 AWS에 배포하게 된다면 서버의 주소로도 URI를 추가해주어야 한다.

![](https://velog.velcdn.com/images/shawnhansh/post/d05a82ca-15b7-4abe-ae7a-1ace08671450/image.png)

클라이언트ID 생성을 마치면 이렇게 팝업창이 하나 나타나고 클라이언트 ID와 클라이언트 보안 비밀번호가 나타난다.
이 인증정보는 노출되지 않게 보안에 신경써야한다.

## 구글 서비스 적용하기

방금전에 생성한 클라이언트 ID와 보안 비밀번호를 애플리케이션 설정(application.properties)에 등록해주어야 하는데, 위에서 말했듯 이 인증정보는 노출시키지 말아야한다.

이럴 경우 이 정보들을 별도의 설정파일에 입력해주고, 해당 설정파일을 application.properties에 추가하는 방식으로 설정할 수 있다.

우선 추가할 설정파일을 생성하고 내용을 입려한다.

### application-oauth.properties

application.properties가 있는 src/main/resources/ 디렉토리에 application-oauth.properties 파일을 생성하고 아래와 같이 입력한다.

```
spring.security.oauth2.client.registration.google.client-id=클라이언트ID
spring.security.oauth2.client.registration.google.client-secret=클라이언트 보안 비밀번호
spring.security.oauth2.client.registration.google.scope=profile,email
```

scope 설정의 기본값은 openid, email, profile이다.
이 scope 설정을 굳이 openid를 빼고 profile, email로 설정해준 이유는 추후에 구글뿐 아니라 카카오나 네이버 등 다른 소셜 로그인 기능을 추가할 때 편하게 구현하기 위함이다.

scope에 openid가 있으면 Open Id Provider로 인식하는데, 이렇게 된다면 OpenId Provider인 서비스(구글)와 그렇지 않은 서비스(네이버, 카카오 등)로 나누어 각각 OAuth2Service를 구현해야 한다.
따라서 scope 설정을 명시적으로 openid 없이 profile과 email로 등록해주어 하나의 OAuth2Service로 사용할 수 있도록 했다.

인증정보를 별도의 설정파일로 만들어서 관리하는 이유는 그만큼 노출이 될 경우 치명적이기 때문이다. 따라서 깃허브에 해당 파일이 올라가지 않도록 주의해야 한다.
**반드시 .gitignore에 해당 파일을 등록해주도록 한다!
**
### application.properties

스프링 부트에서는 properties의 이름을 application-xxx.properties로 만들면 xxx라는 이름의 profile로 이 설정을 관리한다.
방금전에 만들어서 값을 입력한 설정파일의 이름이 application-oauth.properties였으니 이 설정파일은 oauth라는 이름의 프로필로 관리되는 것이다.

이를 활용하여 application.properties에 다음과 같이 코드를 추가하면 application-oauth.properties의 설정값을 그대로 application.properties에 포함시킬 수 있다.

```
spring.profiles.include=oauth
```
    
---
참고
- [이동욱님](https://jojoldu.tistory.com/) 저서 '[스프링 부트와 AWS로 혼자 구현하는 웹 서비스](http://www.kyobobook.co.kr/product/detailViewKor.laf?ejkGb=KOR&mallGb=KOR&barcode=9788965402602)'
- https://dextto.tistory.com/234
- https://ko.wikipedia.org/wiki/OAuth
