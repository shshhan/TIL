AWS RDS 인스턴스를 생성하고 이를 로컬에서 DBeaver를 활용해 접근까지 해보았다.
RDS를 활용한 프로젝트를 개발단계에서 그치지 않고 AWS EC2 인스턴스를 활용해서 배포까지 하려면 EC2에서도 RDS 인스턴스에 접근할 수 있도록 설정해주어야 한다.

## RDS 보안 그룹 설정해주기

로컬에서 DBeaver로 RDS 인스턴스에 접근할 때를 떠올려보면 RDS의 보안 그룹에 로컬 IP를 인바운드 규칙에 추가했다.
EC2는 또 다른 서버이다보니 EC2에서 접근할 때 역시 RDS 보안 그룹의 인바운드 규칙을 추가해주어야 한다.

EC2를 하나만 사용한다면 해당 인스턴스의 ip만 추가하면 되겠지만, 나중에 여러 인스턴스를 사용한다면 매번 각 인스턴스의 ip를 추가해주어야 하는 불편함이 생긴다.
이럴 때는 RDS 보안 그룹의 인바운드 규칙에 EC2 인스턴스의 보안 그룹 id를 추가하여 보안 그룹을 연동시켜 불편함을 해소할 수 있다. 이렇게 연동 할 경우 해당 보안 그룹이 추가 된 EC2에 대해서는 RDS 보안 그룹의 인바운드 규칙에 추가하지 않아도 접근이 가능하다.

![](https://velog.velcdn.com/images/shawnhansh/post/7dee0e9a-d682-4c4f-9c07-6e7d113028a1/image.png)

1번이 EC2의 보안 그룹이다.
해당 보안 그룹의 ID를 복사한 후 RDS에 적용 중인 보안 그룹의 인바운드 규칙에 추가하면 된다.
인바운드 규칙을 추가하는 방법은 [지난 번 포스팅에](https://velog.io/@shawnhansh/AWS-RDS-DBeaver%EC%97%90-%EC%97%B0%EA%B2%B0%ED%95%98%EA%B8%B0)에 자세하게 설명해두었다.
로컬 환경에서 접근하기 위해 인바운드 규칙을 추가하는 것과 모두 동일하지만 **소스 부분을 '내 IP'대신 '사용자 지정'으로 설정한 뒤 복사해둔 보안 그룹의 ID를 붙여넣기**하면 보안 그룹은 해결 되었다!

## EC2에서 접근 확인하기

터미널을 켜고 EC2 인스턴스에 접근한다.

mySql을 설치하지 않았다면 우선 ubuntu의 패키지 관리 툴인 apt로 mySql을 설치한다.

```
sudo apt install mysql-client-core-8.0
```

설치가 완료되면 이제 본격적으로 RDS 인스턴스에 접근 해본다.

![](https://velog.velcdn.com/images/shawnhansh/post/fbe0a768-9181-4d25-87cf-c4453b14560b/image.png)

- RDS 인스턴스 접속하기
```
mysql -u [유저이름] -p -h [서버호스트]
```

유저이름에는 RDS의 마스터 사용자 이름, 서버호스트에는 RDS의 엔드포인트를 적으면 된다.

- DB 목록 보기
```
show databases;
```
내가 생성한 DB 이름인 mydb가 보인다.

- DB 접속하기
```
connect [DB이름];
```
생성했던 mydb에 접속했다.
패스워드를 입력하라고 요구하는데 RDS를 생성할 때 입력했던 마스터 암호를 입력하면 된다.

로컬에서 DBeaver로 연결했을 때 정상적으로 쿼리가 수행되는지 확인하기 위해 test 테이블을 생성하고 데이터를 집어넣었던 기억이 나서, 그 데이터들을 조회 해보기로 했다.

```
select * from test;
```

위 캡쳐 화면과 같이 정상적으로 쿼리가 수행되며 데이터를 조회할 수 있었다.

이렇게 EC2에서도 RDS 인스턴스에 접근할 수 있도록 설정을 마무리했다!

---
참고
- [이동욱님](https://jojoldu.tistory.com/) 저서 '[스프링 부트와 AWS로 혼자 구현하는 웹 서비스](http://www.kyobobook.co.kr/product/detailViewKor.laf?ejkGb=KOR&mallGb=KOR&barcode=9788965402602)'