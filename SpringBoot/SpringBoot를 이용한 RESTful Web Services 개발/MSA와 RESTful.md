# MSA와 RESTful

## MSA(Micro Service Architecture)

- 기존 하나의 큰 단위로 개발 및 운영되던 애플리케이션을 작은 서비스 단위로 쪼개서 개발 운영 하는 방식
- 전통적인 monolithic 개발 방식을 벗어나 MSA 방식을 도입함으로써 개발 뿐 아니라 유지보수에 있어서도 비용절감과 효율성, 고객의 요구사항을 빠르게 처리할 수 있게 됨.
- 각 서비스들끼리 독립적으로 개발 될 수 있어야하고, 각 서비스에 최적화 되어있는 개발 언어와 데이터베이스를 선택할 수 있어야 함(AKA 폴리글랏)
- 이기종으로 개발된 애플리케이션 간에 데이터 통신을 위해서 표준화된 http 프로토콜을ㅍ 사용하는 RESTful 서비스가 많이 사용되고 있음.

## Web Service

- A service offered by an electronic device to another electronic device, communicating with each other via the World Wide Web
- A server running on a computer device, listening for requests at a particular port over a network, serving web documents(HTML, JSON, XML, images), and creating web applications services, which serve in solving specific domain problems over the Web.

⇒  네트워크 상에서 서로 다른 종류의 컴퓨터들 간에 상호작용하기 위한 소프트웨어 시스템

- 웹 이전에도 코바 등 이기종 간에 통신을 위한 분산 컴퓨팅 기술이 있었으나 구현의 복잡성과 통신 프로토콜이 표준화 되어있지 않아 개발이 어려웠다.
- 웹은 xml 형식을 사용하기 때문에 주고 받는 데이터 포맷의 통일성이 있었고, 기존 분산 프로그래밍 대비 간편했다.

### Web Application

- 서버에 저장되어있고 웹 브라우저를 통해 실행할 수 있는 프로그램
- 클라이언트 요청이 html, css, js, image 등 과 같은 정적 문서일 경우에는 웹 서버에서 처리가 가능하지만, 프로그램 동작이나 계산, 외부 서비스와의 연동 작업의 경우엔 웹 서버에서 웹 애플리케이션으로 전달.
- 요청과 응답에서 데이터를 교환하는 형식은 최근에는 xml보다 문서의 양이 훨씬 적은 json이 많이 사용된다.

## SOAP(Simple Object Access Protocol)

- http, https, smtp 등 프로토콜을 이용해서 xml 기반의 메세지를 네트워크상에서 전달 할 수 있는 시스템
- envelop>Header>Body 구조
- 간단한 정보를 전달하기 위해서도 부가적인 정보로 감싸져있고, 개발하기 어렵고 무겁고 느리다는 단점

## REST(REpresentational State Transfer)

- Resource의 Represntation에 의한 상태 전달
- http Method를 통해 Resource를 처리하기 위한 아키텍쳐
- 파일, 데이터 등 자원을 고유하게 표현하기 위한 네이밍 + 해당 자원의 상태를 표현하기 위한 상태(정보)를 주고 받음

### HTTP Method

- 클라이언트가 서버에 전달하게 되는 목적이나 종류를 알려주는 수단

### Status Code

- 모든 요청은 서버로부터 결과 처리 후 응답 코드와 함께 응답을 받게 된다.
- 200번대 : 정상 처리
- 400번대 : 클라이언트 오류
- 500번대 : 서버 오류

## RESTAPI

- Rest 서비스를 제공하는 API(Application Programming Interface)

## RESTful

- REST API를 제공하는 웹 서비스