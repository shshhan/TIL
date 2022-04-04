## AWS에서 클라우드 DB를 공짜로 쓸 수 있다

새로운 프로젝트를 시작하려고 하는데 DB를 어떤걸 사용해야하나 고민이었다.
지금은 노트북을 바꾸며 현재 로컬에는 DB가 설치되어 있지 않다.
예전에 처음 코딩을 배운 학원에서 오라클 클라우드 DB를 설치하고 사용했는데 이때 클라우드 DB의 편리함을 맛본터라 클라우드 DB를 구축하고 싶었고, 오라클보다는 mySql이나 MariaDB를 이용하고 싶었다.

그러다가 지금까지는 몰랐던 새로운 사실을 알게되었다.

![](https://media.vlpt.us/images/shawnhansh/post/caf9ab4c-55ad-4d14-8487-70050b297e28/1.png)

난 왜 이걸 이제 알았는가..!
빠르게 AWS의 프리티어를 뽕뽑기 위해 RDS를 생성하러 가보기로 한다!!

## Free Tier로 RDS 생성하기

![](https://media.vlpt.us/images/shawnhansh/post/a33e5392-1413-483d-957c-5b06498013a5/image.png)

검색창에 rds를 입력해서 RDS 서비스로 접근한다.

![](https://media.vlpt.us/images/shawnhansh/post/035d42e2-3cf1-4928-8add-c8d9ae9ee0d3/2.png)

가장 상단에 AWS Aurora에 대한 간략한 설명이 있고 바로 아래에 '데이터베이스 생성' 버튼이 있다. 이 버튼을 눌러준다.

![](https://media.vlpt.us/images/shawnhansh/post/d38b88f0-a9cc-47ef-86a3-1693342744c6/image.png)

처음 DB를 배우고 프로젝트를 할 때는 Oracle을 활용했지만 이전 직장에서 MySql을 많이 사용하기도 했고 추후에 프리티어 이용이 종료된 뒤에 비용을 지불하며 사용할 때에도 Oracle보다는 MySql이 가격 메리트가 있어 MySql로 선택했다.

![](https://media.vlpt.us/images/shawnhansh/post/31fc50d9-fb91-4884-9efc-493bac4ad94d/image.png)

템플릿은 프리 티어를 선택했다.
아래 설정에서는 DB 인스턴스 식별자와 자격 증명 설정을 설정한다.
특별히 꼭 이렇게 해야한다는 법칙은 없지지만, 이 사용자 정보로 실제 DB에 접근하니 잘 기억해두거나 메모해두도록 하자!

![](https://media.vlpt.us/images/shawnhansh/post/9c3b7d45-ef63-4ae8-8c3f-5d6045e26cce/3.png)

프리티어를 선택했기 때문에 DB 인스턴스 클래스는 '버스터블 클래스(t클래스 포함)'만 선택 가능하다.
해당 인스턴스 클래스 중 과금 방지를 위해 db.t2.micro를 선택했다.
스토리지 자동 조정 역시 과금 방지를 위해 체크를 해제하였다.

![](https://media.vlpt.us/images/shawnhansh/post/930130b6-a3a1-4784-b7f4-5313430e8d82/4.png)

VPC(Virtual Private Cloud)는 DB 인스턴스에 대한 가상 네트워킹 환경이다. 서브넷 그룹까지 모두 기본적으로 되어있는 설정을 유지한다.
퍼블릭 엑세스는 '아니요'를 설정하면 VPC 내부에서만 DB 인스턴스에 접근이 가능하다. 본인의 EC2에서만 연결해서 사용한다면 '아니요'를 선택해도 되지만, 툴을 통해 접근하거나 로컬의 개발환경 등에서 사용하려면 '예'를 선택해야한다.
VPC 보안그룹에는 내가 기존에 EC2에서 사용하던 보안그룹을 추가해주었다.
가용 영역에 대해서는 설명을 읽어보아도 어떤 선택을 하는 것이 도움이 될지 모르겠어서 일단은 기본 설정을 유지했다.
데이터베이스 포트는 mySql의 기본 포트은 3306으로 기본 설정 되어있다.

![](https://media.vlpt.us/images/shawnhansh/post/3c5345a5-1e14-4f42-9f78-e46ade50c853/5.png)

추가구성에서 초기 데이터베이스 이름을 설정해준다. 나는 심플하게 'mydb'라고 설정해주었다.
백업은 자동백업을 활성화 시켰고, 보존 기간은 차지할 용량을 고려하여 7일로 설정했다.

![](https://media.vlpt.us/images/shawnhansh/post/118fc5a4-d7b4-44e5-b957-e4503c8e7215/6.png)

모니터링과 로그 보내기, 유지관리는 설정을 꺼주었다.
하지만 삭제 방지는 혹시 모를 경우를 대비하여 활성화 시켜주었다.

![](https://media.vlpt.us/images/shawnhansh/post/27743ff5-afbf-49a7-b78e-e45ac8fd39b7/7.png)

마지막으로 다시한번 프리티어의 조건을 확인한 뒤 우측 하단에 데이터베이스 생성 버튼을 클릭한다.

![](https://media.vlpt.us/images/shawnhansh/post/0ca14eb0-1e4a-4892-93e1-becc7fb0aeb3/8.png)

버튼을 눌러 화면이 이동하면 화면 상단에서 데이터베이스 생성 중임을 알려주고 있다.
몇 분 이내로 생성이 완료된다.

## 새로운 파라미터 그룹 생성하고 설정하기

![](https://media.vlpt.us/images/shawnhansh/post/d8f2979e-faf8-4bb8-a132-95bbc8a99ada/9.png)

생성이 완료 되었으면 이제 몇가지 필수 설정을 해야할 차례이다.
화면 좌측 메뉴에서 파라미터 그룹으로 들어와서 우측에 파라미터 그룹 생성 버튼을 클릭한다.

![](https://media.vlpt.us/images/shawnhansh/post/ac3584e0-2576-40cd-9106-6c05577e6d1d/image.png)

파라미터 그룹 패밀리는 방금전에 생성했던 mySql 버전과 같은 버전으로 맞춰준다.
그룹 이름과 설명은 본인이 식별하기 쉽게 적어준 뒤 우측 하단에 생성 버튼을 클릭해 새로운 파라미터 그룹을 생성한다.

![](https://media.vlpt.us/images/shawnhansh/post/a9567b2b-9050-4335-9202-68031ef32ac5/10.png)

다시 돌아온 파라미터 그룹 화면에서 방금 생성한 파라미터 그룹을 선택하고 우측 상단에 파라미터 그룹 작업에서 편집을 선택한다.

![](https://media.vlpt.us/images/shawnhansh/post/d10c5ebb-9cdd-47c0-9a05-138d145852dd/11.png)

제일 먼저 Time Zone을 변경해준다.
검색창에 time_zone을 검색한 뒤 값을 Asia/Seoul로 변경한다.
변경 후 체크박스를 체크하고 재설정을 선택한다.

![](https://media.vlpt.us/images/shawnhansh/post/d63dee1d-8147-4613-b270-bfdb8e2e7418/image.png)

재설정하겠냐고 물어보신다면 파라미터 재설정 버튼을 선택하는 것이 인지상정..!

![](https://media.vlpt.us/images/shawnhansh/post/e3d36cb7-406e-4002-bc46-874726709003/image.png)

![](https://media.vlpt.us/images/shawnhansh/post/37d4f572-8d8d-4461-887f-f917943a075c/image.png)

![](https://media.vlpt.us/images/shawnhansh/post/c50debb5-8187-4b5a-8c6e-abe4fc59196a/image.png)

![](https://media.vlpt.us/images/shawnhansh/post/f6501227-73a8-44bc-8b65-19800ec3daeb/image.png)

다음은 Character Set이다. 먼저 character을 검색한 뒤 6개 항목에 대해 값을 utf8mb4로 변경한다.
- character_set_client
- character_set_connection
- character_set_database
- character_set_filesystem
- character_set_results
- character_set_server

이후에는 위에 Time Zone에서 했던 것 처럼 체크박스에 체크한 뒤 재설정을 해준다.

아직 끝나지 않았다. 이번에는 collation을 검색한 뒤 아래 항목에 대해 값을 utf8mb4_general_ci로 변경하고 역시 재설정 한다.
- collation_connection
- collation_server

utf8mb4는 utf8에서 😀나 😍와 같은 이모지 저장이 가능해진 Character Set이다.

## DB에 파라미터 그룹 연결하기

![](https://media.vlpt.us/images/shawnhansh/post/a5ee31a7-30de-4762-ae62-8e73d7fdb01b/%E1%84%86%E1%85%AE%E1%84%8C%E1%85%A6.png)

새로 생성하고 설정한 파라미터 그룹을 DB에 연결시켜주는 작업이다.
다시 데이터베이스 메뉴로 돌아와서 DB를 선택하고 우측 상단에 수정 버튼을 선택한다.

![](https://media.vlpt.us/images/shawnhansh/post/100ec8aa-8e18-4bf7-9981-e462f223de9e/12.png)

수정 페이지에서 추가 구성 탭의 DB 파라미터 그룹을 방금 생성하고 수정한 새 파라미터 그룹으로 변경해준 뒤 페이지 하단에 계속 버튼을 선택하여 다음 화면으로 넘어간다.

![](https://media.vlpt.us/images/shawnhansh/post/30b0dea2-a2ca-4bcc-954f-804eecec0f2b/13.png)

수정 사항 요약을 통해 어떤 것을 수정했는지 확인할 수 있다.
해당 수정 사항을 언제 적용할지 선택할 수 있는데, 지금 갓 만든 데이터베이스이고 운영중인 서비스와 연결되어있지 않으므로 즉시 적용을 선택했다.
만약 추후 운영중인 서비스에 연결된 DB를 수정할 경우에는 새벽시간에 진행하는 것이 좋을 것 같다.
마무리 되었다면 인스턴스 수정 버튼을 선택한다.

![](https://media.vlpt.us/images/shawnhansh/post/dcf99d93-7509-458c-901c-fd9cf27be9b8/14.png)

보다 확실한 적용을 위해 DB를 선택하고 우측 상단 작업 탭에서 재부팅까지 해주면 완벽하다.

이렇게 AWS RDS를 활용하여 mySql DB를 생성해보았다.
다음 포스팅에서는 이 DB를 이곳 저곳 필요한 곳에 연결해보는 방법을 알아보겠다.

참고
- [이동욱님](https://jojoldu.tistory.com/) 저서 '[스프링 부트와 AWS로 혼자 구현하는 웹 서비스](http://www.kyobobook.co.kr/product/detailViewKor.laf?ejkGb=KOR&mallGb=KOR&barcode=9788965402602)'