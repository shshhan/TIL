# 정리

- 소프트웨어의 가치는 “변화”
    - 바뀌는 세상에서 계속 유형하도록 변해야 한다.
    - 하지만 변경 비용이 높아지면 지속적으로 변경이 어렵고 이는 곧 소프트웨어의 가치가 떨어짐.
    - 따라서 소프트웨어는 적은 비용으로 변할 수 있어야하고 이를 위한 방법 중 하나가 객체지향
- 객체는 제공하는 기능으로 정의
    - ex) 회원 객체 - 암호 변경하기 기능 등
    - 기능이 없이 필드만 있다면 데이터에 가깝다.
    - 메서드를 이용해서 기능 명세
- 캡슐화 : 내부 구현 감춤
    - 내부 구현 변경에 따른 외부 영향 최소화
    - 내부 구현 변경의 유연함
- 추상화 : 여러 구현의 공통점을 상위 타입으로 도출
    
    ![Untitled](https://s3-us-west-2.amazonaws.com/secure.notion-static.com/f4f9fad7-a1ce-43c3-95db-6e767053122a/Untitled.png)
    
- 상속보단 조립
    - 상속의 단점(상위 클래스 변경 어려움, 클래스 증가, 상속 오용)을 조립하는 방식으로 해소
- 기능과 책임 분리
    - 기능을 하위 기능으로 나누고 책임을 분리
    - 한 클래스나 메서드가 커지면 절차 지향 문제가 발생할 수 있음.
    - 분리 방법 : 패턴 적용 / 계산 기능 분리 / 외부 연동 분리 / 조건별 분기 추상화
    - 적절히 책임을 분리할수록 테스트 용이
- 의존과 DI
    - 의존 대상이 바뀌면 나도 바뀔 수 있기 때문에 의존 대상은 적을 수록 좋다
    - 의존 대상을 줄이는 방법 : 클래스 기능 분리 , 의존 대상 합치기
    - DI로 의존 객체 접근
        - 의존 객체 변경이 쉽고 테스트에서 대역 객체 사용 용이

개발자는 코드를 변경해야 하는 사람

변경 비용을 낮추기 위한 노력 필요

# 부록 - DIP

## 고수준 모듈 , 저수준 모듈

- 고수준 모듈
    - 의미 있는 단일 기능을 제공
    - 상위 수준의 정책 구현
- 저수준 모듈
    - 고수준 모듈의 기능을 구현하기 위해 필요한 하위 기능의 실제 구현
    

## 고수준 모듈, 저수준 모듈 예시

- 기능 예 : 수정한 도면 이미지를 NAS에 저장하고 측정 정보를 DB 테이블에 저장하고 수정 의뢰 정보를 DB에 저장하는 기능
- 고수준 - 기능 정책 제공
    - 도면 이미지 저장
    - 측정 정보 저장
    - 도명 수정 의뢰
- 저수준 - 하위 기능 구현 제공
    - NAS에 이미지 저장
    - MEAS_INFO 테이블에 저장
    - BP_MOD_REQ 테이블에 저장

### 고수준이 저수준에 직접 의존할 경우

- 저수준 모듈 변경 → 고수준 모듈에 영향
    
    고수준 정책이 바뀌지 않았으나 저수준 구현 변경으로 코드 변경 발생
    

```java
public class MeasureService {
	public void measure(MeasureReq req) {
		File file = req.getFile();
		nasStorage.save(file); //NAS -> S3로 변경될 경우 수정
		
		jdbcTemplate.update("insert into MEAS_INFO ... ");
		jdbcTemplate.update("insert into BP_MOD_REQ ..."); //DB저장 -> RabitMq로 변경 될 경우 수정
	}

}
```

## DIP - Dependency Inversion Principle

- 의존 역전 원칙
    - 고수준 모듈은 저수준 모듈의 구현에 의존하면 안 됨
    - 저수준 모듈이 고수준 모듈에서 정의한 추상타입에 의존해야 함
    
    ![Untitled](https://s3-us-west-2.amazonaws.com/secure.notion-static.com/a45ac6b0-34b3-4335-9c95-a0863ed5eecd/Untitled.png)
    

### 고수준 입장에서 저수준 모듈을 추상화

- 구현 입장에서 추상화하지 말 것
    
    ![Untitled](https://s3-us-west-2.amazonaws.com/secure.notion-static.com/3c98c32e-02ba-4a01-9930-fdf8e4917d5c/Untitled.png)
    
- 고수준 모듈의 변경을 최소화하면서 저수준 모듈의 변경 유연함을 높임
    
    ![Untitled](https://s3-us-west-2.amazonaws.com/secure.notion-static.com/7d1bcaa5-8106-4566-8b0c-74536ebf9a4f/Untitled.png)
    
- 부단한 추상화 노력 필요
    - 처음부터 바로 좋은 설계가 나오지는 않음
        - 요구사항/업무 이해가 높아지면서 저수준 모듈을 인지하고 상위 수준 관점에서 저수준 모듈에 대한 추상화 시도

## 연습

- 상품 상세 정보와 추천 상품 목록 제공 기능
    - 상품 번호를 이용해서 상품 DB에서 상세 정보를 구함
    - Daara API를 이용해서 추천 상품 5개 구함
    - 추천 상품이 5개 미만이면 같은 분류에 속한 상품 중 최근 한달 판매가 많은 상품을 ERP에서 구해서 5개를 채움
- 고수준
    - 상품 번호로 상품 상세 정보 구함
    - 추천 상품 5개 구함
    - 인기 상품 구함
- 저수준
    - DB에서 상세 정보 구함
    - Daara API에서 상품 5개 구함
    - 같은 분류에 속한 상품에서 최근 한달 판매가 많은 상품 ERP에서 구함

![Untitled](https://s3-us-west-2.amazonaws.com/secure.notion-static.com/fba4f779-9f14-4432-9610-ca6a6ced5790/Untitled.png)