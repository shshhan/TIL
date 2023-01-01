몇 달 전 WithMe 프로젝트를 함께 수행하던 당시에 함께 백엔드를 작업하던 분께서 서버에 접속해서 로그를 확인해보고 싶다고 하셨습니다.
사실 이전까지 혼자 서버에만 들어가며 작업을 했고 회사에서 역시 나에게 권한이 있는 유저로만 접근을 하다보니 유저를 생성하거나 권한 관리를 해본 적 없이 주어진 대로 사용만 하던 입장이었습니다.

또한 이때까지만 해도 저는 서버에서 계정을 나누어 사용하지 않고 pem 파일을 활용하여 ubuntu 계정으로 서버에 ssh 접속을 해왔습니다. 여러 유저가 사용할 수 있는 리눅스의 사상을 처참히 무시한채 이용해왔던 것이지요..ㅎㅎ 

그래서 이번에는 Ubuntu 서버에서 유저를 생성하고 삭제하는 방법을 알아보겠습니다.

# 계정 생성

계정을 새로 생성하는 명령어로는 useradd와 adduser가 있습니다.
이름도 비슷한 이 두 명령어가 어떻게 다른지 직접 명령어를 수행해보며 알아보겠습니다.

## useradd

useradd는 다음과 같은 특징이 있습니다.
- 홈 디렉토리를 수동으로 생성해주어야함. (-m 옵션을 붙이면 자동 생성)
- 비밀번호를 수동으로 설정해주어야함.
- 기본 쉘을 sh로 설정.

