> 해당 내용은 [이동욱님](https://jojoldu.tistory.com/) 저서 '[스프링 부트와 AWS로 혼자 구현하는 웹 서비스](http://www.kyobobook.co.kr/product/detailViewKor.laf?ejkGb=KOR&mallGb=KOR&barcode=9788965402602)'를 공부하며 정리한 내용입니다.

> 필자가 스프링을 배울 때는 iBatis와 같은 SQL Mapper를 이용해서 DB의 쿼리를 작성했습니다.
그러다 보니 실제로 개발하는 시간보다 SQL을 다루는 시간이 더 많았습니다.
이것이 이상하게 느껴졌습니다.
분명 “객체지향 프로그래밍을 배웠는데 왜 객체지향 프로그래밍을 못하지?”라는 생각을 계속했습니다.
객체 모델링보다는 테이블 모델링에만 집중하고, 객체를 단순히 테이블에 맞추어 데이터 전달 역할만 하는 개발의 형태는 분명 기형적인 형태였습니다.

저자 이동욱님의 말이다. 그리고 나도 이런 생각을 한적이 있어 이 내용에 크게 공감한다.
C언어로 처음 개발 공부를 시작한 나는 처음 Java를 배울 때 아주 불편해했다. C에서는 간단한 함수면 끝나던 작업이 '객체'라는 개념 때문에 코드가 길어진게 그 이유였는데, OOP를 공부하면서 부터는 Java에 흥미를 느끼기 시작했다.
하지만 Spring으로 웹 개발을 시작하고 프로젝트를 수행하다보니, DB에서 데이터를 CRUD하는데 초점이 맞춰져있고 객체도 DB 테이블에 따라 설계했다. 실제로 테이블 설계에는 아주 오랜 시간이 걸렸지만, 객체 설계는 그저 설계해둔 테이블의 컬럼을 받을 필드들과 몇 개의 데이터 가공을 위한 메서드들을 만들고는 끝이었다. OOP는 스프링의 구조를 잡을 때만 쓰였고, 저자 이동욱님의 말대로 ‘객체를 단순히 테이블에 맞추어 데이터 전달 역할만 하는 형태'라고 느꼈다. _~~그래서 ‘웹 백엔드는 매력이 없다'라고 생각한 적도 있었다.~~_
**JPA를 통해 이런 부분을 해소할 수 있다고 하니 앞으로 JPA도 열심히 공부해봐야겠다!**
    

## 관계형 데이터베이스가 웹 서비스의 중심이 되며 모든 코드는 SQL 중심이 되었다.

- 관계형 데이터베이스(RDB, Relational Database)의 사용량이 압도적으로 많다.
- RDB는 SQL만 인식 가능하다.

—> 프로젝트의 대부분이 애플리케이션 코드보다 SQL 위주가 된다.

이책에서는 이 것에 대한 해결책으로 JPA를 제시한다.
myBatis : SQL Mapper, 쿼리를 매핑한다.
JPA(Java Persistence API) : Object Relational Mapper, 객체를 매핑한다.

## Spring Data JPA

인터페이스인 JPA를 사용하기 위한 구현체(Hibernate, Eclipse Link) 등을 더 쉽게 사용하기 위해 추상화시킨 모듈

## Spring Data JPA 사용의 장점

1. **구현체 교체의 용이성**
    Spring Data JPA 내부에서 구현체 매핑을 지원하기 때문에 > 해당 내용은 [이동욱님](https://jojoldu.tistory.com/) 저서 '[스프링 부트와 AWS로 혼자 구현하는 웹 서비스](http://www.kyobobook.co.kr/product/detailViewKor.laf?ejkGb=KOR&mallGb=KOR&barcode=9788965402602)'를 공부하며 정리한 내용입니다.

> 필자가 스프링을 배울 때는 iBatis와 같은 SQL Mapper를 이용해서 DB의 쿼리를 작성했습니다.
그러다 보니 실제로 개발하는 시간보다 SQL을 다루는 시간이 더 많았습니다.
이것이 이상하게 느껴졌습니다.
분명 “객체지향 프로그래밍을 배웠는데 왜 객체지향 프로그래밍을 못하지?”라는 생각을 계속했습니다.
객체 모델링보다는 테이블 모델링에만 집중하고, 객체를 단순히 테이블에 맞추어 데이터 전달 역할만 하는 개발의 형태는 분명 기형적인 형태였습니다.

저자 이동욱님의 말이다. 그리고 나도 이런 생각을 한적이 있어 이 내용에 크게 공감한다.
C언어로 처음 개발 공부를 시작한 나는 처음 Java를 배울 때 아주 불편해했다. C에서는 간단한 함수면 끝나던 작업이 '객체'라는 개념 때문에 코드가 길어진게 그 이유였는데, OOP를 공부하면서 부터는 Java에 흥미를 느끼기 시작했다.
하지만 Spring으로 웹 개발을 시작하고 프로젝트를 수행하다보니, DB에서 데이터를 CRUD하는데 초점이 맞춰져있고 객체도 DB 테이블에 따라 설계했다. 실제로 테이블 설계에는 아주 오랜 시간이 걸렸지만, 객체 설계는 그저 설계해둔 테이블의 컬럼을 받을 필드들과 몇 개의 데이터 가공을 위한 메서드들을 만들고는 끝이었다. OOP는 스프링의 구조를 잡을 때만 쓰였고, 저자 이동욱님의 말대로 ‘객체를 단순히 테이블에 맞추어 데이터 전달 역할만 하는 형태'라고 느꼈다. _~~그래서 ‘웹 백엔드는 매력이 없다'라고 생각한 적도 있었다.~~_
**JPA를 통해 이런 부분을 해소할 수 있다고 하니 앞으로 JPA도 열심히 공부해봐야겠다!**
    

## 관계형 데이터베이스가 웹 서비스의 중심이 되며 모든 코드는 SQL 중심이 되었다.

- 관계형 데이터베이스(RDB, Relational Database)의 사용량이 압도적으로 많다.
- RDB는 SQL만 인식 가능하다.

—> 프로젝트의 대부분이 애플리케이션 코드보다 SQL 위주가 된다.

이책에서는 이 것에 대한 해결책으로 JPA를 제시한다.
myBatis : SQL Mapper, 쿼리를 매핑한다.
JPA(Java Persistence API) : Object Relational Mapper, 객체를 매핑한다.

## Spring Data JPA

인터페이스인 JPA를 사용하기 위한 구현체(Hibernate, Eclipse Link) 등을 더 쉽게 사용하기 위해 추상화시킨 모듈

## Spring Data JPA 사용의 장점

1. **구현체 교체의 용이성**
    Spring Data JPA 내부에서 구현체 매핑을 지원하기 때문에 추후 Hibernate외에 다른 구현체로 쉽게 교체가 가능하다.
    
2. **저장소 교체의 용이성**    
    Spring Data의 하위 프로젝트들은 기본적인 CRUD 인터페이스가 같기 때문에 추후 관계형 데이터베이스 외에 다른 저장소(MongoDB 등)로 쉽게 교체가 가능하다.추후 Hibernate외에 다른 구현체로 쉽게 교체가 가능하다.
    
2. **저장소 교체의 용이성**    
    Spring Data의 하위 프로젝트들은 기본적인 CRUD 인터페이스가 같기 때문에 추후 관계형 데이터베이스 외에 다른 저장소(MongoDB 등)로 쉽게 교체가 가능하다.

---
---

## build.gradle

```java
dependencies{
	compile('org.springframework.boot:spring-boot-starter-web')
	compile('org.projectlombok:lombok')
	compile('org.springframework.boot:spring-boot-starter-data-jpa')
	compile('com.h2database:h2')

	testCompile('org.springframework.boot:spring-boot-starter-test')
}
```

두개의 디펜던시 추가

1. org.springframework.boot:spring-boot-starter-data-jpa
    - 스프링 부트용 Spring Data Jpa 추상화 라이브러리
    - 스프링 부트 버전에 맞춰 자동으로 JPA관련 라이브러리들의 버전을 관리
2. com.h2database:h2
    - 인메모리 관계형 데이터베이스
    - 별도의 설치 필요 없이 의존성만으로 관리가 가능하다.
    - 메모리에서 실행되기 때문에 애플리케이션을 재시작할 때마다 초기화된다.
    - 위 특징을 활용하여 테스트용도로 많이 사용된다.

## Posts

 

```java
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

import javax.persistence.*;

@Getter
@NoArgsConstructor
@Entity     
public class Posts{

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

	@Column(length = 500, nullable = false)
    private String title;

	@Column(columnDefinition = "TEXT", nullable = false)
	private String content;

    private String author;

    @Builder    
    public Posts(String title, String content, String author){
		this.title = title;
        this.content = content;
        this.author = author;
	}
}
```

실제 DB의 테이블과 매칭될 클래스. 주로 Entity 클래스라고 한다.

도메인 : 게시판, 회원, 결제 등 소프트웨어에 대한 요구사항 혹은 문제영역
xml에 쿼리를 담고, 클래스에 쿼리의 결과를 담던 것들이 모두 도메인 클래스에서 해결된다.

### @Entity

- 테이블과 링크될 클래스임을 나타낸다.
- 기본값으로 클래스의 카멜케이스 이름을 언더스코어 네이밍으로 테이블 이름을 매칭한다.

### @Id

- 해당 테이블의 PK
    - 웬만하면 Entity의 PK는 Long타입 + Auto_increment로 사용

### @GeneratedValue(strategy = GenerationType.IDENTITY)

- PK의 생성 규칙.
- Spring Boot 2.0에서는 GenerationType.IDENTITY 옵션을 추가해야 auto_increment가 된다.

### @Column(length = 500, nullable = false)

- 테이블의 컬럼을 나타내며, 굳이 선언하지 않더라도 해당 클래스의 필드는 모두 컬럼.
- 변경이 필요한 옵션이 있을 경우 사용한다. (ex> 문자열 사이즈 변경, 타입 변경 등)

### @Builder

- 해당 클래스의 빌더 패턴 클래스를 생성한다.
- 생성자 상단에 선언 시 생성자에 포함된 필드만 빌더에 포함한다.

**서비스 초기 구축 단계에선 테이블(Entity 클래스) 설계가 빈번하게 변경되는데, 이때 롬복의 어노테이션이 코드 변경량을 최소화시켜준다.**

### Getter와 Setter를 무작성 생성하지 말자!

- 무작정 생성하면 해당 클래스의 인스턴스 값들이 언제 어디서 변해야하는지 코드상으로 명확하게 구분이 어려워 추후 기능 변경 시 복잡하다.
- **Entity 클래스에서는 Setter를 만들지 않는다.**
- 값의 변경이 꼭 필요하다면 그 목적과 의도가 분명한 메서드를 생성하여 Setter의 역할을 대신 한다.
  ex) public void setStatus(boolean status){ this.status = status; } (X)
        public void cancleOrder() { this.status = false; } (O)

### Setter가 없다면 필드에 값은 어떻게 채울 수 있나?

- 생성자를 통해 최종값을 채운 후 DB에 삽입
- 값의 변경이 필요하다면 위에서 말한 대로 해당 이벤트의 목적과 의도가 분명한 public메서드를 호출하여 변경

## PostsRepository

```
import org.springframework.data.jpa.repository.JpaRepository;

public interface PostsRepository extends JpaRepository<Posts, Long> {

}
```

DB Layer 접근자(MyBatis에서 DAO)

- 인터페이스를 생성 후 JpaRepository<Entity클래스, PK타입>을 implements하면 기본CRUD메서드가 자동으로 생성된다.
- Entity 클래스와 같은 디렉토리에 있어야 Entity 클래스가 제 기능을 할 수 있다.

## PostsRepositoryTest

```java
import com.shawn.springboot.domain.posts.Posts;
import com.shawn.springboot.domain.posts.PostsRepository;
import org.junit.After;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.junit4.SpringRunner;
import static org.assertj.core.api.Assertions.assertThat;

@RunWith(SpringRunner.class)
@SpringBootTest
public class PostsRepositoryTest{

		@Autowired
	    PostsRepository postsRepository;
	
	    @After      
	    public void cleanup(){
			postsRepository.deleteAll();
		}
	
		@Test
	    public void 게시글저장_불러오기(){
			//given
	    	String title = "테스트 게시글";
	    	String content = "테스트본문";
	
	      
	      	postsRepository.save(Posts.builder()
										.title(title)
										.content(content)
										.author("shshhan@shawn.com")
										.build());
																
	        //when                      
		    List<Posts>postsList = postsRepository.findAll();

	    	//then
	        Posts posts = postsList.get(0);
			assertThat(posts.getTitle()).isEqualTo(title);
			assertThat(posts.getContent()).isEqualTo(content);
		}																		
	}
```

### @SpringBootTest

- 자동으로 H2 데이터베이스 실행

### @After

- 단위 테스트가 끝날 때 마다 수행되는 메서드로 지정
- 주로 배포 전 전체 테스트 수행 중 테스트간 데이터 침범을 막기 위해 사용

### @postsRepository.save()

- 테이블 posts에 id 값이 있으면 update, 없으면 insert 수행

### @postsRepository.findAll()

- 테이블 posts에 있는 모든 데이터를 조회

## application.properties

```
#JPA에서 실행한 SQL 로그 보기/안보기
spring.jpa.show_sql=true

#출력되는 SQL 로그를 MySQL 버전으로 출력
spring.jpa.properties.hibernate.dialect=org.hibernate.dialect.MySQL5InnoDBDialect

#H2 데이터베이스에 직접 접근하기 위해 웹 콘솔 사용
spring.h2.console.enabled=true
```

---
---

## API를 만들기 위해 필요한 클래스

- Request 데이터를 받을 Dto
- API 요청을 받을 Controller
- 트랜잭션, 도메인 기능 간의 순서를 보장하는 Service

나는 지금껏 비즈니스 로직은 Service에서 처리한다고 배우고 그렇게 실천해왔는데 이 책에서는 나의 이 생각을 읽기라도 한듯 ‘그렇지 않다!'라고 한다. Service는 **트랜잭션, 도메인 간 순서 보장의 역할**만 한다고 한다.

그럼 비즈니스 로직은 누가 처리하지?
![](https://images.velog.io/images/shawnhansh/post/56bcf13e-0b00-471b-8b76-0a31e803d91e/image.png)

(이거 알면 최소 20대 후반)


## 그 전에 Spring의 각 웹 계층을 살펴보자!

![](https://images.velog.io/images/shawnhansh/post/916e2b09-bccd-410c-a68e-619e99289080/image.png)

### Web Layer

- Filter, Interceptor, Controller Advice, Controller, View Template 등 **외부 요청과 응답에 대한 전반적인 영역**

### Service Layer

- @Service에 사용 되는 영역
- Controller와 DAO의 중간 영역에서 사용
- @Transactional이 사용되어야 하는 영역

### Persistence Layer (=Repository Layer)

- DB와 같은 데이터 저장소에 접근하는 영역

### DTOs

- **계층 간 데이터 교환을 위한 객체**인 DTO(Data Transfer Object)의 영역

### Domain Model

- 도메인이라 불리는 개발 대상을 모든 사람이 동일한 관점에서 이해할 수 있고 공유할 수 있도록 단순화 시킨 것
- 택시 앱을 예로 들면 배차, 탑승, 요금 등이 모두 도메인
- @Entity가 사용된 영역, VO(Value Object)
- **비즈니스 로직을 처리해야 하는 곳**

### 주문을 취소하는 상황에서

1. Service Layer에서 비즈니스 로직을 처리할 경우
    
    ```java
    @Transactional
    public Order cancelOrder(int orderId){
    	Orders order = orderRepository.findById(orderId);
    	Billing billing = billingRepository.findByOrderId(orderId);
    	Delivery delivery = deliveryRepository.findByOrderId(orderId);
    
    	String deliveryStatus = delivery.getStatus();
    
    	if("IN_PROGRESS".equals(deliveryStatus)){
    		delivery.setStatus("cancel");
    		deliveryDao.update(delivery);	
    	}
    
    	order.setStatus("cancel");
    	ordersDao.update(order);
    	
    	billing.setStatus("cancel");
    	billngDao.update(billing);
    	
    	return order;
    }
    ```
    
    필요한 데이터를 조회하여 취소가 가능하다면 각 테이블에 취소 상태를 update
    
    → 서비스 계층이 무의미하고, 객체란 단순히 데이터 덩어리 역할만 하게됨
    
2. Domain Model에서 비즈니스 로직을 처리할 경우
    
    ```java
    @Transactional
    public Order cancelOrder(int orderId){
    	Orders order = orderRepository.findById(orderId);
    	Billing billing = billingRepository.findByOrderId(orderId);
    	Delivery delivery = deliveryRepository.findByOrderId(orderId);
    
    	deliver.cancle();
    	order.cancel();
    	billing.cancel();
    	
    	return order;
    }
    ```
    
    필요한 데이터를 조회한 뒤 각 객체가 각각의 취소 이벤트 처리를 하며, **서비스 메서드는 트랜잭션과 도메인 간의 순서만 보장**
    

---

## PostsApiController

```java
import com.shawn.springboot.service.posts.PostsService;
import com.shawn.springboot.web.dto.PostsSaveRequestDto;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

@RequiredArgsConstructor
@RestController
public class PostsApiController {
    private final PostsService postsService;
   

    @PostMapping("/api/v1/posts")
    public Long save(@RequestBody PostsSaveRequestDto requestDto){
        return postsService.save(requestDto);
    }

    @PutMapping("/api/v1/posts/{id}")
    public Long update(@PathVariable Long id, @RequestBody PostsUpdateRequestDto requestDto){
        return postsService.update(id, requestDto);
    }

    @GetMapping("/api/v1/posts/{id}")
    public PostsResponseDto findById(@PathVariable Long id){
        return postsService.findById(id);
    }

    @DeleteMapping("/api/v1/posts/{id}")
    public Long delete(@PathVariable Long id){
        postsService.delete(id);
        return id;
    }
}                                                           
```

### Injection

- Bean을 주입 받는 방식들(@Autowired, Setter, 생성자) 중 으뜸은 생성자로 주입 받기.
- final로 필드를 선언하고 @RequiredArgsConstructor로 생성자 생성.
- 직접 생성자를 만드는 대신 롬복을 사용하는 이유 : 클래스의 의존성 관계가 변경될 때마다 코드를 계속 수정하는 번거로움을 해결하기 위해


## PostsRepository
```java
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

public interface PostsRepository extends JpaRepository<Posts, Long> {

    @Query("SELECT p FROM Posts p ORDER BY p.id DESC")
    List<Posts> findAllDesc();

}
```
SpringDataJPA에서 제공하지 않는 메서드는 @Query와 함께 쿼리문으로 작성할 수 있다.
규모가 있는 프로젝트에서의 데이터 조회는 FK의 Join, 복잡한 조건 등으로 인해 Entity 클래스만으로 처리하기 어려워 조회용 프레임워크를 추가로 사용한다.
대표적으로 querydsl, jooq, myBatis가 있다.
프레임워크로 조회하고, 등록/수정/삭제는 SpringDataJpa를 사용한다.

## PostsService

```java
package com.shawn.springboot.service.posts;

import com.shawn.springboot.domain.posts.Posts;
import com.shawn.springboot.domain.posts.PostsRepository;
import com.shawn.springboot.web.dto.PostsListResponseDto;
import com.shawn.springboot.web.dto.PostsResponseDto;
import com.shawn.springboot.web.dto.PostsSaveRequestDto;
import com.shawn.springboot.web.dto.PostsUpdateRequestDto;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@RequiredArgsConstructor
@Service
public class PostsService {
    private final PostsRepository postsRepository;

    @Transactional
    public Long save(PostsSaveRequestDto requestDto){
        return postsRepository.save(requestDto.toEntity()).getId();
    }

    @Transactional
    public Long update(Long id, PostsUpdateRequestDto requestDto){
        Posts posts = postsRepository.findById(id)
                                        .orElseThrow( () -> new IllegalArgumentException("해당 게시글이 없습니다. id =" + id) );
        posts.update(requestDto.getTitle(), requestDto.getContent());

        return id;
    }

    public PostsResponseDto findById(Long id){
        Posts entity = postsRepository.findById(id)
                                        .orElseThrow(() -> new IllegalArgumentException("해당 게시글이 없습니다. id=" + id));

        return new PostsResponseDto(entity);
    }

    @Transactional(readOnly = true)
    public List<PostsListResponseDto> findAllDesc() {
        return postsRepository.findAllDesc().stream().map(PostsListResponseDto::new).collect(Collectors.toList());
        //map(PostsListResponseDto::new) == map(posts -> new PostsListResponseDto(posts))
    }

    @Transactional
    public void delete(Long id){
        Posts posts = postsRepository.findById(id).orElseThrow(() -> new IllegalArgumentException("해당 게시글이 없습니다. id=" + id));
        postsRepository.delete(posts);
    }
}
```

### update

- update 기능에서는 JPA의 영속성 컨텍스트(엔티티를 영구 저장하는 환경) 덕분에 쿼리를 직접 날리지 않아도 된다.
- JPA의 엔티티 매니저가 활성화된 상태(Spring Data JPA를 싸용하면 기본 옵션)에서는 트랜잭션 안에서 DB 데이터를 가져오면 해당 데이터는 영속성 컨텍스트가 유지되는 상태
- 이 데이터의 값을 변경하면 트랜잭션이 끝나는 시점에 해당 테이블에 변경된 데이터를 반영한다.
- Entity 객체의 값 변경 만으로 update. [더티 체킹](https://jojoldu.tistory.com/415)이라고 표현.

### delete
- delete()는 엔티티를 파라미터로 삭제할 수 있고, deleteBuId()를 사용하면 id로 삭제할 수도 있다.
- 여기서는 존재하는 Posts인지 확인을 위해 엔티티 조회 후 그대로 삭제

### @Transactional(readOnly = true)
- 트랜잭션 범위는 유지하되, 조회기능만 남겨두어 조회 속도 개선된다.

## PostsSaveRequestDto

```java
import com.shawn.springboot.domain.posts.Posts;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@NoArgsConstructor
public class PostsSaveRequestDto {
    private String title;
    private String content;
    private String author;

    @Builder
    public PostsSaveRequestDto(String title, String content, String author) {
        this.title = title;
        this.content = content;
        this.author = author;
    }

    public Posts toEntity(){
        return Posts.builder()
                .title(title)
                .content(content)
                .author(author)
                .build();
    }

}
```

- Entity 클래스와 유사한 형태이지만 **절대로 Entity 클래스를 Request/Response 클래스로 사용하면 안된다!**
- Entity 클래스는 DB와 맞닿은 핵심 클래스. 이를 기준으로 테이블이 생성되고 스키마가 변경된다.
- Dto는 View를 위한 클래스이기 때문에 변경이 잦다.
- View Layer와 DB Layer의 역할을 철저하게 분리하는 것이 좋다.

## PostsResponseDto

```java
import com.shawn.springboot.domain.posts.Posts;
import lombok.Getter;

@Getter
public class PostsResponseDto {

    private Long id;
    private String title;
    private String content;
    private String author;

    public PostsResponseDto(Posts entity){
        this.id = entity.getId();
        this.title = entity.getTitle();
        this.content = entity.getContent();
        this.author = entity.getAuthor();
    }

```

- PostsResponseDto는 Entity의 필드 중 일부만 사용하므로 생성자로 Entity를 받아 필드에 값을 넣는다.
- 굳이 모든 필드를 가진 생성자가 필요하진 않으므로 Dto는 Entity를 받아 처리한다.

## PostsUpdateRequestDto

```java
package com.shawn.springboot.web.dto;

import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@NoArgsConstructor
public class PostsUpdateRequestDto {
    private String title;
    private String content;

    @Builder
    public PostsUpdateRequestDto(String title, String content){
        this.title = title;
        this.content = content;
    }
}
```

## PostsApiControllerTest

```java
package com.shawn.springboot.web;

import com.shawn.springboot.domain.posts.Posts;
import com.shawn.springboot.domain.posts.PostsRepository;
import com.shawn.springboot.web.dto.PostsSaveRequestDto;
import org.junit.After;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.web.client.TestRestTemplate;
import org.springframework.boot.web.server.LocalServerPort;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.test.context.junit4.SpringRunner;

import java.util.List;

import static org.assertj.core.api.Assertions.assertThat;

@RunWith(SpringRunner.class)
@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT) 
public class PostsApiControllerTest {

    @LocalServerPort
    private int port;

    @Autowired
    private TestRestTemplate restTemplate;

    @Autowired
    private PostsRepository postsRepository;

    @After
    public void tearDown() throws Exception{
        postsRepository.deleteAll();
    }

    @Test
    public void Posts_등록된다() throws Exception{
        //given
        String title = "title_for_test";
        String content = "content_for_test";
        PostsSaveRequestDto requestDto = PostsSaveRequestDto.builder()
                                                    .title(title)
                                                    .content(content)
                                                    .author("author_for_test")
                                                    .build();

        String url = "http://localhost:" + port + "/api/v1/posts";

        //when
        ResponseEntity<Long> responseEntity = restTemplate.postForEntity(url, requestDto, Long.class);

        //then
        assertThat(responseEntity.getStatusCode()).isEqualTo(HttpStatus.OK);
        assertThat(responseEntity.getBody()).isGreaterThan(0L);

        List<Posts> all = postsRepository.findAll();
        assertThat(all.get(0).getTitle()).isEqualTo(title);
        assertThat(all.get(0).getContent()).isEqualTo(content);

    }

    @Test
    public void Posts_수정된다() throws Exception{
        //given
        Posts savedPosts = postsRepository.save(Posts.builder()
                                            .title("title__2")
                                            .content("content__2")
                                            .author("author__2")
                                            .build());
    }

		@Test
    public void Posts_수정된다() throws Exception{
        //given
        Posts savedPosts = postsRepository.save(Posts.builder()
                                            .title("title__2")
                                            .content("content__2")
                                            .author("author__2")
                                            .build());

        Long updateId = savedPosts.getId();
        String expectedTitle = "title2";
        String expectedContent = "content2";

        PostsUpdateRequestDto requestDto = PostsUpdateRequestDto.builder().title(expectedTitle).content(expectedContent).build();

        String url = "http://localhost:" + port + "/api/v1/posts/" + updateId;

        HttpEntity<PostsUpdateRequestDto> requestEntity = new HttpEntity<>(requestDto);

        //when
        ResponseEntity<Long> responseEntity = restTemplate.exchange(url, HttpMethod.PUT, requestEntity, Long.class);

        //then
        assertThat(responseEntity.getStatusCode()).isEqualTo(HttpStatus.OK);
        assertThat(responseEntity.getBody()).isGreaterThan(0L);

        List<Posts> all = postsRepository.findAll();
        assertThat(all.get(0).getTitle()).isEqualTo(expectedTitle);
        assertThat(all.get(0).getContent()).isEqualTo(expectedContent);

    }
}
```

### @SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT)

- JPA 기능까지 한번에 테스트 할 때는 @SpringBootTest와 TestRestTemplate을 활용한다.
---
---

생성시간과 수정시간을 처리하기 위해 단순하고 반복적인 코드가 모든 테이블과 서비스 메서드에 포함된다.
JPA Auditing을 사용하면 이 문제를 해결할 수 있다.

## BaseTimeEntity

```java
import lombok.Getter;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.LastModifiedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import javax.persistence.EntityListeners;
import javax.persistence.MappedSuperclass;
import java.time.LocalDateTime;

@Getter
@MappedSuperclass   
@EntityListeners(AuditingEntityListener.class)  
public class BaseTimeEntity {

    @CreatedDate    
    private LocalDateTime createdDate;

    @LastModifiedDate   
    private LocalDateTime modifiedDate;

}

```

모든Entity의 상위 클래스가 되어 Entity들의 createdDate, modifiedDate를 자동으로 관리

### @MappedSuperclass

- JPA Entity 클래스들이 BaseTimeEntity를 상속할 경우 이 클래스의 필드도 컬럼으로 인식하게 된다

### @EntityListeners(AuditingEntityListener.class)

- BaseTimeEntity 클래스에 Auditing 기능을 포함시킨다

### @CreatedDate

- Entity가 생성되어 저장될 때 시간이 자동 저장된다

### @LastModifiedDate

- 조회한 Entity의 값을 변경할 때의 시간이 자동 저장된다.

이후에는 Entity에서 BaseTimeEntity를 extends 시키고, Application 클래스에 @EnableJpaAuditing 어노테이션을 추가한다.

```java
...
@Entity
public class Posts extends BaseTimeEntity {

...
```

```
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.data.jpa.repository.config.EnableJpaAuditing;

@EnableJpaAuditing
@SpringBootApplication
public class Application {
    public static void main(String[] args) {
        SpringApplication.run(Application.class, args);
    }
}
```

### @EnableJpaAuditing

- JPA Auditing 활성화

## PostsRepositoryTest

```java
import com.shawn.springboot.domain.posts.Posts;
import com.shawn.springboot.domain.posts.PostsRepository;
import org.junit.After;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.junit4.SpringRunner;

import java.time.LocalDateTime;
import java.util.List;

import static org.assertj.core.api.Assertions.assertThat;

@RunWith(SpringRunner.class)
@SpringBootTest    
public class PostsRepositoryTest {

    @Autowired
    PostsRepository postsRepository;

    @After
    public void cleanup(){
        postsRepository.deleteAll();
    }

    @Test
    public void BaseTimeEntity_등록(){
        //given
        LocalDateTime now = LocalDateTime.of(2019,6,4,0,0,0);
        postsRepository.save(Posts.builder()
                .title("test_title")
                .content("test_content")
                .author("author")
                .build());

        //when
        List<Posts> postsList = postsRepository.findAll();

        //then
        Posts posts = postsList.get(0);

        System.out.println(">>>>>> createDate : "+posts.getCreatedDate() +", modifiedDate : " + posts.getModifiedDate());

				assertThat(posts.getCreatedDate()).isAfter(now);
				assertThat(posts.getModifiedDate()).isAfter(now);
    }
}
```