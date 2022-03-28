![](https://images.velog.io/images/shawnhansh/post/f9bfd3d9-3d30-44df-a303-fb70762c2817/image.png)

이 로그는 단지 어플리케이션을 한번 실행시키고 메인 페이지가 로딩되는데 쏟아져 나온 로그다.

학원에서 수업들으며 만들었던 로그 설정파일을 그대로 사용했었는데 버전업이 되면서 내용이 조금 바뀌었는지 언제부턴가 로그가 수천 줄 씩 쏟아져나왔다.
가끔 AWS에 들어가서 혹시 누군가 내 서버에서 이상한 짓을 하지는 않는지 체크를 해보려고해도 어마어마한 로그 양 때문에 엄두가 나지 않았다.

그래서 이 기회에 다시 한번 log4j2 설정에 대해 공부해보고 간략하게 줄이기로 결정했다.

## log4j2 설정파일의 종류
log4j2 공식문서에 따르면 설정파일은 다음과 같이 구성할 수 있다고 한다.
![](https://images.velog.io/images/shawnhansh/post/3f1b27f5-fcd6-42ee-ab0e-5306e90f8833/image.png)

1. xml, JSON, YAML 혹은 properties 형식으로 configuration 파일 작성하기
2. 프로그래밍으로 ConfigurationFactory와 Configuration 구현체 만들기
3. 프로그래밍으로 Configuration 인터페이스의 API를 호출하여 기본 설정에 컴포넌트로 추가하기
4. 프로그래밍으로 내부 Logger 클래스의 메서드를 호출하기

기존 프로젝트는 XML 형식으로 되어있었기 때문에, 나는 이 xml 파일을 수정하는 방식으로 선택했다.


## log4j2 설정파일 구성
```
<?xml version="1.0" encoding="UTF-8"?>

<Configuration status="INFO">
    <Properties>
        <Property name="LOG_PATTERN">%d{HH:mm:ss.SSS} [%p] --- [%10.50t] %-1.50c{1.}.%-1.20M:%L: %m%n%ex</Property>
    </Properties>

    <Appenders>
        <Console name="Console_Appender" target="SYSTEM_OUT">
            <PatternLayout pattern="${LOG_PATTERN}"/>
        </Console>
    </Appenders>

    <Loggers>
        <Root level="INFO" additivity="false">
            <AppenderRef ref="Console_Appender"/>
        </Root>

        <Logger name="org.springframework" level="ERROR" additivity="false">
            <AppenderRef ref="Console_Appender" />
        </Logger>

        <Logger name="com.filmsus.myapp" level="INFO" additivity="false">
            <AppenderRef ref="Console_Appender" />
        </Logger>

        <logger name="log4jdbc.log4j2" level="ERROR" additivity="false">
            <MarkerFilter marker="LOG4JDBC_OTHER" onMatch="DENY" onMismatch="NEUTRAL"/>
            <appender-ref ref="Console_Appender"/>
        </logger>
    </Loggers>

</Configuration>
```

이미 개발이 끝난 상태에서 로그의 양이 많은 것이 불만이었기 때문에 최소한의 로그만 확인 할 수 있도록 설정을 변경했다.
이 내용을 바탕으로 log4j2.xml의 구조에 대해 설명할 예정이다.

### Configuration

로그 설정의 최상위 요소이다.
내부에 Properties, Appenders, Loggers 요소를 자식으로 가진다.
status 속성은 log4j2 내부 이벤트에 대한 로그 레벨을 설정한다.
나의 애플리케이션 실행과 관련된 로그에는 영향을 끼치지 않는다.

### Properties

설정 파일 내부에서 사용할 변수라고 생각하면 쉽다.
name 속성의 값을 설정 파일 내부에서 key로 사용하여 해당 태그의 내용을 쉽게 재사용 할 수 있다.

### Appenders

로그를 어디로 보낼지, 어떻게 처리할지 정의하는 곳이다.
이곳에서 사용할 수 있는 속성은 상당히 많다.
보통은 **콘솔 확인을 위한 ConsoleAppender**와 **파일 저장을 위한 RollingFileAppender**를 많이 사용한다.
더 많은 속성은 [log4j2 공식문서의 Appenders](https://logging.apache.org/log4j/2.x/manual/appenders.html)에서 확인할 수 있다.

#### ConsoleAppender
  ```     
<Console name="Console_Appender" target="SYSTEM_OUT">
	<PatternLayout pattern="${LOG_PATTERN}"/>
</Console>
```
Console은 이름대로 콘솔에 로그를 찍어주는 Appender이다.
target 속성의 기본 값은 SYSTEM_OUT이고, SYSTEM_ERR로 바꿀 수도 있다.
자식 요소로 PatternLayout이 있는데, pattern 속성의 값 형태로 로그를 생성한다.
아래에서 설명할 logger에서 name 속성의 값으로 이 appender를 선택한다.

아까전에 Properties에서 만들었던 로그 패턴이 여기에서 사용된다.

#### Layout
레이아웃의 종류가 무수히 많지만, 여기서는 간단한 패턴 레이아웃만 알아보도록 한다.

- %c, %logger : 해당 로그를 쓰는 로거의 이름.
- %C, %class : 해당 로그를 요청한 클래스 이름
- %d, %date : 해당 로그가 발생한 시간
- %enc, %encode : 특정 언어에서의 출력을 위한 문자 인코딩
- %ex, %exception, %throwable : 예외 로그. 길이를 설정할 수 있음.
- %F, %file : 해당 로그가 발생한 클래스 파일명
- %l, %location : 해당 로그가 발생한 클래스명.메소드명(파일:라인)
- %L, %line : 해당 로그가 발생한 라인 번호
- %m, %msg, %message : 로그문에 전달된 메시지
- %n : 줄바꿈
- %p, %level : 로그 레벨
- %r, %relative : 로그 처리시간
- %t, %thread : 해당 로그가 발생한 스레드명
- %style{pattern}{ANSI style} : ANSI를 사용해 특정 패턴을 스타일링함
- %highlight{pattern}{style} : 로그 레벨명을 ANSI 색깔로 하이라이트

공식문서의 [Layout](https://logging.apache.org/log4j/2.x/manual/layouts.html) 부분과, [PatternLayout](https://logging.apache.org/log4j/2.x/manual/layouts.html#PatternLayout) 부분을 참고하면 해당 부분에 대해 더욱 자세히 알 수 있다.

### Loggers

로그를 찍을 곳과 그 내용을 정의하는 곳이다.
자식요소로 Root와 Logger가 있고, 이들의 속성으로는 대표적으로 name과 level이 있다.
name 속성의 값으로는 로깅을 희망하는 패키지를 입력하고, level에는 원하는 로깅 레벨을 입력한다.

#### Root
```
<Root level="INFO" additivity="false">
	<AppenderRef ref="Console_Appender"/>
</Root>
```
모든 Logger의 조상 logger라고 보면 된다.
추가적으로 Logger 태그에서 정의되지 않은 이벤트들은 모두 Root 설정에 따라 로그를 찍는다.

자식 요소인 AppenderRef의 ref속성으로 사용할 appender를 선택한다.
두개 이상의 appender를 사용할 때는 새로운 AppenderRef 태그를 생성하고 속성 값을 변경해주면 된다.
additivity 속성은 중복된 로그를 남길지에 대한 속성이다.
다른 logger들과 같은 로그가 중복 될 시 중복 로그를 표현하고 싶지 않다면 false로 값을 주면 된다.


#### Logger
```
<Logger name="org.springframework" level="ERROR" additivity="false">
	<AppenderRef ref="Console_Appender" />
</Logger>
```
Logger는 Root와 레벨이 다르거나 다른 appender를 사용하는 등 다른 설정이 필요한 경우 추가적을 선언해준다.
해당 logger는 스프링프레임워크에서 발생하는 이벤트에 대한 로그를 ERROR 레벨 이상에 대해 Console Appender에 로그를 찍겠다는 내용이다.

Log4j2의 설정 내용은 상당히 방대하다.
모든 내용을 알고 적용하는 것 보다 필요한 부분만 공식문서와 블로그를 찾아가며 적용하는 편이 빠를 것 같다.

---
참고
https://logging.apache.org/
https://velog.io/@bread_dd/Log4j-2-%EC%A0%9C%EB%8C%80%EB%A1%9C-%EC%82%AC%EC%9A%A9%ED%95%98%EA%B8%B0-%EA%B0%9C%EB%85%90
https://myhappyman.tistory.com/243