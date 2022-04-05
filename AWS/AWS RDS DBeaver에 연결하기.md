![](https://imagedelivery.net/v7-TZByhOiJbNM9RaUdzSA/6b370a92-9d07-4ae1-7adf-6342b0e8fa00/public)

[지난 포스팅](https://velog.io/@shawnhansh/AWS-RDSmySql-%ED%94%84%EB%A6%AC%ED%8B%B0%EC%96%B4-%EC%83%9D%EC%84%B1%ED%95%98%EA%B8%B0)에서 AWS RDS를 활용해서 MySql DB 인스턴스를 생성했다!
이 DB를 이제 남은 프리티어 기간 동안 개발 및 배포에 활용해보며 뽕을 뽑을 예정이기 때문에 익숙한 DB 툴인 DBeaver에 연결하기로 했다.

정상적으로 연결에 성공하려면 아래 설정에 대한 확인이 필요하다.
- 엔드포인트 및 포트
- VPC 보안그룹
- 퍼블릭 엑세스 가능
- 마스터 사용자 이름 및 비밀번호, DB 이름

## 엔드포인트 및 포트

![](https://imagedelivery.net/v7-TZByhOiJbNM9RaUdzSA/c0484d3e-de5d-4aff-12fe-bdd3e50e8400/public)

RDS 데이터베이스 메뉴에서 연결을 희망하는 데이터 베이스를 선택하면 위와 같은 화면이 나타난다.
여기서 엔드포인트 및 포트, VPC 보안 그룹, 퍼블릭 액세스 가능 여부를 확인할 수 있다.

엔드포인트와 포트는 잠시 후 DB 연결시 그 값을 입력해야 하므로 따로 복사해둔다.

## 마스터 사용자 이름 및 비밀번호, DB 이름

![](https://imagedelivery.net/v7-TZByhOiJbNM9RaUdzSA/d93f342b-e0d8-4e98-a9ed-4402c3b03900/public)

구성 탭으로 이동하면 DB 생성시 설정했던 이름과 마스터 사용자 이름을 확인할 수 있다.
이 두가지 항목 역시 엔드포인트, 포트와 마찬가지로 DB 연결시 값이 필요하므로 잘 메모해둔다.
만약 마스터 사용자에 대한 비밀번호가 기억나지 않아도 괜찮다!
재설정이 가능하다. 화면 상단의 수정 버튼을 선택한다.

![](https://imagedelivery.net/v7-TZByhOiJbNM9RaUdzSA/35310838-b516-4e96-f200-939edc244700/public)

수정 화면의 가장 처음부터 새 마스터 암호를 입력하는 항목이 있다.
이 부분에서 새롭게 비밀번호를 설정하고 저장한다.

## 보안그룹 설정하기

![](https://imagedelivery.net/v7-TZByhOiJbNM9RaUdzSA/2545f8c4-4a74-47aa-7d40-7ee42a1d0400/public)

RDS 역시 로컬에서 접근하려면 EC2 때와 마찬가지로 보안그룹에서 접근을 허용해야 한다.
DB 인스턴스 생성 시 기본으로 설정되었던 default 보안 그룹을 선택한다.

![](https://imagedelivery.net/v7-TZByhOiJbNM9RaUdzSA/c1cba658-5c7b-4587-4246-4307f7c46a00/public)

보안 그룹의 인바운드 규칙 탭에서 방금 선택한 보안 그룹을 선택하고 인바운드 규칙 편집 버튼을 선택한다.

![](https://imagedelivery.net/v7-TZByhOiJbNM9RaUdzSA/43e3e612-01b1-4b32-113c-3570ff256700/public)


규칙 추가 버튼을 눌러 새로운 규칙을 추가한다.
유형에서 본인이 생성한 DB를 선택하면 프로토콜과 포트를 알아서 설정해준다.
나는 mySql DB를 생성했으므로 MySql/Aurora를 선택했고 프로토콜과 포트가 알아서 TCP, 3306으로 설정되었다.
지난 번에 EC2를 공격당한 이유로 되도록 내 IP에서만 접근 가능하도록 소스를 설정한다. 번거롭더라도 다른 사람의 접근이 필요하거나, 외부에서 접근이 필요한 경우에 보안 그룹을 수정하는 편이 안전하고 마음도 편하다. 개인의 선호에 따라 모든 포트를 다 열어놓아도 상관없다.
설정이 완료 되었다면 우측 하단 규칙 저장 버튼을 선택한다.

## 퍼블릭 엑세스 설정하기

![](https://imagedelivery.net/v7-TZByhOiJbNM9RaUdzSA/2545f8c4-4a74-47aa-7d40-7ee42a1d0400/public)

나는 생성 할 때부터 퍼블릭 액세스를 가능하도록 설정했다.
혹시나 위 캡쳐와 다르게 퍼블릭 액세스 기능이 '아니요'라고 되어있다면 화면 상단에 수정 버튼을 선택한다.

![](https://imagedelivery.net/v7-TZByhOiJbNM9RaUdzSA/9a7db06b-380b-4597-08ce-0f25a5333100/public)

수정화면 중 "연결"탭의 추가 구성에서 "퍼블릭 액세스 가능"을 선택하고 저장한다.

## DBeaver에 연결하기
이제 모든 준비는 끝났고 DBeaver에 연결만 남았다.

![](https://imagedelivery.net/v7-TZByhOiJbNM9RaUdzSA/4319cf33-beb7-4622-46ea-66ef4b8b0400/public)

DBeaver를 열고 좌측 상단에 콘센트 모양에 +가 붙어있는 아이콘을 선택한다.

![](https://imagedelivery.net/v7-TZByhOiJbNM9RaUdzSA/916f7187-d290-4ca2-05d4-02fdcee0ff00/public)

여기서는 본인이 생성한 DB 인스턴스에 맞는 DB를 선택하고 다음 버튼을 누른다.

![](https://imagedelivery.net/v7-TZByhOiJbNM9RaUdzSA/e19a0ead-66df-4c95-61d6-c0119c317800/public)

이제 위에서 복사해두었던 값들을 꺼낼 차례이다. 각 항목에 맞는 값들을 입력한다.
- Server Host : 엔드포인트
- Port : 포트
- Database : DB 이름
- Username : 마스터 사용자 이름
- Password : 비밀번호

입력이 끝났다면 좌측 하단에 Test Connection... 버튼을 클릭해 접속이 정상적으로 이루어 지는지 테스트한다.

![](https://imagedelivery.net/v7-TZByhOiJbNM9RaUdzSA/2b2a4761-e036-44e6-4cf1-708e90ed4f00/public)

위 처럼 나온다면 테스트 성공!
완료 버튼을 눌러 빠져나온다.

## DB 정보 확인하기

![](https://imagedelivery.net/v7-TZByhOiJbNM9RaUdzSA/87b0453b-c44d-4e82-1e1e-a2a52ac44c00/public)

정상적으로 연결이 잘 된 것 같다..!
설정했던 파라미터가 제대로 적용되었는지, 쿼리는 정사적으로 수행 되는지 확인해보기 위해 상단에 SQL 버튼을 선택해서 스크립트 창을 연다.

### 파라미터 설정 확인하기
```
SHOW variables LIKE "c%";
```
Character와 Collation 파라미터를 확인해보기 위해 위 명령어를 수행한다.

![](https://imagedelivery.net/v7-TZByhOiJbNM9RaUdzSA/908af9fc-6d1e-4226-fe2e-6e16105fd200/public)

설정했던 파라미터의 값들이 모두 설정한대로 제대로 들어가있는 것을 확인한다.

```
SELECT @@time_zone, now();
```
타임존 설정을 확인하기 위해 위 명령어를 수행한다.

![](https://imagedelivery.net/v7-TZByhOiJbNM9RaUdzSA/964343b2-6568-4898-a173-b14d1f9d8c00/public)

타임존 역시 제대로 설정된 것을 확인할 수 있다.

![](https://imagedelivery.net/v7-TZByhOiJbNM9RaUdzSA/0c325800-74ff-43b6-4ec8-065f4afb1c00/public)

### 쿼리 정상 수행 확인하기
```
CREATE TABLE test (
	id 		bigint(20) NOT NULL AUTO_INCREMENT,
	content varchar(255) DEFAULT NULL,
	PRIMARY KEY(id)
) ENGINE=InnoDB;
	
INSERT INTO test(content)
VALUES ("테스트 content");

SELECT *
FROM test;
```
test라는 테이블을 만들고 한글과 영어를 섞은 문자열 데이터를 삽입해보았다.

![](https://imagedelivery.net/v7-TZByhOiJbNM9RaUdzSA/c40b57a4-e562-4ed0-c0bd-ae88a12bcc00/public)

쿼리도 정상적으로 수행되었고, 한글 문자열 역시 깨지지 않고 정상적으로 들어갔다.


---
참고
- [이동욱님](https://jojoldu.tistory.com/) 저서 '[스프링 부트와 AWS로 혼자 구현하는 웹 서비스](http://www.kyobobook.co.kr/product/detailViewKor.laf?ejkGb=KOR&mallGb=KOR&barcode=9788965402602)'
- https://programforlife.tistory.com/29



