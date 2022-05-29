![](https://velog.velcdn.com/images/shawnhansh/post/f1526846-75c7-4577-9411-541597351cd8/image.png)
최근 스프링부트 2.6.7 버전으로 개발을 하는 중인데 빌드를 하면 jar 파일이 두개가 생성되었습니다.
하나는 기존에 알고 있던 [프로젝트명-버전.jar]이고, 다른 하나는 [프로젝트명-버전-plain.jar]였습니다.

뒤에 plain이 붙은 jar는 무엇이고 왜 생기는지 궁금해져서 찾아보았습니다.

## Executable & Plain

빌드시 생성되던 기존에 알고있던 jar을 "Executable Archive" 혹은 "Executable Jar"라는 것을 알 수 있었습니다.
이 jar를 java -jar 명령어로 실행시키면 애플리케이션이 구동이 되는데, 이는 익히 알고 있듯이 jar에는 애플리케이션 구동에 필요한 의존성이 모두 포함되어 있기 때문이죠.

하지만 plain.jar은 이와 달랐습니다.
"Plain Archive" 혹은 "Plain Jar"라고 부르는 이 jar은 Excutable jar와는 달리 의존성을 포함하지 않고 클래스와 리소스 파일만 포함되어 있습니다. 따라서 java -jar 명령어로 실행 시 에러가 발생한다.

## Plain Jar가 생성된 이유

Plain Jar가 생기는 이유는 스프링부트의 버전에 따른 gradle 플러그인의 Packaging 기본 설정 차이 때문입니다.

기존에 개발하던 프로젝트인 2.4.1 버전과, 이번에 새로 시작한 프로젝트인 2.6.7 버전의 공식문서를 찾아보았습니다.

![](https://velog.velcdn.com/images/shawnhansh/post/04449546-9d8e-4411-8e51-8d8bfd645dae/image.png)

2.4.1 버전의 공식문서에서는 _"bootJar 혹은 bootWar task가 설정되어있다면 jar 혹은 war task가 실행되지 않는다"_는 내용을 찾을 수 있었습니다.

![](https://velog.velcdn.com/images/shawnhansh/post/ac70af2b-5715-45e3-a993-c81f635ac36c/image.png)

실제로 2.4.1 버전의 프로젝트 build시 bootJar Task는 실행되고 jar Task는 스킵된 것을 확인 할 수 있었습니다.


![](https://velog.velcdn.com/images/shawnhansh/post/c9c8375c-51ba-49eb-a6b3-e75c595caca7/image.png)

2.6.7 버전의 공식문서에는 _"bootJar 혹은 bootWar가 설정되어 있어도 분류자의 컨벤션에 따라 Plain Archive를 사용하기 위해 jar 혹은 war Task가 설정된다."_라고 명시되어 있습니다.

![](https://velog.velcdn.com/images/shawnhansh/post/e2790350-e28e-4468-bf5b-607484df4309/image.png)

jar Task를 실행하지 않던 2.4.1 버전과는 달리 bootJar Task 뿐 아니라 jar Task도 정상적으로 수행되었고, 이에 따라 두개의 jar가 생성되었던 것입니다.

## Jar Task 수행하지 않기

상황에 따라 의존성이 포함되어있지 않은 plain jar가 함께 필요하다면 그냥 사용해도 무방하지만, 저는 executable jar만 필요한 관계로 **jar Task를 수행시키지 않기로 결정했습니다.**

![](https://velog.velcdn.com/images/shawnhansh/post/c9c8375c-51ba-49eb-a6b3-e75c595caca7/image.png)

방법은 공식문서에 함께 명시되어있습니다.

![](https://velog.velcdn.com/images/shawnhansh/post/f4fac33c-d129-4d98-877d-777693c7cefb/image.png)

2.6.7 버전 프로젝트의 build.gradle에 공식문서에 명시된 코드를 추가한 뒤 다시 build한 결과 jar Task가 수행되지 않은 것을 확인했습니다.

---
참고
- https://earth-95.tistory.com/132?utm_source=pocket_mylist
- https://dev-j.tistory.com/22
- https://docs.spring.io/spring-boot/docs/2.6.7/gradle-plugin/reference/htmlsingle/#packaging-executable-wars-deployable
- https://docs.spring.io/spring-boot/docs/2.4.1/gradle-plugin/reference/htmlsingle/#packaging-executable-wars-deployable
