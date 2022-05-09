요즘 회사에서 신규 프로젝트를 생성하는 중입니다.

기존 프로젝트에서 사용하던 의존성을 그대로 사용하여 생성하던 중에 스프링 시큐리티 관련하여 문제들이 발생했고, 해당 문제의 원인을 찾다보니 pom.xml도 자세히 들여다보게 되었습니다.

안그래도 스프링 부트는 내가 추가한 dependency가 몇 개 없는데 라이브러리는 어떻게 많이 추가될까 궁금했었기 때문에 스프링 부트의 pom.xml에 대해 알아보았습니다.(_~~하지만 시큐리티 문제는 아직 해결하지 못했,,크읍,,~~_)

## 부트와 레거시의 pom.xml

저는 스프링 부트가 아닌 스프링 레거시를 먼저 사용했는데, 스프링 레거시를 쓸 때 pom.xml은 아래와 같았습니다.

![](https://velog.velcdn.com/images/shawnhansh/post/7783831a-8317-4238-8958-9f0faae87183/image.png)

스프링 부트의 pom.xml은 아래와 같습니다.

![](https://velog.velcdn.com/images/shawnhansh/post/f94f0d5d-0862-451d-9daa-059066cc80a4/image.png)

전문을 캡처한 것은 아니지만 눈에 띄는 차이가 있습니다.

부트의 pom.xml에는 레거시의 pom.xml에는 없던 parent 태그가 보이고, depndency에는 version이 명시되어 있지 않습니다.

또 캡쳐상에는 나타나지 않지만 부트의 pom.xml에 선언하지 않은 dependency도 프로젝트의 의존성으로 추가 되어있습니다.

**이게 어떻게 가능한 일일까요?**

## 스프링 부트의 의존성 관리

![](https://velog.velcdn.com/images/shawnhansh/post/3070231e-4a9b-472d-8085-2c7dd82daec7/image.png)

version을 명시하지 않아도 되는 이유도 추가하지 않은 dependency도 프로젝트에 추가 되어있는 이유도 결국 정답은 아버지에게 있었습니다(?)

parent태그에 선언되어 있는 spring-boot-starter-parent 속으로 들어가봅시다. 윈도우는 ctrl, 맥은 cmd를 누르고 클릭하면 들어갈 수 있습니다.

![](https://velog.velcdn.com/images/shawnhansh/post/1eaf5738-8b7d-4d30-ab17-b31715baec5a/image.png)


spring-boot-starter-parent에는 spring-boot-dependencies가 parent 태그로 선언되어 있고 여러 properties와 build 관련 태그들이 많이 보입니다.

여기서 이름만 봐도 실마리가 풀릴거 같은 spring-boot-dependencies 속으로 한번 더 들어가보겠습니다.

![](https://velog.velcdn.com/images/shawnhansh/post/156095cf-aa8c-42c7-8948-17e08ace8891/image.png)

![](https://velog.velcdn.com/images/shawnhansh/post/61a4c890-6d49-43a4-86e4-e5225824a11a/image.png)

spring-boot-dependencies 내부에 properties로 수많은 버전 정보들이 선언되어있고, 하단 dependencyManagement 내부 dependencies에 수 많은 dependency가 properties의 버전 혹은 명시된 버전으로 선언되어있는걸 확인할 수 있습니다.

## pom.xml에서 기대할 수 있는 효과

```
pom.xml

<dependency>
	<groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-data-jpa</artifactId>
</dependency>
```
```
spring-boot-dependencies

<dependencyMangement>
	<dependencies>
    	...
    	...
    	<dependency>
        	<groupId>org.springframework.boot</groupId>
        	<artifactId>spring-boot-starter-data-jpa</artifactId>
        	<version>2.6.6</version>
    	</dependency>
        ...
        ...
    </dependencies>
</dependencyManagement>
```

만약 pom.xml에서 위와 같이 dependency를 하나 추가한다면 이는 부모 pom을 타고 올라가 spring-boot-dependencies에서 관리하고 있는 동명의 dependency를 추가하게 됩니다.


```
spring-boot-starter-data-jpa

<dependencies>
    <dependency>
      <groupId>org.springframework.boot</groupId>
      <artifactId>spring-boot-starter-aop</artifactId>
      <version>2.6.6</version>
      <scope>compile</scope>
    </dependency>
    ...
    (중략)
    ...
    <dependency>
      <groupId>org.springframework</groupId>
      <artifactId>spring-aspects</artifactId>
      <version>5.3.18</version>
      <scope>compile</scope>
    </dependency>
  </dependencies>
```
spring-boot-dependencies에 추가되어있는 spring-boot-starter-data-jpa 역시 위와 같이 여러 dependency를 갖고 있습니다.

이렇게 pom.xml에서 의존성을 추가하면 spring-boot-starter-parent를 거쳐 spring-boot-dependencies에 추가된 dependency를 추가하기 때문에 **버전에 대한 명시가 필요하지 않고 적은 의존성 추가로도 여러 의존성을 한번에 주입 받을 수 있습니다.**

## import하여 의존성 관리 사용하기

만약 사용하는 parent가 기존에 있거나, 의존성 관리에 포함되어있는 라이브러리를 다른 버전으로 사용하길 원할 경우 의존성 관리를 import하여 해결할 수 있습니다.

```
<dependencyManagement>
	<dependencies>
		<dependency>
			<!-- Import dependency management from Spring Boot -->
			<groupId>org.springframework.boot</groupId>
			<artifactId>spring-boot-dependencies</artifactId>
			<version>2.6.6</version>
			<type>pom</type>
			<scope>import</scope>
		</dependency>
	</dependencies>
</dependencyManagement>
```

pom.xml에 위와 같이 설정을 추가하면 별도의 parent와 더불어 spring-boot-dependencies의 의존성 관리도 함께 사용할 수 있습니다.

만약 특정 라이브러리를 다른 버전으로 쓰고 싶다면 해당 라이브러리를 dependency로 먼저 추가한 뒤에 dependencyManagement를 선언해야 합니다.

## 마치며

레거시에서는 버전이 호환 되는지 알아봐가며 하나하나 추가해주었는데 부트에서는 이를 한번에 관리해주고 내가 원하는 것만 찾아 쓰면 되니 이제서야 비로소 왜 스프링 부트가 훨씬 편하다고 하는지 실감이 되었습니다.
비록 기존에 해결하려던 시큐리티 문제는 해결하지 못했지만 이를 계기로 스프링 부트와 한걸음 더 가까워진 것 같아 뿌듯하네요...ㅎ

gradle에서는 이 의존성 관리를 어떻게 확인할 수 있는지도 궁금해졌습니다.
이건 다음에 이 포스팅에 덧붙이거나 새로운 포스팅을 작성해보도록 하겠습니다.

이제 저는 얼른 다시 시큐리티 문제를 해결해보러,,,

---
참고
- https://velog.io/@hsw0194/스프링-부트의-의존성-관리
- https://jwdeveloper.tistory.com/107
- https://jeong-pro.tistory.com/168

