스프링 부트로 새로운 프로젝트를 시작하며 로깅을 설정해야 했습니다.

이전에는 스프링 레거시에서 log4j2를 사용하며 log4j2.xml 파일에서 로그를 설정했는데,
**이번에는 스프링부트의 starter-web 의존성에 포함되어있는 logback을 먼저 사용**해보고
logback에서 불편함이나 부족함을 느끼면 그때 다른 로깅 프레임워크로 교체하기로 했습니다.

logback 설정 역시 디테일한 구현을 위해서는 log4j2처럼 xml을 통해 설정해야 하지만 스프링에서 기본적으로 제공하는 logback 설정을 include하여 편하게 설정할 수 있습니다.

며칠간 공식문서 및 여러 레퍼런스를 찾아보고 테스트를 해보았지만 저는 크게 건드리지 않고 기본적인 설정으로 쓰는게 가장 잘 맞았습니다⛄️

이 포스팅은 저처럼 간단한 로그를 남기고 싶은 분들을 위한, 그리고 추후에 제가 logback 설정에 대한 개념을 다시 확인하기 위해 남기는 포스팅입니다!

## base.xml

스프링 부트에서 logback에 대한 설정을 하지 않더라도 로그가 찍히는걸 경험해 보신 적이 있으실 거에요.
그 이유는 바로 스프링부트가 이전버전과 호환을 위해 base.xml을 계속 제공하고 있기 때문입니다.

base.xml은 아래와 같은 형태입니다.

```
<?xml version="1.0" encoding="UTF-8"?>

<!--
Base logback configuration provided for compatibility with Spring Boot 1.1
-->

<included>
	<include resource="org/springframework/boot/logging/logback/defaults.xml" />
	<property name="LOG_FILE" value="${LOG_FILE:-${LOG_PATH:-${LOG_TEMP:-${java.io.tmpdir:-/tmp}}}/spring.log}"/>
	<include resource="org/springframework/boot/logging/logback/console-appender.xml" />
	<include resource="org/springframework/boot/logging/logback/file-appender.xml" />
	<root level="INFO">
		<appender-ref ref="CONSOLE" />
		<appender-ref ref="FILE" />
	</root>
</included>
```

간략한 형태로 이루어져있습니다.
defaults.xml, console-appender.xml, file-appender.xml이 include 되어있고,
LOG_FILE 이라는 변수에 이상한 값을 할당하고 있습니다.
include를 마친 뒤에는 INFO레벨의 로그를 CONSOLE과 FILE이라는 이름의 appender로 출력하고 있습니다.

내부의 구성요소들을 하나하나 살펴보겠습니다.


