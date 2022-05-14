며칠 전 기존에 알던 분들과 모여 프로젝트를 진행하기로 했습니다!

지금까지는 Spring Legacy를 이용하여 스프링의 컨트롤러에서 thymeleaf나 Mustache, JSP 등으로 자원을 전달했기 때문에 CORS에 대한 고민은 해본적이 없었는데, 이번에 처음으로 프론트엔드와 백엔드 서버를 분리하여 프로젝트를 수행하며 협업하다보니 CORS를 마주하게 되었습니다.

## SOP
> SOP(Same Origin Policy, 동일 출처 정책)은 어떤 출처에서 불러온 문서나 스크립트가 다른 출처에서 가져온 리소스와 상호작용하는 것을 제한하는 중요한 보안 방식입니다. 동일 출처 정책은 잠재적으로 해로울 수 있는 문서를 분리함으로써 공격받을 수 있는 경로를 줄여줍니다.
by MDN Web Docs

브라우저는 보안을 위해 기본적으로 다른 출처의 리소스를 차단합니다.
동일 호스트, 포트, 프로토콜에서만 리소스 공유가 가능하다는 의미입니다.

SOP가 브라우저의 기본값이기 때문에 개발자들이 프론트엔드와 백엔드를 별도로 분리하여 작업을 할 경우 클라이언트와 서버가 분리되어 클라이언트에서 API의 response를 확인할 수 없게 됩니다.

## CORS
> CORS(Cross Origin Resource Sharing, 교차 출처 리소스 공유)란 추가 HTTP 헤더를 사용하여, 한 출처에서 실행 중인 웹 어플리케이션이 다른 출처의 선택한 자원에 접근할 수 있도록 권한을 부여하도록 브라우저에 알려주는 체제입니다. 
by MDN Web Docs

웹 어플리케이션에서 리소스가 도메인, 프로토콜, 포트 등 자신의 출처와 다를 때 교차 출처 HTTP 요청을 실행해야 하는데 이 부분이 적용되어 있지 않으면 브라우저의 기본값인 SOP가 적용되어 리소스를 얻을 수 없는 문제가 발생하게 됩니다.
따라서 이런 경우 CORS를 적용하여 출처가 달라도 리소스를 공유할 수 있도록 해주어야 합니다.

## 스프링부트에 CORS 적용하기

스프링부트 공식문서의 COR 부분을 보면 총 세가지 방법으로 CORS를 적용하는 방법을 설명하고 있습니다.
- 어노테이션을 통한 적용
- 전역 설정을 통한 적용
- 필터를 통한 적용

필터를 통한 적용은 예제를 봐도 제가 잘 이해가 되지 않아 이번에는 다루지 않고, 어노테이션과 전역 설정을 통한 적용을 먼저 알아보겠습니다.

필터를 통한 적용은 추후에 이해가 될 때 내용을 덧붙이도록 하겠습니다.

### 어노테이션을 통한 적용

``` java
@CrossOrigin(maxAge = 3600)
@RestController
@RequestMapping("/account")
public class AccountController {

    @CrossOrigin("http://domain2.com")
    @GetMapping("/{id}")
    public Account retrieve(@PathVariable Long id) {
        // ...
    }

    @DeleteMapping("/{id}")
    public void remove(@PathVariable Long id) {
        // ...
    }
}
```

@CrossOrigin 어노테이션은 클래스와 컨트롤러의 메서드에 모두 사용할 수 있습니다.
@RequestMapping 등의 어노테이션과 똑같이 클래스에 선언된 값은 해당 클래스의 모든 메서드에 전역으로 적용되고, 각 메서드에 선언된 어노테이션의 값은 해당 메서드에만 적용됩니다.

@CrossOrigin 어노테이션의 기본값은 모든 출처, 모든 헤더, 모든 HTTP 메서드, 유효시간 30분입니다.

### 전역 설정을 통한 적용

각 클래스와 메서드마다 적용해주는 것외에 어플리케이션 전역에 걸쳐 적용을 원할 경우에는 Java Config나 XML Config를 통한 설정으로 적용할 수 있습니다.

기본값은 모든 출처, 모든 헤더, GET/HEAD/POST HTTP 메서드, 유효기간 30분이고 아래와 같이 원하는 값으로 설정할 수 있습니다.


``` java
@Configuration
@EnableWebMvc
public class WebConfig implements WebMvcConfigurer {

    @Override
    public void addCorsMappings(CorsRegistry registry) {

        registry.addMapping("/api/**")
            .allowedOrigins("http://domain2.com")
            .allowedMethods("PUT", "DELETE")
            .allowedHeaders("header1", "header2", "header3")
            .exposedHeaders("header1", "header2")
            .allowCredentials(true).maxAge(3600);

        // Add more mappings...
    }
}
```

Java Config를 사용할 경우 WebMvcConfigurer를 implements한 WebConfig 클래스를 생성하고 addCorsMappings를 오버라이드 해줌으로써 CORS를 적용할 수 있습니다.


```
<mvc:cors>

    <mvc:mapping path="/api/**"
        allowed-origins="http://domain1.com, http://domain2.com"
        allowed-methods="GET, PUT"
        allowed-headers="header1, header2, header3"
        exposed-headers="header1, header2" allow-credentials="true"
        max-age="123" />

    <mvc:mapping path="/resources/**"
        allowed-origins="http://domain1.com" />

</mvc:cors>
```

XML 설정을 사용하신다면 위와 같이 적용할 수 있겠습니다.


![](https://velog.velcdn.com/images/shawnhansh/post/59059c0c-d58b-4264-97ab-c6bb097a2b8b/image.png)


``` java

import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
@EnableWebMvc
public class WebConfig implements WebMvcConfigurer {
    @Override
    public void addCorsMappings(CorsRegistry registry) {
        registry.addMapping("/**")
                .allowedOrigins("http://localhost:3000")
                .allowedMethods("GET", "PUT", "POST", "DELETE");
    }
}
```

저는 위와 같이 Java Config를 사용하여 CORS를 적용했고 프론트엔드 개발자분으로부터 리소스 공유가 제대로 된다는 답변을 받았습니다!



---
참고

- https://docs.spring.io/spring-framework/docs/5.0.7.RELEASE/spring-framework-reference/web.html#mvc-cors
- https://developer.mozilla.org/ko/docs/Web/HTTP/CORS
- https://developer.mozilla.org/ko/docs/Web/Security/Same-origin_policy
- https://yoo11052.tistory.com/139
- https://velog.io/@minchae75/Spring-boot-CORS-%EC%A0%81%EC%9A%A9%ED%95%98%EA%B8%B0