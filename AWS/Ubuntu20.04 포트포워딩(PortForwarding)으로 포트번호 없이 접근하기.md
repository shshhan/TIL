
AWS EC2 인스턴스를 만들어서 내가 만든 프로젝트를 배포하고 EC2의 퍼블릭 ip로 접근할 때, tomcat에서 설정한 포트번호를 뒤에 붙여서 접근하게 된다. 개발을 할 때에도 항상 localhost:8080으로 접근하느라 미쳐 생각을 못하고 있었는데, 배포까지 한 마당에 갑자기 이런 생각이 들었었다.

> 보통의 웹 사이트 들은 주소만 입력하면 접근이 되는데 왜 내가 만든 프로젝트는 꼭 뒤에 포트번호를 붙여야 하는걸까?

이 의문을 통해 80포트와 443 포트, 포트포워딩에 대해 알게 되었고 ubuntu에서 포트번호 없이 주소만으로 접속하는 방법을 포스팅하려고 한다.

## 기본 포트

사실 원칙적으로 포트 번호 없이 ip로만 접속하는 것은 불가능하다.
이건 마치 친구네 집 놀러가는데 친구네 아파트 동만 알고 호수는 모르는 것과 똑같다.

하지만 친구가 "동까지만 와~ 내가 앞으로 마중 나갈게~"라고 말이 달라진다.
이럴 경우에는 동만 알아도 친구네 집에 놀러갈 수 있다.
http에서는 80포트, https에서는 443 포트가 바로 이 마중 나와주는 친구가 사는 호수이다.
80포트와 443포트는 각각 http와 https의 기본 포트이기 때문에, 포트번호 없이 ip 주소만 입력했을 경우 80포트와 443포트로 접속한 것과 같은 결과를 볼 수 있다.

## 포트포워딩

포트포워딩이란 어느 한 포트로 들어온 요청을 다른 포트로 전달해주는 것을 말한다.
마치 친구네 집에 갔는데 알고보니 그 집은 훼이크였고 그 집에 있는 비밀 통로로 들어갔더니 다른 집이 나오는 것과 비슷하다.

## 포트 번호 없이 ip 주소로만 접근하기

이걸 하기 위해서는 위에서 언급했던 기본 포트와 포트포워딩에 대한 개념이 필요하다.
바로 기본 포트로 접속했을 시 우리들의 프로젝트의 포트번호(예를 들면 8080)으로 포트포워딩을 해주면 접근해주는 방법으로 구현하기 때문이다.

![](https://images.velog.io/images/shawnhansh/post/25086424-7021-42e0-8456-c1adde357288/image.png)

위는 내가 직접 80포트를 8080포트로 포트 포워딩을 설정한 내용이다.

- 포트포워딩 조회하기
```
sudo iptables -t nat -L --line-numbers
```

- 포트포워딩 등록하기
```
sudo iptables -t nat -A PREROUTING -p tcp --dport [출발 포트번호] -j REDIRECT --to-port [도착 포트번호]
```
나의 경우는 기본 포트를 8080포트로 포워딩을 하기 때문에 [출발 포트번호]에 80, [도착 포트번호]에 8080을 넣어 아래와 같이 명령어를 입력했다.
```
sudo iptables -t nat -A PREROUTING -p tcp --dport 80 -j REDIRECT --to-port 8080
```

- 포트포워딩 삭제하기
```
sudo iptables -t nat -D PREROUTING [num]
```
등록된 포트포워딩을 조회해보고 삭제를 원할 경우 
이는 포트포워딩을 조회해보고 마음에 들지 않을 경우 등록된 포트포워딩의 num 값을 입력 하면 된다.
캡쳐를 보면 내가 등록한 포트포워딩 내용의 num값이 1이므로 해당 포트포워딩을 삭제하고 싶으면 아래와 같이 [num] 대신 1을 입력하면 된다.
```
sudo iptables -t nat -D PREROUTING 1
```


등록을 무사히 마쳤다면 이제 EC2의 퍼블릭 ip에 아무 포트 번호를 붙이지 않아도 내가 설정한 포트포워딩에 따라 나의 프로젝트로 접근이 가능해진다!

## 재부팅해도 포트포워딩 설정 유지하기

포트포워딩 설정을 마쳤지만 아쉽게도 이렇게 설정한 포트포워딩은 재부팅 시 리셋된다.
해당 설정을 재부팅 후에도 계속 유지하고 싶다면 새로운 패키지를 하나 다운받아야한다.

```
sudo apt update && sudo apt upgrade
```
apt를 이용해 다운 받을 예정이기 때문에 일단 update와 upgrade를 수행해준다.

```
sudo apt install iptables-persistent
```

![](https://velog.velcdn.com/images/shawnhansh/post/6a058647-1d60-4506-b9e7-384f1e03276e/image.png)

명령어를 입력하면 다운로드를 받던 중 계속 할 것인지 물어본다. 당연히 Y를 입력해서 계속 진행한다.

![](https://velog.velcdn.com/images/shawnhansh/post/315716f2-a48e-490b-8eb6-f88aa6bad5f6/image.png)

![](https://velog.velcdn.com/images/shawnhansh/post/6707fddb-11a5-415c-8dfc-85b98ce9bdfb/image.png)

계속 진행할 경우 위와 같은 화면들이 나타나면 되는데, IPv4와 IPv6에 대한 설정 정보를 저장할 거고 재부팅 시 자동으로 설정할 것이라는 내용이다. 추가적으로 자동 저장은 패키지를 설치할 때만 적용되고, 이후의 수동 저장은 따로 매뉴얼을 참고하라고 한다.
여기서도 당연히 모두 yes를 눌러 계속한다.

```
sudo systemctl is-enabled netfilter-persistent.service
```
저장이 가능한 상태인지 파악한다.

![](https://velog.velcdn.com/images/shawnhansh/post/bb75e075-778c-4cbf-8ca1-9651bdd831bb/image.png)

```
sudo systemctl enabled netfilter-persistent.service
```

설치 후에는 기본적으로 enabled이지만 혹시 아닐 경우 아래 명령어를 통해 활성화 시켜준다.

```
sudo netfilter-persistent save
```
패키지를 설치할 때 저장이 되었겠지만 위 명령어를 통해 한번 더 확실하게 현재 iptables 상태를 저장한다.

![](https://velog.velcdn.com/images/shawnhansh/post/92d0a9c0-0344-4450-be7c-cb5245963382/image.png)

## 그냥 우리 프로젝트를 80포트로 지정하면 안되나요?

이런 의문이 당연히 생길 수 있다. 결론부터 말하자면 할 수는 있지만 안하는 편이 좋다.

잘 알려진 포트(Well Known Port)라는 것이 있다. 1번부터 1023번 까지의 포트를 부르는 용어인데, root 권한으로만 포트를 컨트롤 할 수 있고, 이미 많이 사용되는 만큼 우리가 함부로 사용했다가는 미쳐 예상치 못한 일들이 발생할 수 있기 때문에 건드리지 않는 편이 좋다고 한다. Well Known Port에 대한 더욱 자세한 내용은 [이곳](https://m.blog.naver.com/PostView.naver?isHttpsRedirect=true&blogId=hyr903&logNo=221094297673)에서 확인 할 수 있다.


---
참고
- https://johngrib.github.io/wiki/why-http-80-https-443/
- https://m.blog.naver.com/PostView.naver?isHttpsRedirect=true&blogId=hyr903&logNo=221094297673
- https://hays99.tistory.com/84
- https://ecogis.tistory.com/84
- https://steady-snail.tistory.com/153
- https://ndb796.tistory.com/262