## defaults.xml
```
<?xml version="1.0" encoding="UTF-8"?>

<!--
Default logback configuration provided for import
-->

<included>
	<conversionRule conversionWord="clr" converterClass="org.springframework.boot.logging.logback.ColorConverter" />
	<conversionRule conversionWord="wex" converterClass="org.springframework.boot.logging.logback.WhitespaceThrowableProxyConverter" />
	<conversionRule conversionWord="wEx" converterClass="org.springframework.boot.logging.logback.ExtendedWhitespaceThrowableProxyConverter" />

	<property name="CONSOLE_LOG_PATTERN" value="${CONSOLE_LOG_PATTERN:-%clr(%d{${LOG_DATEFORMAT_PATTERN:-yyyy-MM-dd'T'HH:mm:ss.SSSXXX}}){faint} %clr(${LOG_LEVEL_PATTERN:-%5p}) %clr(${PID:- }){magenta} %clr(---){faint} %clr([%15.15t]){faint} %clr(%-40.40logger{39}){cyan} %clr(:){faint} %m%n${LOG_EXCEPTION_CONVERSION_WORD:-%wEx}}"/>
	<property name="CONSOLE_LOG_CHARSET" value="${CONSOLE_LOG_CHARSET:-${file.encoding:-UTF-8}}"/>
	<property name="FILE_LOG_PATTERN" value="${FILE_LOG_PATTERN:-%d{${LOG_DATEFORMAT_PATTERN:-yyyy-MM-dd'T'HH:mm:ss.SSSXXX}} ${LOG_LEVEL_PATTERN:-%5p} ${PID:- } --- [%t] %-40.40logger{39} : %m%n${LOG_EXCEPTION_CONVERSION_WORD:-%wEx}}"/>
	<property name="FILE_LOG_CHARSET" value="${FILE_LOG_CHARSET:-${file.encoding:-UTF-8}}"/>

	<logger name="org.apache.catalina.startup.DigesterFactory" level="ERROR"/>
	<logger name="org.apache.catalina.util.LifecycleBase" level="ERROR"/>
	<logger name="org.apache.coyote.http11.Http11NioProtocol" level="WARN"/>
	<logger name="org.apache.sshd.common.util.SecurityUtils" level="WARN"/>
	<logger name="org.apache.tomcat.util.net.NioSelectorPool" level="WARN"/>
	<logger name="org.eclipse.jetty.util.component.AbstractLifeCycle" level="ERROR"/>
	<logger name="org.hibernate.validator.internal.util.Version" level="WARN"/>
	<logger name="org.springframework.boot.actuate.endpoint.jmx" level="WARN"/>
</included>
```
- ConversionRule과 함께 콘솔 로그와 파일 로그 각각의 패턴과 문자집합을 변수에 할당하는 것을 확인할 수 있습니다.
- 여러 기본적인 클래스들에 대한 로그 레벨이 설정되어 있습니다.


### LOG_FILE
**A:-B**는 A가 없으면 B라는 의미입니다.
LOG_FILE이라는 변수가 외부에 정의되어 있으면 그 값을, 없다면 LOG_PATH를, 이것마저 없으면 LOG_TEMP의 값을.. 이렇게 뒤로 따라 들어가며 최종적으로 "LOG_FILE"이라는 변수에 할당한다는 내용입니다.


### console-appender.xml
```
<?xml version="1.0" encoding="UTF-8"?>

<!--
Console appender logback configuration provided for import, equivalent to the programmatic
initialization performed by Boot
-->

<included>
	<appender name="CONSOLE" class="ch.qos.logback.core.ConsoleAppender">
		<encoder>
			<pattern>${CONSOLE_LOG_PATTERN}</pattern>
			<charset>${CONSOLE_LOG_CHARSET}</charset>
		</encoder>
	</appender>
</included>
```
- CONSOLE이라는 이름의 ConsoleAppender를 생성합니다.
- 로그 패턴과 문자집합에는 defaults.xml에서 선언한 property 변수가 그대로 사용되었습니다.


### file-appender.xml
```
<?xml version="1.0" encoding="UTF-8"?>

<!--
File appender logback configuration provided for import, equivalent to the programmatic
initialization performed by Boot
-->

<included>
	<appender name="FILE" class="ch.qos.logback.core.rolling.RollingFileAppender">
		<encoder>
			<pattern>${FILE_LOG_PATTERN}</pattern>
			<charset>${FILE_LOG_CHARSET}</charset>
		</encoder>
		<file>${LOG_FILE}</file>
		<rollingPolicy class="ch.qos.logback.core.rolling.SizeAndTimeBasedRollingPolicy">
			<fileNamePattern>${LOGBACK_ROLLINGPOLICY_FILE_NAME_PATTERN:-${LOG_FILE}.%d{yyyy-MM-dd}.%i.gz}</fileNamePattern>
			<cleanHistoryOnStart>${LOGBACK_ROLLINGPOLICY_CLEAN_HISTORY_ON_START:-false}</cleanHistoryOnStart>
			<maxFileSize>${LOGBACK_ROLLINGPOLICY_MAX_FILE_SIZE:-10MB}</maxFileSize>
			<totalSizeCap>${LOGBACK_ROLLINGPOLICY_TOTAL_SIZE_CAP:-0}</totalSizeCap>
			<maxHistory>${LOGBACK_ROLLINGPOLICY_MAX_HISTORY:-7}</maxHistory>
		</rollingPolicy>
	</appender>
</included>
```
- FILE이라는 이름의 RollingFileAppender를 생성합니다.
- 로그 패턴과 문자집합에는 defaults.xml에서 선언한 property 변수가 그대로 사용되었습니다.

