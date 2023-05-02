# 의존과 DI

## 의존

- 기능 구현을 위해 다른 구성 요소를 사용하는 것
    - 예 : 객체 생성, 메서드 호출, 데이터 사용
- 의존은 변경이 전파될 가능성을 의미
    - 의존하는 대상이 바뀌면 바뀔 가능성이 높아짐
        - 예 : 호출하는 메서드의 파라미터가 변경
        - 예 : 호출하는 메서드가 발생할 수 있는 Exception 타입이 추가
- 순환 의존 → 변경 연쇄 전파 가능성
    - 클래스, 패키지, 모듈 등 모든 수준에서 순환 의존 없도록
- 의존하는 대상이 적어야 변경 확률이 낮아짐

### 의존하는 대상이 많은 경우 1 : 기능 별로 분리 고려

```java
public class UserService {
	public void regist(RegReq regReq){ ... }
	public void changePw(changeReq changeReq){ ... }
	public void blockUser(String id, String resason){ ... }
}
```

- 각 기능마다 의존하는 대상이 다를 수 있음
- 한 기능 변경이 다른 기능에 영향을 줄 수 있음

기능 별로 분리

```java
public class UserRegistService {
	public void regist(...) {...}
}

public class ChangePwService {
	public void changePw(...) {...}
}

public class UserBlockService {
	public void blockUser(...) {...}
}
```

- 클래스의 수는 늘어나지만 클래스마다 필요한 의존이 줄어듦
- 기능 수정 시 다른 기능 변경 연쇄 전파 가능성 낮아짐
- 개별 기능 테스트가 쉬워짐

### 의존하는 대상이 많은 경우 2: 묶어 보기

- 몇 가지 의존 대상을 단일 기능으로 묶어서 생각해보면 의존 대상을 줄일 수 있음
    
    ![Untitled](https://s3-us-west-2.amazonaws.com/secure.notion-static.com/391c5232-0d5f-45b5-b247-12137e3778b4/Untitled.png)
    
- 의존 대상 객체를 직접 생성하면?
    - 생성 클래스가 바뀔 시 의존하는 코드도 수정 필요
    - 의존 대상 객체를 직접 생성하지 않는 방법
        - OOOFactory, OOOBuilder
        - DI(Dependency Injection, 의존 주입)
        - 서비스 로케이터

- DI(Dependency Injection, 의존 주입)
    - 외부에서 의존 객체를 주입
        - 의존 객체는 주입받도록 코드 작성하는 습관!
        - 생성자나 메서드(setter)를 이용해 주입
            - 초기화 코드에서 주로 진행
    
    ```java
    public class ScheduleService {
    	private UserRepository repository;
    	private Calculator cal;
    
    	public ScheduleService (UserRepository repository) {
    		this.repository = repository;
    	}
    
    	public void setCalculator(Calculator cal) {
    		this.cal = cal;
    	}
    }
    ```
    
    ```java
    //초기화
    UserRepository userRepo = new DbUserRepository();
    Calculator cal = new Calculator();
    
    ScheduleService schSvc = new ScheduleService(userRepo);
    schSvc.setCalculator(cal);
    ```
    
- 조립기(Assembler)
    - 조립기가 객체 생성, 의존 주입을 처리 (ex : 스프링 프레임워크)
    
    ```java
    @Configuration
    public class Config {
    	@Bean
    	public ScheduleService scheduleSvc() {
    		ScheduleService svc = new ScheduleService(repo());
    		svc.setCalculator(expCal());
    		return svc;
    	}
    
    	@Bean
    	public UserRepository repo() { ... }
    	
    	@Bean
    	public Calculator expCal() { ...}
    }
    ```
    
    ```java
    //초기화
    ctx = new AnnotationConfigApplicationContext(Config.class);
    
    //사용할 객체 구함
    ScheduleService svc = ctx.getBean(scheduleService.class);
    
    //사용
    svc.getSchedule(..);
    ```
    

### DI 장점

- 상위 타입 사용 시 의존 대상이 바뀌면 조립기(설정)만 변경하면 됨
    
    ```java
    public class OrderService {
    	private Notifier notifier;
    
    	public OrderService(Notifier notifier) {
    		this.notifier = notifier;
    	}
    
    	public void order(OrderRequest req) {
    		..
    		notifier.notify(..);
    	}
    }
    ```
    
    ```java
    @Configuration
    public class Config {
    	@Bean
    	public Notifier notifier() {	
    		return new EmailNotifier();	
    		// Notifier 바꾸고 싶을 때 reuturn 하는 객체만 변경하면 됨.
    		// 실제 비즈니스를 구현하는 OrderService코드는 수정 X
    		// return new KakaoNotifier(); 
    	}
    	@Bean
    	public OrderService orderService() {
    		return new OrderService(notifier());
    	}
    
    ```
    
- 의존하는 객체 없이 대역 객체를 사용해서 테스트 가능
    
    ```java
    private MemoryUserRepository userRepo = new MemoryUserRepository(); //실제 DB 없이 연동 기능 테스트
    private ScheduleService svc = new ScheduleService();
    
    @BeforeEach
    public void init() {
    	svc.setUserRepository(userRepo);
    }
    
    @Test
    public void givenUser_NoCheckPoint_then_getExpectedSchedule() {
    	userRepo.addUser("1", new User(..));
    	Schedule schedule = svc.getSchedule("1");
    	assertEquals(EXPECTED, schedule.getType());
    }
    ```