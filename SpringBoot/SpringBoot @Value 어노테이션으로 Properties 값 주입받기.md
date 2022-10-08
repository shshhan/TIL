## properties에서 값을 주입 받는 이유
스프링 환경에서 개발을 하다보면 properties의 값을 코드로 가져와서 사용해야할 경우가 종종 있습니다.

저는 주로 아래와 같은 경우에 properties에 값을 선언해두고 필드로 주입합니다.

```
1) API KEY 혹은 Password 등과 같은 민감정보일 경우
2) 추후에 값이 바뀔 우려가 있는 경우
```

1번과 같은 경우는 git 혹은 블로그에 코드를 공개할 때 나의 민감정보를 숨길 수 있다는 장점이 있고,
2번은 추후 정말로 값이 변경되어야 할 경우 코드를 수정하고 배포 및 적용에 발생하는 리소스를 줄일 수 있습니다.

## @Value를 사용하여 값 주입 받기
현재 혼자 개발 중인 프로젝트에서 서울교통공사 홈페이지의 공지사항을 크롤링 해오는 부분이 있어, 이부분 역시 아래와 같이 properties에 선언 후, @Value 어노테이션을 통해 필드로 주입하였습니다.

![](https://velog.velcdn.com/images/shawnhansh/post/2b46ebb4-ef36-4583-93b3-90803a5821db/image.png)

![](https://velog.velcdn.com/images/shawnhansh/post/5c4c0711-f6e5-430b-bc5b-76283232a4ca/image.png)

## 예상치 못하게 마주친 오류

하지만 저는 여기서 한가지 문제를 마주하게 되었는데요..
다른 테스트에서는 모두 정상적으로 properties에서 주입받은 값이 들어가는데 유독 한 테스트에서만 필드에서 값을 주입받지 못했습니다.

``` java
@Test
	public void collectItems() throws IOException {
		scheduler.collectItems();
    	...
	}
```
![](https://velog.velcdn.com/images/shawnhansh/post/812e16d2-317e-4b6f-b888-2010663046a6/image.png)


``` java
 @Test
    public void collectInformation() throws NoSuchFieldException, IllegalAccessException {
        seoulMetroFinder.collectInformation(today, now);
    }
```

![](https://velog.velcdn.com/images/shawnhansh/post/b9bbd9a2-5b43-4aae-8c3f-0c721096b79a/image.png)

## 오류의 원인

해당 오류의 원인은 @Value 어노테이션의 특성에 있었습니다.
@Value 어노테이션은 BeanPostProcessor에 의해 수행되는데, BeanPostProcessor는 스프링이 빈 저장소에 등록할 목적으로 생성한 객체를 빈 저장소에 등록하기 직전에 조작하고 싶을 때 사용하는 기능입니다.

즉, 스프링 빈으로 등록되는 객체에 한해서만 @Value 어노테이션이 동작하여 값을 주입합니다.

![](https://velog.velcdn.com/images/shawnhansh/post/9e156299-360b-40f1-9aba-b5de3af2cf60/image.png)

빈이 생성될 때 @Value 어노테이션을 처리하는데, 위와 같이 인스턴스를 생성할 경우 값이 주입되지 못했던 것입니다.

지금까지는 스프링 환경에서 대부분의 클래스들을 빈으로 등록하여 사용하여 이런 오류가 발생한적 없었지만, 이번에 확장성을 고려하여 팩토리 패턴을 이용해보기 위해 코드를 리팩토링 하는 과정에서 빈이 아닌 새로운 인스턴스를 생성하여 사용한 것이 트리거가 되었습니다.

앞으로 @Value 어노테이션을 이용할 때는 반드시 객체를 빈으로 등록하여 사용해야겠습니다!

---
출처
BeanPostProcessor : https://jaimemin.tistory.com/2028