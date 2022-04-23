지난 게시물인 HTTP와 HTTPS의 차이에 이어 면접 때 대답하지 못했던 질문들을 정리해보는 시간 두번째, 이번에는 Checked Exception과 Unchecked Exceptiond이다.

이 둘의 차이점을 알기 전에 일단 Exception이 뭔지 알아야 한다.

## Exception(예외)
Exception은 개발자가 구현한 코드에서 발생한다. 로직에서 발생하기 때문에 Exception을 예측할 수 있고, 개발자가 직접 처리할 수 있다.

Exception과 자주 함께 나오는 개념으로 Error가 있다. Error는 개발자의 코드가 아닌 시스템의 비정상적인 상황에서 발생하기 때문에, 개발자가 이를 예측하기 어렵고 따라서 처리할 수도 없다.

## Exception Class

![](https://velog.velcdn.com/images/shawnhansh/post/c26409a6-1e3b-409a-9580-8efd37b8bd92/image.png)

Exception 클래스는 최상위 클래스인 Object를 상속하는 Throwable 객체의 자식 클래스로서 존재한다.
위에서 언급한 Error 클래스가 Throwable의 또 다른 자식 클래스이다.

이 Exception 클래스에는 또 다시 수 많은 자식 클래스들이 있는데, Exception의 자식 클래스들은 RuntimeException과 그 외 Exception들로 나뉜다.

내가 궁금해했던 CheckedException과 UncheckedExcption이 여기에서 등장한다.
RuntimeException이 아닌 수 많은 Exception들은 CheckedException, RuntimeException을 상속하는 자식 클래스들은 UnCheckedException이라고 부른다.

## CheckedException & UncheckedException

|  | CheckedException | UncheckedException |
| --- | --- | --- |
| 처리여부 | 반드시 예외처리 | 명시적인 예외처리 불필요 |
| 확인시점 | 컴파일 단계 | 실행 단계 |
| 예외 발생 시 Rollback | Rollback 하지 않음 | Rollback 처리 |
| 대표 예외 | IOException, SQLException | NullPointerException, IllegalArgumentException |

CheckedException과 UncheckedException의 가장 명확한 구분 기준은 **Exception 처리 여부**이다.
CheckedException 발생이 예측된다면 해당 로직을 try-catch 혹은 throw하여 예외처리를 반드시 해주어야한다.
하지만 UncheckedException은 명시적인 예외처리가 불필요하다.

두 Exception은 Exception을 확인하는 시점에서도 차이가 난다.
CheckedException의 경우 소스를 컴파일하는 단계에서 해당 Exception이 발생 할 수 있는지 확인한다. 이에 반해 UncheckedException은 컴파일 단계에서는 Exception이 발생하는지 확인하지 않고, 실행 중에 바로 발생한다.
실행 전 컴파일 단계에서 확인하여 CheckedException, 컴파일 단계에서는 확인하지 않으니 UncheckedException일 것이라고 추측해본다.

마지막 차이점은 예외 발생 시 트랜잭션 Rollback 처리 여부이다. 기본적으로 CheckedException이 발생하면 트랜잭션을 Rollback하지 않고, UncheckedException은 트랜잭션을 Rollback한다.

## Exception 처리 방법

Exception을 처리하는 방법은 일반적으로 **예외 복구, 예외처리 회피, 예외 전환** 이렇게 세 방법이 있다.

### 예외 복구
``` java
final int MAX_RETRY = 100;
public Object someMethod() {
    int maxRetry = MAX_RETRY;
    while(maxRetry > 0) {
        try {
            ...
        } catch(SomeException e) {
            // 로그 출력. 정해진 시간만큼 대기한다.
        } finally {
            // 리소스 반납 및 정리 작업
        }
    }
    // 최대 재시도 횟수를 넘기면 직접 예외를 발생시킨다.
    throw new RetryFailedException();
}
```

예외 복구는 예외 상황을 파악하고 문제를 해결하여 애플리케이션의 흐름을 정상 상태로 돌려놓기 위해 주로 사용한다.
위 예제는 여러번 재시도를 통해 예외를 복구하고, 재시도에도 계속 실패한다면 그 때 예외를 발생시킨다. 이 외에도 예외가 발생하면 다른 흐름으로 유도 시키기도 한다.

### 예외처리 회피
``` java
// 예시 1
public void add() throws SQLException {
    // ...생략
}

// 예시 2 
public void add() throws SQLException {
    try {
        // ... 생략
    } catch(SQLException e) {
        // 로그를 출력하고 다시 날린다!
        throw e;
    }
}
```

예외처리를 회피란 예외를 직접 처리하지 않고 호출한 쪽으로 던지는 방법을 말한다.
이는 확실하게 해당 로직을 호출한 쪽에서 예외를 처리하는게 옳다고 판단될 때만 사용해야 한다.


### 예외 전환

``` java
// 조금 더 명확한 예외로 던진다.
public void add(User user) throws DuplicateUserIdException, SQLException {
    try {
        // ...생략
    } catch(SQLException e) {
        if(e.getErrorCode() == MysqlErrorNumbers.ER_DUP_ENTRY) {
            throw DuplicateUserIdException();
        }
        else throw e;
    }
}
```

예외 전환은 발생한 예외를 다른 예외로 던지는 것을 의미한다.
예외 처리와 다른 점은 발생한 예외를 그냥 던지는 것이 아닌, 호출한 쪽에서 해당 Exception에 대해 더욱 명확히 인지할 수 있도록 더욱 구체화 된 예외를 던지는 것이다.
대표적으로 CheckedException 중 복구가 불가능한 예외가 발생했다면 이 예외를 UncheckedException으로 전환하는 방법이 있다. 이렇게 할 경우 예외에 대한 명확한 인지 뿐 아니라 다른 계층에서 일일이 예외 처리를 하지 않아도 되는 장점이 있다.



---
참고
- https://www.nextree.co.kr/p3239/
- https://madplay.github.io/post/java-checked-unchecked-exceptions
- https://cheese10yun.github.io/checked-exception/
