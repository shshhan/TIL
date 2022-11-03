## 오류상황

기존에는 문제가 없었는데 테스트를 추가하다보니 동일 로직에 대한 테스트가 두번 수행되었고 이에 따라 DB Unique 제약조건이 위배되어 오류가 발생했습니다.

오류가 발생한 코드는 오늘 날짜를 파라미터로 받아 데이터를 크롤링하고,
이미 DB에 등록이 되어있는지 확인 후에 없다면 DB에 insert 하는 메서드였습니다.

테스트 후에 DB에 insert된 데이터는 클렌징을 해주었는데, 애플리케이션의 컬렉션 객체(seoulMEtroDtoList)에 남아있는 값은 신경쓰지 못한 것이 원인이었습니다.

> 실제로 구동되는 것에는 이상이 없고 전체 테스트를 수행할 때만 오류가 생기는 것이니 그냥 넘어갈까?

배포 직전 모든 테스트를 수행하는데, 이때 마다 오류가 생기면 원활한 배포에 문제가 생길 수 있다고 판단했습니다. 테스트 코드든, 실제 로직이든 수정을 해야겠다고 생각했습니다.

> 그럼 테스트 코드에서 seoulMetroDtoList의 값만 비워줄까?

이렇게 하면 당장 테스트코드는 통과할 수 있지만, 추후 운영 상황에서 비슷한 문제가 생긴다면 장애로 이어질 가능성이 있다고 생각했습니다.



### 오류 발생 코드

``` java
private List<SeoulMetroDto> seoulMetroDtoList = new ArrayList<>();

    @Override
    public void collectInformation(LocalDate today, LocalDateTime now) {
        List<Element> titleList = new ArrayList<>();
        List<String> bodyList = new ArrayList<>();

        try {
            titleList = this.crawlTitlesByDate(today, now);

            for (Element titleEl : titleList){
                String title = titleEl.text();
                log.info(title);
                seoulMetroRepository.findByTitle(title)
                        .ifPresent((sm) -> {
                            throw new RuntimeException("이미 등록된 게시물입니다.");
                        });

                bodyList.add(this.crawlBody(titleEl));
            }

        } catch (IOException e) {
            e.printStackTrace();
        }

        for(int i = 0; i < titleList.size(); i++) {
            this.seoulMetroDtoList.add(new SeoulMetroDto(titleList.get(i).text(), bodyList.get(i)));
        }

    }

```

## 해결 방법

이 오류의 원인은 Unique 제약 조건 위배이지만, 본질적인 원인은 seoulMetroDtoList에 중복 데이터가 들어간 것이었습니다.

SeoulMetroDto를 값으로 갖는 컬렉션 객체를 ArrayList에서 HashSet으로 변경하였고,
SeoulMetroDto 클래스에 Lombok 어노테이션 중 @EqualsAndHashCode를 붙여주어 중복을 해결했습니다.