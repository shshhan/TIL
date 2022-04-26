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
---

구글의 OAuth 클라이언트 ID 설정까지 마쳤으니 이제 프로젝트에서 이를 적용해보려고 한다.

우선 사용자 정보와 관련된 부분 먼저 구현해보도록 하자.

## User

로그인한 사용자의 정보를 담당한 도메인인 User 클래스

``` java
package com.shawn.springboot.domain.user;

import com.shawn.springboot.domain.BaseTimeEntity;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

import javax.persistence.*;

@Getter
@NoArgsConstructor
@Entity
public class User extends BaseTimeEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String name;

    @Column(nullable = false)
    private String email;

    @Column
    private String picture;

    @Enumerated(EnumType.STRING)
    @Column(nullable = true)
    private Role role;

    @Builder
    public User(String name, String email, String picture, Role role){
        this.name = name;
        this.email = email;
        this.picture = picture;
        this.role = role;
    }

    public User update(String name, String picture){
        this.name = name;
        this.picture = picture;

        return this;
    }

    public String getRoleKey(){
        return this.role.getKey();
    }

}

```

### @Enumerated(EnumType.STRING)
- JPA로 데이터베이스로 저장할 때 Enum 값을 어떤 형태로 저장할지 결정
- 기본적으로는 int로 된 숫자가 저장되는데 DB에서 확인시 그 값이 어떤 코드를 의미하는지 알수 없기 때문에 문자열로 저장될 수 있도록 선언


## Role

각 사용자의 권한을 관리할 Enum 클래스

``` java
package com.shawn.springboot.domain.user;

import lombok.Getter;
import lombok.RequiredArgsConstructor;

@Getter
@RequiredArgsConstructor
public enum Role {

    GUEST("ROLE_GUEST", "손님"),
    USER("ROLE_USER", "일반 사용자");

    private final String key;
    private final String title;
}

```
- 스프링 시큐리티에는 권한 코드에 항상 ROLE_이 앞에 있어야하기 때문에, 코드별 키 값을 ROLE_GUEST, ROLE_USER 등으로 지정.


## UserRepository
User의 CRUD를 위한 DB Layer
``` java
package com.shawn.springboot.domain.user;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface UserRepository extends JpaRepository<User, Long> {

    Optional<User> findByEmail(String email);
}

```

### findByEmail
- 소셜 로그인으로 반환되는 값 중 email을 통해 이미 생성된 사용자인지 처음 가입하는 사용자인지 판단하기 위한 메서드

---

사용자 정보와 관련된 부분의 구현은 모두 끝났다.
이제 본격적으로 시큐리티 관련 로직을 구현할 차례이다.

## build.gradle

```
...
dependencies{
	...
    compile('org.springframework.boot:spring-boot-starter-oauth2-client')
    ...
}
...
```

### Spring-boot-starter-oauth2-client
- 소셜 로그인 등 클라이언트 입장에서 소셜 기능 구현시 필요한 의존성
- spring-security-oauth2-client와 spring-security-oauth2-jose를 관리

## SecurityConfig
시큐리티 설정 클래스

시큐리티 관련 클래스를 위치시킬 config.auth 패키지를 생성하고, 이 클래스 역시 config.auth 패키지에 생성한다.
``` java
package com.shawn.springboot.config.auth;

import com.shawn.springboot.domain.user.Role;
import lombok.RequiredArgsConstructor;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configuration.WebSecurityConfigurerAdapter;


@RequiredArgsConstructor
@EnableWebSecurity  
public class SecurityConfig extends WebSecurityConfigurerAdapter {

    private final CustomOAuth2UserService customOAuth2UserService;

    protected void configure(HttpSecurity http) throws Exception{
        http
                .csrf().disable()
                .headers().frameOptions().disable()
                .and()
                    .authorizeRequests()
                    .antMatchers("/", "/css/**", "/images/**", "/js/**", "/h2-console/**").permitAll()
                    .antMatchers("/api/v1/**").hasRole(Role.USER.name())    
                    .anyRequest().authenticated()   
                .and()
                    .logout()
                        .logoutSuccessUrl("/")
                .and()
                    .oauth2Login() 
                        .userInfoEndpoint()
                            .userService(customOAuth2UserService);
    }

}

```
### @EnableWebSecurity
- spring Security 설정들을 활성화

