지금까지는 스프링부트 프로젝트를 연습하며 로컬에서만 구동시켰지만, 이제 스프링부트 프로젝트를 EC2를 통해서 배포를 해보려고 합니다.

로컬에서는 H2 DB를 사용했지만 실제 배포를 가정하면 RDB를 붙여주어야하기 때문에, 지난 번에 생성했던 AWS RDS를 붙일 생각입니다.
그러기 위해서는 DB 정보를 담은 application-real-db.properties, DB 정보를 포함하는 application-real.properties가 필요하니 생성해보겠습니다.
경로는 여타 .properties 파일들과 마찬가지로 resources에 생성하겠습니다.

## application-real.properties

보안/로그상 이슈가 될 설정들을 제거하여 실제 운영될 환경의 profile을 추가합니다.

```
<SpringBoot 2.1.X 버전>

spring.profiles.include=oauth,real-db
spring.jpa.properties.hibernate.dialect=org.hibernate.dialect.MySQL8Dialect
spring.session.store-type=jdbc
```

```
<SpringBoot 2.4.X 버전>

spring.jpa.properties.hibernate.dialect=org.hibernate.dialect.MySQL8Dialect
spring.session.store-type=jdbc
```

### spring.profiles.include = oauth,real-db
- 2.1.X 버전에서는 위와 같은 방식으로 다른 profile로 추가하였는데, 2.4.X 버전 부터는 이 옵션의 변화가 생겨 이 profile에서 application-real-db.profiles를 추가하지 않습니다.
- 스프링부트 2.4.X부터는 application.properties에 _spring.profiles.group.<group>=profile1,profile2_와 같은 형태로 profile group을 만들어서 profile을 관리합니다.
- 따라서 2.4.X 버전을 사용하는 경우는 application.properties에 다음 내용을 추가해주어야 합니다. _spring.profiles.group.real=real,real-db,oauth_ 
- 즉, _-Dspring.profiles.active=real_로 실행하면 real group에 지정된 real, real-db, oauth가 적용된다는 의미입니다.


### spring.jpa.properties.hibernate.dialect=org.hibernate.dialect.MySQL8Dialect
- 이 옵션은 jpa를 사용함에 있어 DB에 맞는 쿼리문을 작성해주기 위한 옵션입니다.
- 저는 mySql 8버전을 쓰고 있기 때문에 이와 맞는 값인 org.hibernate.dialect.MySQL8Dialect를 설정했습니다.
- 혹시 다른 DB나 mySql의 다른 버전을 쓰고 계시다면 해당 버전에 맞는 dialect로 설정하셔야 합니다.
- 다른 분께서 dialect에 대해 자세하게 작성해주신 [포스팅](https://2dongdong.tistory.com/66)을 참고하시면 좋을 것 같습니다.

### spring.session.store-type=jdbc
- 세션을 세션 스토리지가 아닌 DB로 사용하기 위한 옵션입니다.
- 희망하지 않으시는 분은 아예 작성안하시면 됩니다.

## application-real-db.properties

해당 .properties는 DB에 대한 정보가 들어있으므로 git에는 올리지 않고 서버에만 생성하면 됩니다.

```
<SpringBoot 2.1.X 버전>

spring.jpa.hibernate.ddl-auto=none

spring.datasource.url=jdbc:mysql://DB주소:포트(기본은 3306)/database명
spring.datasource.username=db계정
spring.datasource.password=db계정 비밀번호
spring.datasource.driver-class-name=com.mysql.cj.jdbc.Driver
```

```
<SpringBoot 2.4.X 버전>
spring.jpa.hibernate.ddl-auto=none
spring.jpa.show_sql=true

spring.datasource.hikari.jdbc-url=jdbc:mysql://DB주소:포트(기본은 3306)/database명ㅍ
spring.datasource.hikari.username=db계정
spring.datasource.hikari.password=db계정 비밀번호
spring.datasource.hikari.driver-class-name=com.mysql.cj.jdbc.Driver
```
### spring.jpa.hibernate.ddl-auto=none
- JPA로 DDL(Data Definition Language)을 사용하지 않겠다는 옵션입니다.
- DDL은 Create, Drop, Alter, Truncate 등 테이블 구조에 변화를 줄 수 있기 때문에 옵션을 추가하여 이를 사전에 방지합니다.

### spring.jpa.show_sql=true
- 로컬에서 개발 시 H2에도 적용했던 SQL 로그를 보여주는 옵션입니다.
- 저는 편의상 서버에도 적용했지만 로그가 길어지는게 싫거나 여타 이유로 불필요하신 분들은 값을 false로 변경하시면 됩니다.

---
참고
  - [이동욱님](https://jojoldu.tistory.com/) 저서 '[스프링 부트와 AWS로 혼자 구현하는 웹 서비스](http://www.kyobobook.co.kr/product/detailViewKor.laf?ejkGb=KOR&mallGb=KOR&barcode=9788965402602)'
  - https://jojoldu.tistory.com/539?category=717427
  - https://2dongdong.tistory.com/66
  
  