![](https://velog.velcdn.com/images/shawnhansh/post/b8f0e74d-4144-4747-a7e8-47d90f243a92/image.png)

캡처에서 확인 할 수 있듯 useradd 명령어는 root 계정으로만 명령어 수행이 가능합니다.

```
sudo useradd [유저이름]
```

명령어를 수행한 뒤 유저가 정상적으로 생성되었는지 확인해 보겠습니다.

```
sudo tail -1 /etc/passwd
```
/etc/passwd는 시스템에 등록된 사용자의 정보들이 담겨있는 파일입니다.
방금전에 추가한 유저는 가장 마지막에 등록이 되어 있을 테니 tail 명령어에 -1 옵션으로 확인해보았습니다.

해당 내용의 의미는 아래에서 다루도록 하겠습니다.

![](https://velog.velcdn.com/images/shawnhansh/post/d5060028-c29f-442c-8b4d-c6d952f54750/image.png)

계정의 홈 디렉토리는 /home 아래에 생성되는데 확인해보니 경로가 생성되지 않았네요.
```
sudo mkdir [유저이름]
```

/home 에서는 해당 경로의 소유자인 root에만 w 권한이 있기 때문에
유저의 홈 디렉토리도 root가 생성해야하고 이 역시도 root만 w가 가능하도록 생성되었습니다.
추후에 제대로 사용하려면 권한 변경은 필수적이겠네요!

** useradd 명령어 수행 시 -m 옵션을 붙인다면 새로 생성한 계정을 소유자로 한 홈 디렉토리가 자동으로 생성됩니다.
![](https://velog.velcdn.com/images/shawnhansh/post/1e9c81a0-40a7-4284-81c7-0605703b556f/image.png)

![](https://velog.velcdn.com/images/shawnhansh/post/5f4b36bb-6294-4dfe-b6a7-cd097a4c273d/image.png)

```
sudo passwd [유저이름]
```

해당 유저로 접근하기 위해서는 패스워드를 설정해주어야 합니다.
passwd 명령어로 패스워드를 설정 후 su 명령어로 계정을 변경해보았습니다.

## adduser

adduser는 다음과 같은 특징이 있습니다.
- 홈 디렉토리가 자동으로 생성됨.
- 유저가 생성되는 중 비밀번호를 설정함.
- 기본 쉘을 bash로 설정.

![](https://velog.velcdn.com/images/shawnhansh/post/aec12fe1-0064-4ede-b9a1-c51c7c3ba4ae/image.png)

adduser 역시 useradd와 마찬가지로 root 권한으로만 수행이 가능합니다.
하지만 useradd와 달리 생성시 /home 경로에 유저 디렉토리가 유저 소유로 바로 생성되고, 비밀번호 설정 또한 바로 가능하기 때문에 훨씬 편리하다고 생각되네요.

![](https://velog.velcdn.com/images/shawnhansh/post/94a1f0da-e8a5-4160-a8dd-2f32cd1e7236/image.png)

/etc/passwd 가장 하단 확인을 통해 정상적으로 계정이 생성된 것을 확인했습니다.

또한 adduser 명령어 수행 시 터미널에 출력되었던 내용 중 
/etc/skel의 파일을 홈 디렉토리로 카피하는 내용이 궁금해 파일 리스트를 확인해보았더니
계정과 관렫된 세개의 파일(.bash_logout, .bashrc, .profile)이 있었고
홈 디렉토리에도 잘 들어와 있는 것을 알 수 있었습니다.

![](https://velog.velcdn.com/images/shawnhansh/post/5758dcfd-debc-45ce-b59b-8ba4b580881a/image.png)

su 명령어로 계정을 변경해보았습니다.
접속이 잘 되지만 ui가 useradd 때와는 조금 다른 느낌이네요.
sh로 기본 쉘을 설정하는 useradd와 달리 adduser는 bash로 기본 쉘을 설정하기 때문입니다.


## useradd vs adduser

뚜렷하게 느낀 차이점은 홈 디렉토리 생성, 패스워드 설정, 기본 쉘이었습니다.
표로 정리하면 아래와 같이 정리가 되겠네요.

| | useradd | adduser |
|:---|:---:|:---:|
| 홈 디렉토리 생성 | 수기 생성 | 자동 |
| 패스워드 설정 | 수기 설정 | 유저 생성 중 설정 |
| 기본 쉘 | sh | bash |

# 계정 삭제

계정 삭제 역시 userdel과 deluser 두가지 명령어가 있습니다.
계정 삭제는 기존에 있던 계정과 관련된 정보를 잘 삭제만 해주면 되기 때문에 한번에 데이터를 날릴 수 있는 옵션을 알아보고 명령어를 수행하도록 하겠습니다.

## userdel

![](https://velog.velcdn.com/images/shawnhansh/post/7df41fa4-c07a-43dc-9b7d-8e503421427e/image.png)

userdel은 -r 옵션을 붙이면 홈 디렉토리와 메일을 삭제해준다고 합니다.

```
sudo userdel -r [유저이름]
```
기존 홈 디렉토리는 root 계정으로 만들었기 때문에 삭제가 불가능하다고 나왔습니다.
어쩔 수 없이 rm 명령어로 삭제를 해주어야 합니다.

## deluser

![](https://velog.velcdn.com/images/shawnhansh/post/77cdaa19-691b-40d1-9da8-33a7bb902120/image.png)

deluser는 --remove-all-files 옵션으로 해당 유저의 모든 파일을 삭제해준다고 합니다.

```
sudo deluser --remove-all-files [유저이름]
```

![](https://velog.velcdn.com/images/shawnhansh/post/c294bea5-af7a-4492-a448-d005a59b352b/image.png)
![](https://velog.velcdn.com/images/shawnhansh/post/e3eebdea-e565-4b27-9d7d-b643ef3fc172/image.png)

터미널에 굉장히 많은 내용들이 지나간 뒤에 삭제가 되었다는 메세지가 출력되었습니다.

![](https://velog.velcdn.com/images/shawnhansh/post/d46d37c9-8c63-4864-ad5e-4b0d73a9c50e/image.png)

두 계정이 정상적으로 삭제되었는지 확인하기 위해 유저 정보, 그룹 정보, 홈 디렉토리를 모두 검색해보았지만 발견된 것이 없었습니다.

결론적으로 두 명령어 모두 각 계정의 홈 디렉토리를 비롯한 정보들 삭제한 것으로 알 수 있었습니다.

# 마치며

비슷한 명령어들이 왜 두개씩 존재하는지는 잘 모르겠습니다만...
생성은 adduser가 추가적인 작업이 불필요해서 편한 것 같고 삭제는 userdel이 옵션이 짧아 편하다고 느꼈습니다.
제가 알아본 차이점에 오류가 있거나 더 좋은 방법을 알고 계신 분들은 댓글로 내용을 공유해주세요 :)

감사합니다!

---

참고 자료
- https://reakwon.tistory.com/137
- https://hec-ker.tistory.com/299
- https://withcoding.com/101
