[이동욱님](https://jojoldu.tistory.com/) 저서 '[스프링 부트와 AWS로 혼자 구현하는 웹 서비스](http://www.kyobobook.co.kr/product/detailViewKor.laf?ejkGb=KOR&mallGb=KOR&barcode=9788965402602)'를 공부하며 처음으로 gradle을 사용해보았다.

maven만 사용하다가 처음 사용한 gradle은 낯설었고 서버에 올려 배포하는 과정(**사실 배포 전 test과정**)에서 여러 오류를 만났다.

지난 며칠간 퇴근 후 매달리며 해결했던 gradle의 오류들을 정리해보려고 한다.

## Error : Could not find or load main class org.gradle.wrapper.GradleWrapperMain

![](https://velog.velcdn.com/images/shawnhansh/post/50c81232-d1cd-4190-bcb9-37f437f39b05/image.png)

- 오류 시점 : ./gradlew test를 수행하는 시점
- 원인 : gradle-wrapper.jar가 없는 상태에서 gradlew 명령어를 수행
- 해결 방법 : 프로젝트의 gradle/wrapper/ 경로에 gradle-wrapper.jar 파일 생성
    
```
gradle wrap
```
명령어를 사용하여 gradle-wrapper.jar를 생성할 수 있다.

gradle이 설치되어 있지 않다면 gradle을 먼저 설치 해야한다.
ubuntu를 사용한다면 터미널을 통해 설치 명령어를 친절하게 알려주지만 본인이 필요한 버전이 목록에 없다면 직접 설치 해야한다.
나의 경우는 당시 4.10.2 버전을 사용 중이어서 제공받은 명령어로 설치했지만 이후에 gradle 버전을 업그레이드하여 결국 다시 설치하였다.

> 내용 추가!
[gradle 공식문서](https://docs.gradle.org/current/userguide/gradle_wrapper.html)에 따르면 wrapper는 gradle이 필요하기 전에 미리 선언된 버전의 gradle을 다운로드 받는 스크립트이고, 이를 활용하는 것이 gradle에서 권장하는 사용방식이라고 한다. 이렇게 함으로써 개발자는 직접 gradle을 설치하는 과정없이 빠르게 gradle을 사용할 수 있는 장점이 있다.
따라서 직접 gradle을 설치할 필요 없이 서버의 jdk와 로컬의 gradle jvm의 버전만 일치시킨 뒤, 로컬에서 gradle-wrapper.jar를 git에 add하고 서버에서 pull할 때 같이 받아지게 하면 된다.
아래에 나올 오류들도 결국은 환경의 차이에서 오는 오류였는데, 이렇게 하면 **환경에 종속적이지 않고** 프로젝트에서 gradlew 명령어로 gradle 명령어를 수행할 수 있다.

    
### 원하는 버전의 gradle 설치하기

[gradle의 공식홈페이지](https://gradle.org/install/)를 참고하며 6.7.1버전을 설치했다.

```
wget https://services.gradle.org/distributions/gradle-[버전]-bin.zip
```

![](https://velog.velcdn.com/images/shawnhansh/post/55e14a5f-5085-491e-8c0d-ef20703a50ac/image.png)

나는 6.7.1 버전을 설치했으므로 [버전]에 6.7.1을 입력하고 다운받았다.

```
mkdir /opt/gradle
unzip -d /opt/gradle gradle-7.4.2-bin.zip
```
/opt/gradle 경로에 다운받은 zip 파일을 풀어준다.

이제 환경변수를 설정해주어야 한다.

```
vim ~/.bashrc
export GRADLE_HOME=/opt/gradle/gradle-[버전]
export PATH=${GRADLE_HOME}/bin:${PATH}
```

![](https://velog.velcdn.com/images/shawnhansh/post/463bc1d0-d55d-4e76-877b-a483ec17e735/image.png)

bashrc를 vim 에디터로 오픈한 뒤 위와 같이 환경변수를 셋팅해준다.

```
source ~/.bashrc
gradle -v
```

![](https://velog.velcdn.com/images/shawnhansh/post/22bfc500-4791-45b0-8330-c512e344c60f/image.png)

수정한 bashrc를 source 명령어로 적용시켜준 뒤 gradle의 버전확인 명령어를 수행하여 제대로 설치 되었는지 확인한다.

## Could not determine java version from

![](https://velog.velcdn.com/images/shawnhansh/post/ede71037-e2ea-4071-ae70-86ec75025813/image.png)

- 오류 시점 : ./gradlew test를 수행하는 시점
- 원인 : gradle wrapper의 버전이 해당 java 버전을 지원하지 않음.
- 해결 방법 : java 버전을 내리거나 gradle wrapper의 버전을 올려서 호환성을 맞춰주어야 함.

```
gradlew wrapper --gradle-version [버전]
```

위 명령어로 gradle wrapper의 버전을 변경할 수 있다.
    
## Could not target platform : using tool chain :

![](https://velog.velcdn.com/images/shawnhansh/post/87b22bb6-bdba-4045-86f5-bc8524f52318/image.png)

- 오류 시점 : ./gradlew test를 수행하는 시점
- 원인 : gradle-wrapper.jar이 생성된 jdk 버전과 실행하는 jdk 버전이 다름.
- 해결 방법 : gradle-wrapper.jar을 생성할 때 gradle의 jvm 버전과 이를 수행하는 환경의 jdk 버전을 통일.

여러 버전의 jdk를 사용할 경우 자주 나타나는 오류이다.
나도 AWS Ubuntu에서는 jdk 11버전을 사용하고 로컬에서 이 프로젝트를 1.8로 개발했기 때문에 이 문제가 발생했다.

이 오류를 해결하기 위해 정말 많은 방법을 시도했다.
기존의 프로젝트와 jdk의 버전을 맞추기 위해 update-alternatives도 사용하여 jdk의 버전을 1.8로 내려서 시도해보기도 하고, build.gradle의 sourceCompatibility를 11로 변경하고 targetCompatibility도 11로 추가하여 시도해보기도 했다.

하지만 결국 정답은 gradle-wrapper.jar를 만드는 순간 gradle의 jvm의 버전이었다.
```
alternatives-update --config java
```

명령어로 java의 버전을 바꿔가며 테스트를 해보았는데, 환경 변수의 JAVA_HOME은 수정하지 않아 결국 gradle의 jvm은 바뀌지 않은 java 버전을 참조하였고, gradlew를 수행할 때와는 어떻게 꼬였는지 jdk 버전이 맞지 않았던 것 같다.

## 더 확실하게 테스트 해보기

![](https://velog.velcdn.com/images/shawnhansh/post/5f5aeebd-ab91-4368-9eae-dc6246980d69/image.png)

위 캡처를 확인해보면 기존 java와 java compiler의 버전, JAVA_HOME 모두 1.8인 상태이다.

여기서 update-alternatives 명령어로 java와 java compiler의 버전을 11 버전으로 변경했지만, 여전히 JAVA_HOME은 1.8인 상태이다.

수정된 bashrc를 적용하니 비로소 JAVA_HOME의 값도 jdk 11로 변경되었다.

> ![](https://velog.velcdn.com/images/shawnhansh/post/eecbc041-1741-4d21-b45a-ee3e63b078ab/image.png)
```
export JAVA_HOME=$(dirname $(dirname $(readlink -f $(which java))))
```
나는 JAVA_HOME의 명령어를 위와 같이 설정해두었기 때문에 source ~/.bashrc만으로 비교적 쉽게 JAVA_HOME의 값을 변경할 수 있었다.

![](https://velog.velcdn.com/images/shawnhansh/post/f2d162eb-9735-4ac7-9b47-04b3e231f8b4/image.png)

![](https://velog.velcdn.com/images/shawnhansh/post/6b4b7326-6684-407c-91b4-cffaf5c300d0/image.png)

build.gradle의 sourceCompatibility를 11로 설정하고 확실히 모든 셋팅을 jdk 11로 변경한 뒤에 gradle-wrapper.jar를 생성했고 테스트를 수행한 결과 정상적으로 테스트가 완료 되는 것을 확인했다.

![](https://velog.velcdn.com/images/shawnhansh/post/e7eae45e-87c0-47b3-9c9a-bb029725a0f5/image.png)

![](https://velog.velcdn.com/images/shawnhansh/post/7a36f6dd-2788-47f9-bc83-5c75c421f6fb/image.png)

더욱 확실한 테스트를 위해 이번에는 sourceCompatibility를 1.8, 환경을 jdk 1.8로 변경한 뒤 똑같이 테스트를 해보았고, 결과는 역시 성공이었다.

![](https://velog.velcdn.com/images/shawnhansh/post/9a6c5ed3-5d93-4159-8aa6-1acc0a0ab725/image.png)

---

낯설었던 gradle과 다양한 오류를 겪으며 조금은 친해진 느낌이다.
여러 자료를 찾아봤지만 기술 자체가 낯설다보니 다른 분들의 자료를 이해하기 어려웠고, 결국 혼자서 삽질(?)을 통해 긴시간 문제를 해결하고 나서야 여러 자료들에서 하던 말이 무슨 말이었는지 이해 되었다.

며칠동안 수 없이 검색하고 여러 자료들을 보며 지나간 덕에 참고 자료를 특정할 수 없지만, gradle에 관해 포스팅을 해주셨던 많은 분들 모두에게 감사의 인사를 드립니다!