### .csrf().disable().headers().frameOptions().disable()
- h2-console 화면을 사용하기 위해 해당 옵션들을 disable

### .authorizeRequests()
- URL별 권한 관리를 설정하는 옵션의 시작점
- authorizeRequests가 선언되어야만 antMatchers 옵션 사용 가능

### .antMatchers()
- 권한 관리 대상을 지정하는 옵션
- URL, HTTP 메서드별로 관리 가능
- "/", "/h2-console/** " 등 지정된 URL은 permitAll() 옵션을 통해 전체 열람 권한 부여
- "/api/v1/** " 주소를 가진 API는 USER 권한만 열람 권한 부여

### .anyRequest
- antMatchers로 설정된 URL 외의 나머지 URL에 대한 설정
- authenticated() 옵션으로 인증된 사용자, 즉 로그인한 사용자들에게만 열람 권한 부여

### .logout()
- 로그아웃 기능에 대한 설정의 시작점
- logoutSuccessUrl("/")은 로그아웃 성공시 "/" 주소로 이동을 의미

### .auth2Login()
- OAuth2 로그인 기능에 대한 설정의 시작점
- userInfoEndpoint()은 로그인 성공 후 사용자 정보를 가져올 때의 설정을 담당
- userService()은 소셜 로그인 성공 시 후속 조치를 진행할 UserService 인터페이스의 구현체를 등록
여기서는 customOAuth2UserService를 UserService 인터페이스의 구현체로 등록
리소스 서버(구글, 네이버, 카카오 등)에서 사용자 정보를 가져온 상태에서 추가로 진행하고자 하는 기능 명시 가능

## CustomOAuth2UserService
소셜 로그인 이후 가져온 사용자의 정보(email, name, picture 등)을 기반으로 가입 및 정보 수정, 세션 저장 등의 기능을 제공하는 클래스

``` java
package com.shawn.springboot.config.auth;

import com.shawn.springboot.config.auth.dto.OAuthAttributes;
import com.shawn.springboot.config.auth.dto.SessionUser;
import com.shawn.springboot.domain.user.User;
import com.shawn.springboot.domain.user.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.oauth2.client.userinfo.DefaultOAuth2UserService;
import org.springframework.security.oauth2.client.userinfo.OAuth2UserRequest;
import org.springframework.security.oauth2.client.userinfo.OAuth2UserService;
import org.springframework.security.oauth2.core.OAuth2AuthenticationException;
import org.springframework.security.oauth2.core.user.DefaultOAuth2User;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.stereotype.Service;

import javax.servlet.http.HttpSession;
import java.util.Collections;

@RequiredArgsConstructor
@Service
public class CustomOAuth2UserService implements OAuth2UserService<OAuth2UserRequest, OAuth2User> {

    private final UserRepository userRepository;
    private final HttpSession httpSession;

    @Override
    public OAuth2User loadUser(OAuth2UserRequest userRequest) throws OAuth2AuthenticationException {
        OAuth2UserService<OAuth2UserRequest,OAuth2User> delegate = new DefaultOAuth2UserService();
        OAuth2User oauth2User = delegate.loadUser(userRequest);

        String registrationId = userRequest.getClientRegistration().getRegistrationId(); 
        String userNameAttributeName = userRequest.getClientRegistration().getProviderDetails().getUserInfoEndpoint().getUserNameAttributeName();
            
        OAuthAttributes attributes = OAuthAttributes.of(registrationId, userNameAttributeName, oauth2User.getAttributes());

        User user = saveOrUpdate(attributes);
        httpSession.setAttribute("user", new SessionUser(user));    

        return new DefaultOAuth2User(Collections.singleton(new SimpleGrantedAuthority(user.getRoleKey())), attributes.getAttributes(), attributes.getNameAttributeKey());
    }

    private User saveOrUpdate(OAuthAttributes attributes){
        User user = userRepository.findByEmail(attributes.getEmail()).map(entity->entity.update(attributes.getName(), attributes.getPicture()))
                .orElse(attributes.toEntity());

        return userRepository.save(user);
    }
}

```

