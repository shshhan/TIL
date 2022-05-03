EC2에서 gradle을 사용하면서 아래 캡처와 같이 끝나지 않고 계속해서 수행되다가 결국은 서버가 뻗어버리는 현상이 자주 발생했다.

![](https://velog.velcdn.com/images/shawnhansh/post/1bcdacb8-f372-409f-af9f-940f5f5973ac/image.png)

compile이나 test 중에 이런 현상이 잦았는데, 이렇게 멈춰버리면 수행 취소도 안되고 다른 터미널에서는 접속도 안되는 답이 없는 상황으로 흘러가서 결국 EC2 인스턴스를 재시작해야했다.

지금까지는 이게 내가 짠 코드에 문제가 있거나 환경이 안맞아서 생기는 오류라고 생각했는데, 검색을 하다보니 혹시 **메모리 부족** 때문에 생기는 현상이 아닐까 생각이 들었다.

![](https://velog.velcdn.com/images/shawnhansh/post/a012c5ae-76b8-4664-b369-3f90b6b0ef6f/image.png)

AWS에서 프리티어로 제공하는 t2.micro의 메모리는 고작 1GB이다.

![](https://velog.velcdn.com/images/shawnhansh/post/c75ca91d-d8d8-47ef-9078-266b3ebfa930/image.png)

gradle 멈춤 현상으로 검색을 하다보니 gradle은 아니지만 내 경우처럼 프로세스 중에 서버가 먹통이 된 경우를 찾을 수 있었고, **스왑파일을 사용하여 메모리를 할당**해주는 방법으로 대부분 해결을 한 것으로 보였다.

## 스왑 파일 생성하기

ubuntu 공식 문서에 의하면 메모리가 1기가 이하일 경우 스왑 메모리는 최소 실제 RAM 메모리 크기만큼 할당 하는 것이 좋고, 디스크 용량의 문제가 없다면 두 배의 메모리를 할당하는 것을 권장한다. 그래서 나는 2기가를 할당했다.

![](https://velog.velcdn.com/images/shawnhansh/post/15888cc3-f44a-4b29-8818-8cc2de05b3be/image.png)

```
free
```
스왑 파일을 생성하기 전에 메모리를 확인해보았다.

이후의 과정은 AWS 공식 문서에서 명령어들을 친절하게 알려주고 있어 따라하기만 하면 됐다.

```
sudo dd if=/dev/zero of=/swapfile bs=128M count=16
```
스왑 파일을 생성하는 명령어이다.
AWS 공식문서에서는 4GB의 크기의 스왑파일로 예제를 제공한다.
bs*count만큼 메모리가 할당되는 명령어이기 때문에, 나는 count를 절반 줄인 16으로 변경하고 2GB 크기의 스왑 파일을 생성했다.

```
sudo chmod 600 /swapfile
```
스왑 파일의 읽기 및 쓰기 권한을 업데이트 한다.

```
sudo mkswap /swapfile
```
Linux 스왑 영역을 설정한다.

```
sudo swapon /swapfile
```
스왑 공간에 스왑 파일을 추가하여 즉시 사용할 수 있도록 한다.

```
sudo swapon -s
```
프로시저의 상태를 확인한다.
방금전에 생성한 파일이 보이면 성공이다.

```
sudo vim /etc/fstab
```
vi 편집기로 위 파일을 열고 마지막 줄에 아래의 내용을 추가해준다.
/swapfile swap swap defaults 0 0

![](https://velog.velcdn.com/images/shawnhansh/post/8da88bad-664a-4b07-b6cc-c4645eed0157/image.png)

부팅 시 스왑 파일을 시작하는 설정이다.

## 스왑 파일 적용을 마치고

![](https://velog.velcdn.com/images/shawnhansh/post/b5b677da-9243-4123-b77c-5a734590ed6a/image.png)

평상시의 상태를 보면 많이는 스왑 메모리를 일부 사용하며 RAM은 약간의 여유가 생긴다.
또한 스왑 파일로 메모리를 추가 할당한 뒤로는 gradle에서 같은 문제가 아직까지는 반복되지 않았다.

EC2 프리티어로 서버를 사용할 수 있다는건 큰 장점이지만 성능이 아쉬운건 사실이다.
나중에 더 고성능이 필요할 때는 비용을 지불하고 고성능 서버를 이용해야겠지만, 아직 내 수준에서는 이렇게라도 메모리를 늘려서 사용하는 것이 경제적이고 현실적인 방법인 것 같다.

---
참고
- https://aws.amazon.com/ko/premiumsupport/knowledge-center/ec2-memory-swap-file/
- https://help.ubuntu.com/community/SwapFaq#How_much_swap_do_I_need.3F
- https://sundries-in-myidea.tistory.com/102
- https://okky.kr/article/884329