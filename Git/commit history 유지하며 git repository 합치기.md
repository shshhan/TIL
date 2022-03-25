나는 성격이 비슷한 두개의 git repository가 있다.
하나는 요즘 블로그에 정리하는 글들을 담는 TIL,
하나는 전에 매일 JavaScript의 ES6 이상 문법을 공부하며 채운 TIL_modernJsGuide..

그래서 이 두 저장소를 합치기로 했다.
약 두 달째 1일 1커밋을 하는 중이니 내 소중한 잔디들을 지켜주는 것이 가장 중요했다.

## 두 저장소 준비
합치고 싶은 두 저장소를 A와 B라고 하자.
A의 데이터와 commit history를 B로 가져온다고 가정한다면,
B는 현재 로컬에 있어야 하고 A의 github 주소를 알고 있어야 한다.

나의 경우는 'TIL_modernJsGuide'를 'TIL'에 넣을 예정이니,
로컬에 TIL을 최신 상태로 두고 TIL_modernJsGuide의 원격 저장소 주소를 준비한다.

## 원격 저장소 추가하기
합치려면 데이터가 필요하지 않겠는가?
B의 로컬 저장소로가서 A의 원격 저장소를 추가하자
```
git remote add [이름] [원격 저장소 주소]
```
여기서 이름은 해당 로컬 저장소에서 쓰게될 원격 저장소의 키 값이니 자유롭게 본인이 구별할 수 있는 값이면 무엇을 써도 상관없다.

나의 경우에는 TIL에 TIL_modernJsGuide의 원격 저장소를 mjg라는 이름으로 연결했다.
연결한 뒤 현재 연결되어 있는 원격 저장소를 한번 확인해주면 더욱 좋다.
```
git remote add mjg git@github.com:shshhan/TIL_modernJsGuide.git
git remote -v
```
![](https://images.velog.io/images/shawnhansh/post/a3688c41-f201-42fa-a34e-aa76692d942d/image.png)

확인해보면 mjg라는 이름으로 잘 연결되었다.

## 가져오고 합치기
연결까지 끝났으니 이제 데이터를 끌고온 뒤 제대로 합치기만 하면 된다.

```
git fetch [원격 저장소 이름]
git merge [새로운 브랜치 이름]
```
fetch 명령어를 수행하면 원격 저장소에서 데이터를 끌고 온 뒤에 새로운 브랜치가 생성되고,
merge 명령어를 통해 새로운 브랜치를 합치면 된다.


```
git fetch mjg
git merge mjg/main
```
![](https://images.velog.io/images/shawnhansh/post/9987ad9c-2885-4a34-b436-777fed596abc/image.png)

나의 경우는 원격 저장소 연결할 때 이름을 mjg로 했기 때문에 이 이름으로 fetch 명령어를 수행했고,
새로 생성된 mjg/main을 merge했다.

그런데 여기서 두 저장소가 연관성이 없다면 "fatal: refusing to merge unrelated histories" 에러가 발생한다.
이 경우에는 merge 명령어에 옵션을 추가해주면 해결된다.
```
git merge --allow-unrelated-histories [새로운 브랜치 이름]
```

![](https://images.velog.io/images/shawnhansh/post/021d8de0-1f93-4e5b-853b-0eca516c98ed/1.png)

그러면 위와 같은 메세지가 뜨는데 가볍게 나가면 된다.
메세지가 뜬 창은 git 설치할 당시 설정에 따라 다르겠지만
위 캡쳐와 같이 vim 편집기로 떴다면 esc를 누르고 :q를 입력한 뒤 엔터를 누르면 된다.

![](https://images.velog.io/images/shawnhansh/post/678e6ef9-61be-439b-8e1d-0c19c37696d8/image.png)

그러면 이제 이렇게 merge에 성공한 그림이 나오게 된다.

## 결과 확인해보기
파일들은 제대로 들어온 것 같은데 커밋 히스토리도 제대로 같이 들어왔을까?
```
git log --oneline
```
커밋 히스토리를 한줄로 표시해주는 명령어다.

![](https://images.velog.io/images/shawnhansh/post/5e9a1e24-9877-4ee2-a53d-ccab48716c3d/%E1%84%86%E1%85%AE%E1%84%8C%E1%85%A6.png)

작업 전에는 이렇게 기존 저장소의 커밋 히스토리만 보였지만

![](https://images.velog.io/images/shawnhansh/post/dbb2097f-5230-4afc-81e5-41389072c1ad/2.png)

작업이 끝난 뒤에는 합쳐진 저장소의 커밋 히스토리도 잘 들어온걸 확인할 수 있다.


![](https://images.velog.io/images/shawnhansh/post/6c852e59-2203-415f-8a56-f74dc19b0c73/image.png)
이제 해당 저장소를 원격 저장소에 push해보면 원격 저장소에서도 커밋 히스토리가 합쳐져 있는 것을 볼 수 있다.

---
참고
https://velog.io/@lina0322/git-git-repository-합치기git-log-지키기?utm_source=pocket_mylist