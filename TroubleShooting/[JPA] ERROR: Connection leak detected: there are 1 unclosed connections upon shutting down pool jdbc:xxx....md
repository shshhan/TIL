## 오류상황

최근 열심히 김영한님의 JPA 강의를 수강하며 예제를 연습해보던 중 다음과 같은 오류가 발생했습니다.

> ERROR: Connection leak detected: there are 1 unclosed connections upon shutting down pool jdbc:h2:tcp://localhost/~/test

connection이 닫히지 않아 누수가 감지되었다는 내용의 오류입니다.

처음에는 DB 설정과 관련된 이슈인 줄 알았는데 해답은 트랜잭션에 있었습니다.

### 오류 발생 코드

``` java
public class Jpa4_RelationMapping {

    public EntityManagerFactory emf;

    public Jpa4_RelationMapping(EntityManagerFactory emf) {
        this.emf = emf;
    }

    public void relationMapping() {
        EntityManager em = emf.createEntityManager();

        EntityTransaction tx = em.getTransaction();
        tx.begin();

        try{

			//,,, JPA 로직 ,,,
            
 
        } catch (Exception e) {
            tx.rollback();
        } finally {
            em.close();
        }

    }

}
```

새롭게 생성한 예제코드에서 JPA 관련 로직을 수행한 후 열어두었던 트랜잭션을 종료하지 않은 것이 이 오류의 원이이었습니다.
주로 JPA 관련 로직 이후에는 commit을 수행하여 ditry checking 및 쓰기지연 SQL 저장소의 밀린 쿼리들을 처리하는데, 새로운 예제에서 commit을 작성하지 않아 문제가 발생했던 것이지요.

## 해결 방법


반드시 tx.commit()일 필요는 없으나, **tx.begin()으로 시작한 트랜잭션을 잘 닫아주면 됩니다.**