### registrationId
- 현재 로그인 진행 중인 서비스를 구분. ex)구글, 네이버 등
- 구글의 소셜로그인만 구현할 때는 필요 없지만, 이후 다른 플랫폼의 로그인을 연동할 때는 구글 로그인인지 네이버 로그인인지 구분하기 위해 사용.

### userNameAttributeName
- OAuth2 로그인 진행 시 키가 되는 필드값. Primary Key와 같은 의미
- 구글의 기본 코드는 "sub", 네이버와 카카오는 기본 지원X

### OAuthAttributes
- OAuth2UserService를 통해 가져온 OAuth2User의 attribute를 담을 클래스

### SessionUser
- 세션에 사용자 정보를 저장하기 위한 Dto 클래스

### saveOrUpdate()
- 사용자의 이메일로 유저 정보를 찾아 있으면 로그인 유저의 정보를 새롭게 업데이트
- 유저 정보가 없다면 유저 정보를 등록

## OAuthAttributes
OAuth2UserService를 통해 가져온 OAuth2User의 속성을 담는 클래스

``` java
package com.shawn.springboot.config.auth.dto;

import com.shawn.springboot.domain.user.Role;
import com.shawn.springboot.domain.user.User;
import lombok.Builder;
import lombok.Getter;

import java.util.Map;

@Getter
public class OAuthAttributes {
    private Map<String, Object> attributes;
    private String nameAttributeKey;
    private String name;
    private String email;
    private String picture;

    @Builder
    public OAuthAttributes(Map<String, Object> attributes, String nameAttributeKey, String name, String email, String picture){
        this.attributes = attributes;
        this.nameAttributeKey = nameAttributeKey;
        this.name = name;
        this.email = email;
        this.picture = picture;
    }

    public static OAuthAttributes of(String registrationId, String userNameAttributeName, Map<String, Object> attributes){
        return ofGoogle(userNameAttributeName, attributes);
    }

    private static OAuthAttributes ofGoogle(String userNameAttributeName, Map<String, Object> attributes){
        return OAuthAttributes.builder()
                .name((String) attributes.get("name"))
                .email((String) attributes.get("email"))
                .picture((String) attributes.get("picture"))
                .attributes(attributes)
                .nameAttributeKey(userNameAttributeName)
                .build();
    }

    public User toEntity(){
        return User.builder()
                .name(name)
                .email(email)
                .picture(picture)
                .role(Role.GUEST)
                .build();
    }
}

```
### of()
- OAuth2User에서 반환하는 사용자 정보는 Map이기 때문에 값 하나하나를 변환해야 한다.

### toEntity()
- User Entity를 생성
- OAuthAttributes에서 엔티티를 생성하는 시점은 처음 가입 시점
- 가입 시 기본 권한을 GUEST로 주기 위해 role 빌더 값에 Role.GUEST 값 입력

## SessionUser
인증된 사용자 정보를 담는 클래스

``` java
package com.shawn.springboot.config.auth.dto;

import com.shawn.springboot.domain.user.User;
import lombok.Getter;

import java.io.Serializable;

@Getter
public class SessionUser implements Serializable {
    private String name;
    private String email;
    private String picture;

    public SessionUser(User user) {
        this.name = user.getName();
        this.email = user.getEmail();
        this.picture = user.getPicture();
    }
}
```
### User 클래스가 아닌 별도의 클래스를 생성해 세션에 사용자 정보를 등록하는 이유
- 세션에 저장하기 위해서는 직렬화를 해야한다.
- User 클래스는 Entity 클래스이기 때문에 @OneToMany, @ManyToMany 등 다른 엔티티와의 관계가 형성 될 수 있다.
- 만약 Entity가 다른 Entity와 관계가 형성 되어있을 때 직렬화를 구현한다면, 다른 Entity까지 직렬화 대상에 포함되어 **성능 이슈, 부수 효과**가 발생할 확률이 높다.
- 따라서 **직렬화를 구현한 세션 DTO를 추가로 생성해 사용하는 것이 운영 및 유지보수에 편리**하다.

