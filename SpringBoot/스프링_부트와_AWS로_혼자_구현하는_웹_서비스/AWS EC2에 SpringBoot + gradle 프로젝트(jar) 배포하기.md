> 해당 내용은 [이동욱님](https://jojoldu.tistory.com/) 저서 '[스프링 부트와 AWS로 혼자 구현하는 웹 서비스](http://www.kyobobook.co.kr/product/detailViewKor.laf?ejkGb=KOR&mallGb=KOR&barcode=9788965402602)'를 공부하며 정리한 내용입니다.

과거 스프링 프레임워크로 구현한 프로젝트를 tomcat으로 EC2에서 배포하는 포스팅을 작성했습니다.

스프링부트에는 tomcat이 내장되어있어 따로 tomcat+war의 조합이 아닌 jar 파일 만으로 배포가 가능합니다.

이번 포스팅에서는 [AWS EC2에 war파일 배포하기](https://velog.io/@shawnhansh/AWS-EC2%EC%97%90-%EB%B0%B0%ED%8F%AC%ED%95%98%EA%B8%B0) 포스팅에서 작성한 내용과 동일한 부분은 스킵하고 이후의 내용부터 다루려고 합니다.
이전 포스팅의 소제목 '프로젝트 소스 가져오기'와 '.gitignore에 등록했던 파일 만들기'를 선수행한 후 아래의 내용을 따라가주세요.


## 소스코드 테스트하기
```
./gradlew test
```
소스코드를 내려 받은 이후 테스트를 수행하여 서버 환경에서의 테스트 결과를 확인합니다.

![](https://velog.velcdn.com/images/shawnhansh/post/8d979e3e-3d57-41ed-99c1-f77eb457af1a/image.png)

저는 처음 이과정에서 수많은 오류를 겪었습니다.
혹시 이 과정에서 오류가 발생한다면 [./gradlew test를 성공하기까지...](https://velog.io/@shawnhansh/.gradlew-test%EB%A5%BC-%EC%84%B1%EA%B3%B5%ED%95%98%EA%B8%B0%EA%B9%8C%EC%A7%80)와 [AWS EC2 램 늘리기(feat.스왑)](https://velog.io/@shawnhansh/AWS-EC2-%EB%A9%94%EB%AA%A8%EB%A6%AC-%EC%8A%A4%EC%99%91) 포스팅의 내용을 확인해주세요!

만약 gradlew의 권한이 없다는 오류 메세지가 나오면 다음 명령어로 권한을 추가한 뒤에 다시 테스트를 수행합니다.
```
chmod +x ./gradlew
```

## 소스코드 빌드하기
```
./gradlew build
```
소스코드를 build하여 jar 파일을 생성하는 명령어입니다.
빌드가 수행되면 build/libs/ 에 jar 파일이 생성됩니다.

![](https://velog.velcdn.com/images/shawnhansh/post/65a87792-dbd9-49c6-b7c7-9bd3e2cfe1cc/image.png)

## 배포 환경 설정하기

DB 등 개발 환경과 배포 환경이 상이한 부분이 있을 수 있습니다.
이러한 부분은 properties를 생성하고 application.properties에서 이를 group으로 관리할 수 있습니다.
이전에 작성했던 [SpringBoot 배포를 위한 .properties 설정하기 ](https://velog.io/@shawnhansh/SpringBoot-%EB%B0%B0%ED%8F%AC%EB%A5%BC-%EC%9C%84%ED%95%9C-%EC%84%A4%EC%A0%95%ED%95%98%EA%B8%B0application-real.properties-application-real-db.properties) 포스팅을 참고하여 필요한 properties 파일을 생성해주세요.


## .jar 파일 실행시키기
```
nohup java -jar [파일명].jar 2>&1 &
```

- java -jar은 .jar를 실행시키는 명령어 입니다. 하지만 이렇게 .jar를 수행시키면 터미널 접속이 끊길 때 애플리케이션도 함께 종료됩니다.
- nohup(no hang up) 명령어를 사용하면 세션 연결이 끊겨도 애플리케이션을 계속 수행시킵니다.
- 2>&1은 표준 에러와 표준 출력을 한 곳에서 로그를 남긴다는 의미입니다.
nohup 사용시 기본적으로 nohup.out에 로그가 쌓이게 됩니다. 하지만 표준 출력과 표준 에러를 각기 다른 파일에 남기고 싶다면 1>[파일명] 2>[파일명]으로 두 출력을 구분하여 남길 수 있습니다. 이때 **1은 표준 출력, 2는 표준 에러**를 의미합니다.
즉 2>&1은 표준 에러를 표준 출력과 같은 곳에 남긴다는 의미가 됩니다.


### 배포 환경을 위한 properties 혹은 profile이 있는 경우

```
nohup java -jar \
    -Dspring.config.location=classpath:/application.properties,classpath:/application-real.properties,/home/ubuntu/app/springBoot/application-oauth.properties,/home/ubuntu/app/springBoot/application-real-db.properties \
    -Dspring.profiles.active=real \
   [파일명].jar 2>&1 &
```    

- -Dspring.config.location 
	
    - 스프링 설정 파일의 위치를 지정하는 옵션입니다.
    - classpath:는 jar 내부에 있는 resources 디렉토리를 기준으로 경로를 지정합니다.
    - jar 외부에 있는 properties 파일은 절대 경로로 경로를 지정해주어야 합니다.
    - 저는 jar 내부에 application.properties, application-real.properties, jar 외부에 application-oauth.properties, application-real-db.properties를 지정해주었습니다.
    
- -Dspring.profiles.active
	
    - 활성화할 profile을 지정하는 옵션입니다.
    - application.properties에 spring.profiles.group.그룹명=profile1, profile2으로 설정해두면 위 옵션에 그룹명을 값으로 주었을 때 profile1, profile2에 해당하는 properties가 설정파일로서 적용됩니다.
    
![](https://velog.velcdn.com/images/shawnhansh/post/a789befa-2904-4290-a902-6d0d3cb5e70a/image.png)

## shell 파일로 간편하게 배포하기

여타 과정은 둘째치고 jar 파일을 수행시키는 명령어만 해도 몇 줄이 되다보니 이건 반드시 shell 파일로 자동화를 시켜야겠다는 생각이 들었습니다.

```
REPOSITORY=~/app/springBoot
PROJECT_NAME=SpringBootProject

cd $REPOSITORY/$PROJECT_NAME

echo "> Git Pull"

git pull origin main

echo "> 프로젝트 Build 시작"

./gradlew build

echo "> spirngBoot  디렉토리로 이동"

cd $REPOSITORY

echo "> Build 파일 복사"

cp $REPOSITORY/$PROJECT_NAME/build/libs/*.jar $REPOSITORY/

echo "> 현재 구동중인 애플리케이션 pid 확인"

CURRENT_PID=$(pgrep -f {$PROJECT_NAME}*.jar)

echo "현재 구동중인 애플리케이션 pid : $CURRENT_PID"

if [ -z "$CURRENT_PID" ]; then
        echo "> 현재 구동 중인 애플리케이션이 없으므로 종료하지 않습니다."
else
        echo "> kill -15 $CURRENT_PID"
        kill -15 $CURRENT_PID
        sleep 5
fi

echo "> 새 애플리케이션 배포"

JAR_NAME=$(ls -tr $REPOSITORY/ | grep jar | tail -n 1)

echo "> JAR NAME : $JAR_NAME"

nohup java -jar \
    -Dspring.config.location=classpath:/application.properties,classpath:/application-real.properties,/home/ubuntu/app/springBoot/application-oauth.properties,/home/ubuntu/app/springBoot/application-real-db.properties \
    -Dspring.profiles.active=real \
   $REPOSITORY/$JAR_NAME 2>&1 &
```

git pull -> build -> 파일 이동 -> 프로세스 확인 -> jar 실행의 순서로 진행 되도록 구현했습니다.
자주 사용하는 경로는 변수에 담아놓고 이용했습니다.

---
참고 

- https://joonyon.tistory.com/98
- http://it-archives.com/222343367697/