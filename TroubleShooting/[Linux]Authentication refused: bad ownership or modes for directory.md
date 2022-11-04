## 오류상황

금요일 오후 다섯시.
'이번 주도 무사히 지나갔다' 하는 생각을 하던 즈음 한통의 전화가 걸려왔습니다.

협력사에서 key 인증 방식으로 우리 회사 서버에 접속해서 파일을 가져갔는데, 갑자기 오늘 오후부터 접근 권한 문제로 접속이 안되고 비밀번호를 요구하여 업무 처리가 안되고 있다는 전화였습니다.

서버 담당자분께 해당 내용을 말씀드렸더니 /var/log/secure에서 아래와 같은 로그를 확인했다고 전해주셨습니다.
> Authentication refused: bad ownership or modes for directory

## 오류원인

구글링을 통해 알아낸 정보에 의하면 Key 인증 방식으로 접근을 할 때 ~/.ssh 디렉토리의 사용자 또는 소유자에게만 w 권한이 있을 때 정상적으로 접근이 가능하다고 합니다. 만약 그렇지 않을 경우, key를 갖고 있어도 비밀번호를 요구한다고 합니다.

기존 해당 경로는 소유자에게만 rwx(707) 권한이 있는 상태였는데, 서버 담당자분께서 오늘 점심 시간 직전 다른 사용자에게 rwx권한을 열어준 것이 원인이었습니다.


## 오류 해결

다시 해당 디렉토리의 권한을 700으로 돌려 놓은 뒤 협력사에서 정상적으로 접근이 가능해졌다는 연락을 받았습니다.


---
참고
https://m.blog.naver.com/kamagod/150129032252
https://www.dell.com/support/kbdoc/ko-kr/000061728/isilon-onefs-ssh%EB%A5%BC-%ED%86%B5%ED%95%B4-%ED%81%B4%EB%9F%AC%EC%8A%A4%ED%84%B0%EC%97%90-%EC%97%B0%EA%B2%B0%ED%95%98%EB%A0%A4%EA%B3%A0-%ED%95%A0-%EB%95%8C-authentication-refused-bad-ownership-or-modes-for-directory-ifs-home-user-ssh-%EC%98%A4%EB%A5%98-%EB%B0%9C%EC%83%9D