---
이렇게 서버의 설정은 모두 끝났다.

이제 화면에서 구글 로그인 버튼을 만들어서 정상적으로 로그인이 되는지 테스트를 해볼 차례이다.
"스프링 부트와 AWS로 혼자 구현하는 웹 서비스"에서 mustache로 구현한 화면에 로그인 버튼을 만들어본다.

## index.mustache

``` html
    <div class="row">
        <div class="col-md-6">
            <a href="/posts/save" role="button" class="btn btn-primary">글 등록</a>
            {{#userName}}
                Logged in as: <span id="user">{{userName}}</span>
                <a href="/logout" class="btn btn-info active" role="button">Logout</a>
            {{/userName}}
            {{^userName}}
                <a href="/oauth2/authorization/google" class="btn btn-success active" role="button">Google Login</a>
            {{/userName}}
        </div>
    </div>
```

### {{#userName}}, {{^userName}}
- userName 변수를 갖고 있다면 {{#userName}} ~ {{/userName}} 블럭이, 없다면 {{^#userName}} ~ {{/userName}} 블럭이 실행된다.

### href="/logout"
- 스프링 시큐리티에서 기본적으로 제공하는 로그아웃 URL
- 개발자가 별도로 로그아웃 URL을 가진 컨트롤러를 만들 필요 없음.

### href="/oauth2/authorization/google"
- 스프링 시큐리티에서 기본적으로 제공하는 로그인 URL
- 로그아웃과 마찬가지로 개발자가 별도의 컨트롤러를 생성할 필요 없음.

## IndexController
index.mustache에서 userName을 사용할 수 있도록 IndexController에서 userName을 model에 추가해야 한다.
``` java
package com.shawn.springboot.web;

import javax.servlet.http.HttpSession;

@RequiredArgsConstructor
@Controller
public class IndexController{

    private final PostsService postsService;
    private final HttpSession httpSession;

    @GetMapping("/")
    public String index(Model model) {
        model.addAttribute("posts", postsService.findAllDesc());

        SessionUser user = (SessionUser)httpSession.getAttribute("user");

        if(user != null) {
            model.addAttribute("userName", user.getName());
        }

        return "index";
    }
}
        
```
### (SessionUser)httpSession.getAttribute("user")
- CustomOAuth2UserService에서 로그인 성공시 세션에 저장한 SessionUser 객체를 가져옴.

## 웹에서 테스트 해보기

![](https://velog.velcdn.com/images/shawnhansh/post/96759e4a-5c10-4a71-9da7-058765533be0/image.png)

서버를 구동시켜서 index.mustache에 구글 로그인을 추가한 화면을 보니 버튼이 제대로 추가되었다.

![](https://velog.velcdn.com/images/shawnhansh/post/dafd27d0-091e-4304-b3e3-85f6de1f3d4b/image.png)

구글 로그인 버튼을 선택하니 익숙한 구글 로그인 화면이 나타났다.
화면에 보이는 계정은 구글에서 동의화면을 구성하고 클라이언트 ID를 생성할 때 테스트가 가능하도록 추가해놓은 구글 계정이다.
계정을 선택해서 로그인을 시도해보았다.

![](https://velog.velcdn.com/images/shawnhansh/post/ed25d49b-96bb-47f9-9c6b-1eb542d9cf05/image.png)

정상적으로 로그인이 된 것을 확인 할 수 있다.

![](https://velog.velcdn.com/images/shawnhansh/post/a4fcf0ed-de81-44e5-b84f-2793248c8e91/image.png)

DB의 유저 정보를 확인해보아도 제대로 회원가입이 된 것을 알 수 있다.
OAuthAttributes에서 구현한대로 처음 회원 가입시 권한이 GUEST로 설정 되어 있는 것을 확인할 수 있다.

---
참고
- [이동욱님](https://jojoldu.tistory.com/) 저서 '[스프링 부트와 AWS로 혼자 구현하는 웹 서비스](http://www.kyobobook.co.kr/product/detailViewKor.laf?ejkGb=KOR&mallGb=KOR&barcode=9788965402602)'
- https://dextto.tistory.com/234
- https://ko.wikipedia.org/wiki/OAuth
