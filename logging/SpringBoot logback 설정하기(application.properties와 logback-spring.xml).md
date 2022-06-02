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
내부의 구성요소들을 하나하나 살펴보겠습니다.


### defaults.xml
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
LOG_FILE이라는 변수가 외부에 정의되어 있으면 그 값을, 없다면 LOG_PATH를, 이것마저 없으면 LOG_TEMP의 값을 "LOG_FILE"이라는 변수에 할당한다는 내용입니다.


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
- 시간과 용량을 기준으로 로그 파일을 생성하는 SizeAndTimeBasedRollingPolicy가 적용되었습니다.
- **fileNamePattern은** 생성되는 로그파일의 이름 패턴을 설정합니다.
'LOGBACK_ROLLINGPOLICY_FILE_NAME_PATTERN' 변수의 값이 적용되며, 없을 경우 **${LOG_FILE}.2022-06-02.0.gz**의 형식으로 매일 생성됩니다.
만약 기준 용량이 넘어간다면 **${LOG_FILE}.2022-06-02.0.gz**, **${LOG_FILE}.2022-06-02.1.gz**와 같이 .gz 앞의 %i 0부터 1씩 증가하며 로그파일을 생성합니다.
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

---
참고
- https://docs.spring.io/spring-boot/docs/2.6.7/reference/html/howto.html#howto.logging
- https://docs.spring.io/spring-boot/docs/2.6.7/reference/html/features.html#features.logging
- https://meetup.toast.com/posts/149
- https://github.com/spring-projects/spring-boot/tree/main/spring-boot-project/spring-boot/src/main/resources/org/springframework/boot/logging/logback