#### SizeAndTimeBasedRollingPolicy
- 시간과 용량을 기준으로 로그 파일을 생성하는 SizeAndTimeBasedRollingPolicy가 적용되었습니다.
- **fileNamePattern은** 생성되는 로그파일의 이름 패턴을 설정합니다.
	'LOGBACK_ROLLINGPOLICY_FILE_NAME_PATTERN' 변수의 값이 적용되며, 없을 경우 	**${LOG_FILE}.2022-06-02.0.gz**의 형식으로 매일 생성됩니다.
	만약 기준 용량이 넘어간다면 **${LOG_FILE}.2022-06-02.0.gz**, **${LOG_FILE}.2022-06-02.1.gz**와 같이 .gz 앞의 %i 0부터 1씩 증가하며 로그파일을 생성합니다.
	패턴 설정 방법은 아래를 참고해주세요.
    ![](https://velog.velcdn.com/images/shawnhansh/post/9563c509-487a-4ea5-851d-ea7b16f44d88/image.png)
- **cleanHistoryOnStart는** true일 경우 어플리케이션을 시작할 때 기존 아카이빙된 로그 파일들을 삭제합니다.
 'LOGBACK_ROLLINGPOLICY_CLEAN_HISTORY_ON_START' 변수의 값이 적용되며, 없을 경우 false가 기본값으로 적용됩니다.
- **maxFileSize는** 한 로그 파일의 최대 크기를 설정합니다.
	'LOGBACK_ROLLINGPOLICY_MAX_FILE_SIZE' 변수의 값이 적용되며, 없을 경우 10MB가 기본값으로 적용됩니다.
- **totalSizeCap**은 아카이빙한 로그 파일의 최대 사이즈를 설정합니다.
	'LOGBACK_ROLLINGPOLICY_TOTAL_SIZE_CAP' 변수의 값이 적용되며, 없을 경우 0이 기본값으로 적용됩니다. 기본값인 0일 때는 최대 용량을 설정하지 않는다는 의미이고, 100MB등 용량을 명시할 경우 아카이빙 된 로그 파일 용량의 합이 해당 용량을 초과할 때 오래된 로그부터 삭제합니다.
    totalSizeCap은 항상 maxHistory가 먼저 적용된 뒤에 적용됩니다.
- **maxHistory**는 아카이빙하는 로그파일의 최대 보관 기간 단위를 설정합니다.
	'LOGBACK_ROLLINGPOLICY_MAX_HISTORY' 변수의 값이 적용되며, 없을 경우 7이 기본적으로 적용됩니다.
    maxHistory가 기본값인 7일 경우 fileNamePattern에서 정한 rollover 단위가 일이라면 7일 전까지의 로그가 보관됩니다.
    totalSizeCap과 마찬가지로 0일 경우에는 최대 보관 기관 단위를 설정하지 않습니다.
- 다양한 시스템 환경변수들이 사용되었는데 이 정체는 잠시 후에 공개됩니다!


## logback-spring.xml

원래 logback은 logback.xml이라는 xml 파일을 통해 설정이 필요합니다. 어플리케이션이 구동될 때 classpath 내에서 logback.xml을 찾아 logback을 초기화 시킵니다.

스프링부트에서는 logback-spring.xml을 통해 설정을 하면 application.properties에서 설정한 값을 스프링의 환경변수를 시스템 환경변수로서 사용할 수 있고, 프로필에 따라 로그 설정할 수 있습니다.
_이를 "Spring Boot Logback Extension"라고 합니다._
![](https://velog.velcdn.com/images/shawnhansh/post/a4e56c34-c639-41c7-9616-fba977eb67ad/image.png)

![](https://velog.velcdn.com/images/shawnhansh/post/02f48ed0-ca25-40d6-b6bf-d85f5e85e4d9/image.png)

application.properties에 Spring Environment가 명시된다면 logback-spring.xml에서 시스템환경변수(System Property) 이름으로 사용 가능합니다.
스프링부트에서 제공하는 xml 설정파일에서 등장했던 다양한 시스템 환경변수들은 위 규칙에 맞게application.properties에 명시된 값들을 불러와 설정하게 되는거죠!

```
<?xml version="1.0" encoding="UTF-8"?>
<configuration scan="true" scanPeriod="60 seconds">
    <include resource="org/springframework/boot/logging/logback/defaults.xml"/>
    <include resource="org/springframework/boot/logging/logback/console-appender.xml" />
    <include resource="org/springframework/boot/logging/logback/file-appender.xml"/>

    <springProfile name="local">
        <root level="DEBUG">
            <appender-ref ref="CONSOLE" />
        </root>
    </springProfile>

    <springProfile name="dev">
        <root level="INFO">
            <appender-ref ref="FILE" />
        </root>
    </springProfile>

</configuration>
```

위 코드는 제가 작성한 logback-spring.xml입니다.

base.xml과 유사한 형태이지만 LOG_FILE 변수를 생성하지 않았고, 프로필 별로 appender를 다르게 설정했습니다.

스프링부트 logback 설정을 찾다보면 ConsoleAppender와 RollingFileAppender를 하나하나 직접 설정하는 xml 레퍼런스가 많이 보입니다.
물론 직접 구현하는 것이 근본이지만 위에서 언급한 console-appender.xml과 file-appender.xml에서 필요한 항목이 빠져있는게 아니라면 스프링부트에서 제공하는 두 xml을 include하여 사용하는 편이 훨씬 간편하고 쉽다고 생각합니다.


## application.properties

```
logging.file.name=../logs/withMe_dev.log
logging.logback.rollingpolicy.max-history=31
```

처음에 언급했듯 저는 아직까지 기본설정에서 크게 건드릴 것이 없다고 느꼈기 때문에 application.properties에서 역시 많은 설정을 추가하지 않았습니다.
file-appender.xml에서 파일명 설정을 위한 logging.file.name(LOG_FILE)과 최대 보관 기간 단위 설정을 위한 logging.logback.rollingpolicy.max-history(LOGBACK_ROLLINGPOLICY_MAX_HISTORY) 이렇게 두가지만 설정했습니다.


## 마치며

제가 공식문서에서 본건 이미 완성되어있는 설정을 include하여 사용하는 방식이었는데, 검색해서 나오는 대부분의 레퍼런스는 구현체를 직접 구현하는 xml이었습니다.
저는 공식문서의 방법대로 설정을 마친 뒤 추가적으로 필요한 부분을 커스터마이징 하고 싶었는데, 생각보다 공식문서대로 설정한 레퍼런스를 쉽게 찾을 수 없더라구요.

남들은 쉽게하는 설정을 혼자 너무 해메는거 아닌가 싶을 정도로 로깅 설정에 많은 시간을 할애했지만, 이런저런 테스트를 해보며 로깅 설정을 더욱 확실히 알게 된 것 같아 뿌듯합니다!!

이 글을 보시는 모든 분들의 성공적인 로깅 설정을 기원합니다 :)

---
참고
- https://docs.spring.io/spring-boot/docs/2.6.7/reference/html/howto.html#howto.logging
- https://docs.spring.io/spring-boot/docs/2.6.7/reference/html/features.html#features.logging
- https://logback.qos.ch/manual/appenders.html
- https://github.com/spring-projects/spring-boot/tree/main/spring-boot-project/spring-boot/src/main/resources/org/springframework/boot/logging/logback
- https://meetup.toast.com/posts/149