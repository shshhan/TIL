나는 명령어를 쓰는 것을 좋아한다.
처음에는 검은 화면에 뚝딱뚝딱 글씨를 적으며 작업하는 모습을 누군가에게 보여주고픈 허세 가득한 이유였지만, 정작 요즘은 이게 가장 편하고 직관적이어서 많이 쓰게 된다.

git을 사용할 때도 IDE에 탑재되어 있는 기능이나 github desktop을 사용하기보다는 담백하게 터미널에서 add-commit-push 하는 것을 좋아한다.
소스를 가져올 때도, 브랜치를 전환할 때에도 여러모로 나는 명령어가 훨씬 직관적이고 편리하다고 느낀다.

그래서 배포를 할 때에도 git에서 소스를 가져오고 빌드하여 배포 경로에 배치하고 tomcat을 재구동시키는 일련의 과정을 매번 직접 한땀한땀 명령어로 타이핑했다. 하지만 간단한 오류를 발견해서 소스를 수정하거나, 어제와 같이 dependency 체크를 제대로 하지 못해서 하루에도 여러번 배포를 해야하는 상화에서는 그 수고가 꽤나 부담스럽게 느껴졌다.

마침 회사에서 shell을 몇 번 접해보기도 했고, 요즘 꾸준히 읽고 있는 [이동욱님](https://jojoldu.tistory.com/) 저서 '[스프링 부트와 AWS로 혼자 구현하는 웹 서비스](http://www.kyobobook.co.kr/product/detailViewKor.laf?ejkGb=KOR&mallGb=KOR&barcode=9788965402602)'에서도 shell을 이용하여 배포를 자동화 하는 방법을 소개하고 있길래 해당 부분을 참고하며 나의 상황에 맞춰 shell 파일을 작성했다.

## Shell 파일 생성하기
shell 파일을 실행시키는데 제일 첫번째로 해야할 것은 당연히 shell 파일을 생성하는 일이다!

```
mkdir script
cd script
vim deploy.sh
```
우선은 script라는 디렉토리를 하나 생성한 뒤 deploy.sh라는 shell 파일을 vim 에디터로 오픈했다. 이렇게 하면 자동으로 deploy.sh라는 파일이 생성되고 vim 에디터로 열린다.



```
#filmUs 프로젝트를 testTomcat에 deploy하는 shell

REPOSITORY=~/gitRepository
PROJECT_NAME=filmUs
TOMCAT=~/tomcat9.0.60_testServer
TODAY=$(date "+%Y%m%d")

cd $REPOSITORY/$PROJECT_NAME/

echo "> git pull"
git pull origin main

echo ">maven clean"
mvn clean

echo "> 프로젝트 Build 시작"
mvn package

echo "> 기존 war 백업"
mv ${TOMCAT}/webapps/ROOT.war ~/backup/ROOT_${TODAY}.war

echo ">ROOT 삭제"
rm -rf $TOMCAT/webaapps/ROOT

echo ">war 파일 배포위치로 이동"
mv $REPOSITORY/$PROJECT_NAME/target/*.war $TOMCAT/webapps/ROOT.war

echo ">tomat 실행"
$TOMCAT/bin/startup.sh
```

위와 같이 코드를 작성했다.
shell이라고 뭔가 특별할 줄 알았는데 알고보니 그냥 내가 평소에 쓰던 명령어들을 입력하기만 하면 됐다.

우선은 가장 상단에 변수로 사용할 REPOSITORY, PROJECT, TOMCAT, TODAY를 선언해주었다.
이후 내용은 소스에 주석을 달아놓았는데 평소에도 저런 순서로 작업을 해왔다.

```
chmod +x ./deploy.sh
```
shell 파일을 다 만들고 난 뒤에는 해당 파일에 executable 권한을 부여해주었다.
![](https://imagedelivery.net/v7-TZByhOiJbNM9RaUdzSA/98c64dec-59d5-4d89-5cd9-1cc03e78a400/public)

## shell 파일 실행하기
```
./deploy.sh
```
shell 파일이 있는 경로에 있다면 ./[파일명]으로 shell 파일을 실행시킬 수 있다.

![](https://imagedelivery.net/v7-TZByhOiJbNM9RaUdzSA/9eaecebd-725a-4207-b05c-720bb0160500/public)

![](https://imagedelivery.net/v7-TZByhOiJbNM9RaUdzSA/d8e29be3-28c9-47d8-1379-f3e2c1193500/public)

shell에 적은 echo명령어 뿐만 아니라 git pull, mvn clean, mvn build, 각종 이동 명령어까지 모두 정상적으로 수행되었다.

![](https://imagedelivery.net/v7-TZByhOiJbNM9RaUdzSA/89948777-f8aa-4d6a-b2db-4ff9a97c4000/public)

기존의 war파일 백업도 정상적으로 수행된 것을 확인했다.

## shell 파일 정리하기

테스트를 해보고 정상적으로 수행되는 것을 확인했으니 이제 본격적으로 활요하기 위한 shell이 필요했다. 샘플로 만들었던 deploy.sh를 testDeploy.sh로 변경해주고, 이를 복사해서 운영 배포도 자동화할 shell 파일을 하나 더 만들어 prdDeploy.sh로 이름지어줬다.

```
#prdDeploy.sh
#filmUs 프로젝트를 prdTomcat에 deploy하는 shell

REPOSITORY=~/gitRepository
PROJECT_NAME=filmUs
TOMCAT=~/tomcat9.0.60_filmUs
TODAY=$(date "+%Y%m%d")

cd $REPOSITORY/$PROJECT_NAME/

echo "> git pull"
git pull origin main

echo ">maven clean"
mvn clean

echo "> 프로젝트 Build 시작"
mvn package

echo ">tomcat 중지"
$TOMCAT/bin/shutdown.sh

echo "> 기존 war 백업"
mv ${TOMCAT}/webapps/ROOT.war ~/backup/ROOT_${TODAY}.war

echo ">ROOT 삭제"
rm -rf $TOMCAT/webaapps/ROOT

echo ">war 파일 배포위치로 이동"
mv $REPOSITORY/$PROJECT_NAME/target/*.war $TOMCAT/webapps/ROOT.war

echo ">tomat 실행"
$TOMCAT/bin/startup.sh
```

실제 운영중인 tomcat은 항상 구동중이기 때문에 중간에 tomcat을 중지시키는 명령어 하나가 추가되었다는 점을 빼고는 샘플로 만들었던 shell과 동일하다.

```
#testDeploy.sh
#filmUs 프로젝트를 testTomcat에 deploy하는 shell

REPOSITORY=~/gitRepository
PROJECT_NAME=filmUs
TOMCAT=~/tomcat9.0.60_testServer

cd $REPOSITORY/$PROJECT_NAME/

echo "> git pull"
git pull origin main

echo ">maven clean"
mvn clean

echo "> 프로젝트 Build 시작"
mvn package

echo ">ROOT 삭제"
rm -rf $TOMCAT/webaapps/ROOT
rm -rf $TOMCAT/webapps/ROOT.war

echo ">war 파일 배포위치로 이동"
mv $REPOSITORY/$PROJECT_NAME/target/*.war $TOMCAT/webapps/ROOT.war

echo ">tomat 실행"
$TOMCAT/bin/startup.sh
```

배포 전 테스트해보기 위한 테스트 tomcat은 평소에 구동 중이지 않기 때문에 중지 명령어는 사용하지 않았고, 백업 역시 필요없다고 판단되어 넣지 않았다.

## 자동화 짜릿해..

shell을 실행시켰더니 알아서 척척 자동으로 배포되는 것을 봤을 때 마치 처음 코딩했을 때처럼 짜릿한 기분이었다.
명령어 치는게 재밌어서 즐겁게 했다지만 여러모로 손이 많이 가던 작업을 이렇게 한번에 끝낼 수 있다니 '참으로 자동화의 힘은 대단하구나' 느꼈다.
마치 내 공장 하나 생긴 기분이랄까,,⭐️
이정도만 되어도 엄청나게 편리해졌는데 git에 push만 해도 알아서 배포가 되는 환경은 얼마나 더 편할지 기대된다.
이 환경도 조만간 구축해봐야겠다!

---
참고
- [이동욱님](https://jojoldu.tistory.com/) 저서 '[스프링 부트와 AWS로 혼자 구현하는 웹 서비스](http://www.kyobobook.co.kr/product/detailViewKor.laf?ejkGb=KOR&mallGb=KOR&barcode=9788965402602)'ㅍ