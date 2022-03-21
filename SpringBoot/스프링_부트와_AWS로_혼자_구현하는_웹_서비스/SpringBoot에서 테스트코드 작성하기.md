> 해당 내용은 [이동욱님](https://jojoldu.tistory.com/) 저서 '[스프링 부트와 AWS로 혼자 구현하는 웹 서비스](http://www.kyobobook.co.kr/product/detailViewKor.laf?ejkGb=KOR&mallGb=KOR&barcode=9788965402602)'를 공부하며 정리한 내용입니다.

## TDD와  단위 테스트는 다르다.

TDD : 테스트가 주도하는 개발 → 테스트 코드를 먼저 작성

![](https://images.velog.io/images/shawnhansh/post/351d23e7-ebf3-420c-855a-f7d032b355ec/image.png)

1. 항상 실패하는 테스트를 먼저 작성(Red)
2. 테스트에 통과하는 프로덕션 코드를 작성(Green)
3. 테스트에 통과하면 프로덕션 코드를 리팩토링(Refactor)

단위 테스트 : TDD의 첫 번째 단계인 기능 단위의 테스트 코드를 작성하는 것.
테스트 코드를 먼저 작성할 필요도, 리팩토링도 필요하지 않다.
순수한 목적의 테스트 코드

**단위 테스트에 먼저 익숙해지면 꼭 TDD에 관심을 갖고 배워보자!**

### 단위테스트를 하는 이유

1. 개발단계 초기에 문제를 발견하게 도와준다.
2. 개발자가 추후 코드를 리팩토링하거나 라이브러리 업그레이드 등에서 기존 기능이 올바르게 작동하는지 확인할 수 있다.
3. 기능에 대한 불확실성을 감소시킨다.
4. 시스템에 대한 실제 문서를 제공함으로써 그자체로 문서로 사용 가능하다.

---

## Application 클래스

```java
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.data.jpa.repository.config.EnableJpaAuditing;

@SpringBootApplication  
public class Application {
    public static void main(String[] args) {
        SpringApplication.run(Application.class, args);
    }
}
```
앞으로 만들 프로젝트의 메인 클래스

### @SpringBootApplication

- 스프링 부트의 자동 설정, 스프링 Bean 읽기와 생성을 모두 자동으로 설정한다.
- 해당 어노테이션이 있는 위치부터 설정을 읽어가기 때문에 항상 프로젝트 최상단에 위치해야한다.

### SpringApplication.run(Application.class, args)

- 스프링 부트의 내장 WAS를 실행시킨다.
- Tomcat을 사용해도 무방하지만 **언제 어디서나 같은 환경에서 스프링 부트를 배포**할 수 있기 때문에 **내장 WAS 사용을 권장한다.**

## HelloController

```java
import com.shawn.springboot.web.dto.HelloResponseDto;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class HelloController {

    @GetMapping("/hello")
    public String hello(){
        return "hello";
    }

    @GetMapping("/hello/dto")
    public HelloResponseDto helloDto(@RequestParam("name") String name
                                    , @RequestParam("amount") int amount){
        return new HelloResponseDto(name, amount);
    }
}
```

### @RestController

- 컨트롤러를 JSON을 반환하는 컨트롤러로 만들어준다.
- 모든 메서드에 @ResponseBody를 선언했던 것과 같다.

### @RequestParam(”api에서 넘긴 데이터의 name 값") String name

- 외부에서 API로 넘긴 파라미터를 가져오는 어노테이션.
- 넘어온 name값을 받아서 선언한 타입으로 형변환 후 변수명으로 저장시켜준다.
- 해당 어노테이션이 붙은 파라미터가 존재하지 않는다면 400 Error가 발생한다.
- 만약 필수가 아닌 파라미터라면 @RequestParam(value=”name”, required=false) String name
- 필수가 아닌 파라미터의 값이 Null이라면 Null 할당이 불가능한 기본형 타입에서는 오류가 발생한다.

## HelloControllerTest

```java
import org.junit.Test;
import org.junit.runner.RunWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.test.context.junit4.SpringRunner;
import org.springframework.test.web.servlet.MockMvc;

import static org.hamcrest.Matchers.is;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@RunWith(SpringRunner.class)
@WebMvcTest(controllers = HelloController.class) 
public class HelloControllerTest{

    @Autowired
    private MockMvc mvc;

    @Test
    public void hello가_리턴된다() throws Exception {
        String hello = "hello";

        mvc.perform(get("/hello"))
                .andExpect(status().isOk())
                .andExpect(content().string(hello));
    }

    @Test
    public void helloDto가_리턴된다() throws Exception{
        String name = "hello";
        int amount = 32;

        mvc.perform(get("/hello/dto")
                .param("name", name)
                .param("amount", String.valueOf(amount)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.name", is(name)))
                .andExpect(jsonPath("$.amount", is(amount)));
    }
}
```

HelloController를 테스트하는 클래스

### @RunWith(SpringRunner.class)

- 테스트를 진행할 때 JUnit에 내장된 실행자 외에 다른 실행자를 시킨다.
- 여기서는 인자로 사용하는 SpringRunner라는 스프링 실행자를 실행시켜,  
    스프링 부트 테스트와 JUnit 사이에 연결자 역할을 한다.
    

### @WebMvcTest

- Web(Spring MVC)에 집중할 수 있는 어노테이션
- 선언할 경우 @Controller, @ControllerAdvice 등을 사용할 수 있다.
- 단, @Service, @Component, @Repository 등은 사용할 수 없다. → JPA 기능은 작동하지 않는다
- 위와 같은 케이스에서는 컨트롤러만 사용할 예정이기 때문에 사용

### private MockMvc mvc

- 웹 API를 테스트할 때 사용한다.
- 스프링 MVC 테스트의 시작점
- 이 클래스를 통해 HTTP GET, POST 등에 대한 API 테스트를 할 수 있다.

### mvc.perform(get(”/hello”))

- MockMvc를 통해 /hello 주소로 get 요청을 보낸다.
- 체이닝이 지원되어 여러 검증 기능을 이어서 선언할 수 있다.
    
  ### .andExpect(status().isOk())
    
    - mvc.perform의 결과를 인자의 내용으로 검증한다.
    - HTTP Header의 Status가 OK(200)인지 검증한다.
    
  ### .andExpect(content().string(hello))
    
    - 응답 본문의 내용이 “hello”인지 검증한다.
    
  ### .param(”name”, value)
    
    - API에 사용될 Request Parameter 설정
    - String만 허용된다.
    
  ### .andExpect(jsonPath("$.name", is(name)))
    
    - JSON 응답값을 필드별로 검증하는 메서드
    - “$.필드명”.is(value)

## HelloResponseDTO

```java
import lombok.Getter;
import lombok.RequiredArgsConstructor;

@Getter
@RequiredArgsConstructor
public class HelloResponseDto {
    private final String name;
    private final int amount;

}
```

### @Getter / @Setter — Lombok

- 선언된 모든 필드의 get / set 메서드 생성

### @RequiredArgsConstructor — Lombok

- 선언된 모든 final 필드가 포함된 생성자를 생성
- final이 없는 필드는 생성자에 포함되지 않는다.

### @AllArgsConstructor / @NoArgsConstructor — Lombok

- 모든 필드가 포함된 / 인자가 없는 생성자를 생성

## HelloResponseDTOTest

```java
import com.shawn.springboot.web.dto.HelloResponseDto;
import org.junit.Test;

import static org.assertj.core.api.Assertions.assertThat;

public class HelloResponseDtoTest {

    @Test
    public void 롬복_기능_테스트(){
        //given
        String name = "test";
        int amount = 1000;

        //when
        HelloResponseDto dto = new HelloResponseDto(name, amount);

        //then
        assertThat(dto.getName()).isEqualTo(name);
        assertThat(dto.getAmount()).isEqualTo(amount);
    }
}
```

### @assertThat — assertJ

- 검증하고 싶은 대상을 메서드 인자로 받는다.
- 메서드 체이닝이 지원되어 isEqualTo와 같이 메서드를 이어서 사용할 수 있다.

### @isEqualTo — assertJ

- 동등 비교 메서드
- assertThat의 인자와 isEqualTo의 인자의 값을 비교하여 같을 때만 성공

### assertJ가 JUnit보다 나은 점

- JUnit의 assertThat을 쓰면 is()와 같이 CoreMatchers 라이브러리가 필요한 반면,
    
    assertJ를 사용하면 추가적인 라이브러리가 필요하지 않다.
    
- IDE에서 CoreMatchers와 같은 Matcher 라이브러리의 자동완성 지원이 약하다.