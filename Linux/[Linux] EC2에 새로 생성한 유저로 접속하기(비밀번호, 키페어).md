[AWS EC2 Ubuntu 서버에 새로 유저를 생성](https://velog.io/@shawnhansh/Linux-Ubuntu%EC%97%90%EC%84%9C-%EA%B3%84%EC%A0%95-%EC%83%9D%EC%84%B1-%EC%82%AD%EC%A0%9C-%ED%95%98%EA%B8%B0)한 뒤 ssh 접속을 시도했습니다.

![](https://velog.velcdn.com/images/shawnhansh/post/391babab-5b56-4290-85ae-824d79f63209/image.png)

당연히 비밀번호를 물으면 입력하고 들어갈 생각이었는데 꽤나 당황스러웠습니다.

혹시나 저와 같은 문제를 겪은 분들을 위해 이 문제에 대한 방법과 더욱 안전한 키페어를 생성하여 로그인하는 방법을 알아보겠습니다.

## 비밀번호 입력하여 접속하기
### sshd_config 수정하기

우선 기존에 잘 접속하던 원래의 계정으로 서버에 접속하여 아래의 명령어를 수행합니다.

```
sudo vim /etc/ssh/sshd_config
```
SSH는 Secure Shell의 약자로, 네트워크 상의 다른 컴퓨터에 로그인하거나 원격 시스템에서 명령을 실행하고 다른 시스템으로 파일을 복사할 수 있도록 해 주는 응용 프로그램 또는 그 프로토콜입니다.(출처 : [위키](https://ko.wikipedia.org/wiki/%EC%8B%9C%ED%81%90%EC%96%B4_%EC%85%B8))
SSHD는 SSH Daemon으로, SSH 연결을 받아주기 위해 대기하는 프로세스입니다. 위 명령어를 통해 이 SSHD의 설정 파일에 들어왔습니다.

![](https://velog.velcdn.com/images/shawnhansh/post/b29b06f7-306e-41f9-90a7-8d78555dc3d4/image.png)

파일 내부에서 PasswordAuthentication을 찾아 yes로 변경 후 저장합니다.
아마 비밀번호를 묻지 않고 접속이 차단되었다면 이 항목이 기존에는 no로 되어있었을 확률이 높습니다.
(만약 yes였다면 그때부터는 방화벽 같은 다른 부분을 확인해야 합니다.)

```
sudo service sshd restart
```
sshd_config 파일을 수정했다면 sshd를 재실행 시켜주어야 수정한 내용이 반영됩니다.

### ssh 접속 시도하기

```
ssh 유저이름@호스트
```
![](https://velog.velcdn.com/images/shawnhansh/post/cd233e2e-d909-4206-922f-4b95cd7221fd/image.png)

이후 다시 재접속 시도를 하면 이번에는 정상적으로 비밀번호를 물어보고 정상 접속이 된 것을 확인할 수 있습니다!

## 키페어로 접속하기

위에서 알아본 것 처럼 간단한 설정 변경만으로 비밀번호로 접속할 수 있지만!
비밀번호가 유출될 우려가 있기 때문에 보안 상 좋은 방법은 아닙니다.
특히 방화벽이나 서버 내 디렉토리 및 파일에 대한 접근 권한이 조금 느슨하다면 단순히 유저를 넘어 서버 전체가 위험할 수 있습니다.
그래서 손이 한번 더 가더라도 키페어를 생성하여 접속하는 것이 훨씬 더 안전하다고 생각하고 있습니다.

### 키페어 생성하기

우선 키를 생성할 계정으로 접속해야합니다.
기존에 접속하던 계정에서 su 명령어를 통해 접속하거나, 혹은 위에서 알아본 비밀번호로 접속해도 괜찮습니다.
(하지만 키를 생성한다면 추후에 다시 비밀번호 기능을 비활성화 해도 되겠죠?)

```
ssh-keygen -t rsa
```

ssh 키를 생성하는 명령어로 -t 옵션으로 암호화 알고리즘을 선택할 수 있습니다.
저는 많이 사용하는 rsa를 사용했는데, 해당 명령어의 기본값이 rsa이기 때문에 '-t rsa'없이 ssh-keygen만 입력해도 rsa 알고리즘으로 키가 생성됩니다.

![](https://velog.velcdn.com/images/shawnhansh/post/7986918b-13a2-41e7-839f-16d5d47b7230/image.png)

명령어를 수행하면 저희가 입력할 것이 총 세번 나옵니다.
필요에 따라 입력하면 되고, 필요하지 않다면 입력하지 않아도 무방합니다.
- 파일 위치 : 아무 것도 입력하지 않으면 id_rsa라는 키가 생성됩니다. 저는 다른 파일명으로 만들기 위해 입력했으며, **혹시 이름을 바꾸더라도 위치는 반드시 '유저 홈 디렉토리/.ssh/'를 지켜주셔야 합니다. **
- passphrase : 키를 사용하여 접속 시 입력할 비밀번호입니다. 입력하지 않으면 비밀번호가 생성되지 않습니다.
- passphrase again : 입력한 비밀번호를 재입력합니다. 입력하지 않았다면 똑같이 입력하지 않습니다.

![](https://velog.velcdn.com/images/shawnhansh/post/f2a1f141-d170-452e-b5ef-66e01c1b738f/image.png)

키가 생성되면 .ssh에 내가 생성한 키의 이름으로 두개의 파일이 생성되었습니다.
- keyForTest : private key. 접속을 요청할 클라이언트에서 OOO.pem의 형태로 보관합니다. 600권한을 갖습니다.
- keyForTest.pub : public key. 서버의 .ssh 경로에서 authorized_keys 이름으로 보관합니다. 644 권한을 갖습니다.

./로 표시되는 .ssh 경로는 700 권한으로 소유자에게만 권한이 있는 것을 확인할 수 있습니다.

### private key를 클라이언트로 옮기기

그럼 이제 private key인 keyForTest를 클라이언트로 옮겨주어야 합니다.
저는 일단 제 로컬을 클라이언트라고 가정하겠습니다.

scp나 sftp 등의 방법으로 파일을 옮기는 것이 가장 좋겠지만, 대부분 현재 상태에서는 해당 프로토콜이 차단되어있을 확률이 높습니다.
저는 간단하게 그냥 파일을 열어 내용을 복사하도록 할게요.

```
view keyForTest
```

view 명령어를 사용하면 익숙하지 않은 vim 환경에서 실수로 파일을 수정할 리스크에서 자유롭습니다!

![](https://velog.velcdn.com/images/shawnhansh/post/8790252c-4a32-4937-873d-83be3a71e466/image.png)

이렇게 생긴 private key의 내용을 복사해두겠습니다.

이제 로컬로 와서 똑같이 유저의 홈 디렉토리 아래에 .ssh 디렉토리로 이동합니다.
아마 git이나 aws를 이용할 경우 .ssh 디렉토리가 존재하지만 없을 경우 아래 명령어로 .ssh 경로를 생성하고 소유자를 제외한 모든 권한은 제외합니다.

```
mkdir .ssh
sudo chmod 700 .ssh
cd .ssh
vim 생성한 키 이름.pem
```
.ssh 경로에 생성한 키 이름.pem 이란 파일을 만들어 vim 편집기로 열고, 조금 전에 복사해두었던 private key의 내용을 붙여넣고 저장합니다.

```
chmod 600 생성한 키 이름.pem 
```

이 private key는 처음 생성되었을 때 처럼 600 권한으로 변경해줍니다.

![](https://velog.velcdn.com/images/shawnhansh/post/b25b90f1-5adf-4c51-80a1-ec93643cd527/image.png)

그럼 이제 클라이언트로 private key를 옮기는 모든 과정이 끝났습니다.

### public key 이름을 authorized_keys로 변경하기

```
mv keyForTest.pub authorized_keys
```
mv 명령어는 기본적으로 파일을 이동할 때 사용하는 명령어지만 이렇게 이름을 바꿀 때도 사용합니다.

```
rm -rf keyForTest
```

private key는 클라이언트로 잘 복사해두었으니까 삭제하겠습니다.

![](https://velog.velcdn.com/images/shawnhansh/post/a3a64682-df03-4ce5-8a10-38e5209205f4/image.png)

이제 서버에서 접속을 기다리는 유저의 .ssh 디렉토리에는 authorized_keys만 남았습니다.

### ssh 접속 시도하기

```
ssh -i pem파일 유저이름@호스트
```

비밀번호 방식으로 ssh 접속과는 다르게 -i 옵션과 pem 파일의 경로와 이름을 명시해주어야 합니다.

![](https://velog.velcdn.com/images/shawnhansh/post/ddad358c-98a2-4dbc-9db8-0465a9c6c196/image.png)

명령어를 입력하여 비밀번호 없이 키페어로 안전하게 접속했습니다.

어...
그런데 이거 명령어가 너무 긴데 이거를 어떻게 매번 입력해서 서버를 접속하냐구요?
config에 등록하여 간단하게 접속하는 방법이 있습니다!
[이 포스팅](https://velog.io/@shawnhansh/AWS-EC2-%EB%A7%A5%EC%97%90%EC%84%9C-SSH%EB%A1%9C-%EC%89%BD%EA%B2%8C-%EC%A0%91%EC%86%8D%ED%95%98%EA%B8%B0)에서 설명해두었으니 참고해보시면 좋을 것 같습니다 ㅎㅎ

---
참고 
- https://sang5c.github.io/SSH%EC%99%80-SSHD%EC%9D%98-%EC%B0%A8%EC%9D%B4/
- https://wooono.tistory.com/371
- https://shanepark.tistory.com/195
- https://zionh.tistory.com/14