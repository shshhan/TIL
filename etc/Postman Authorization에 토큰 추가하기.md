최근 회사에서 포스트맨을 활용하여 API를 테스트를 할 일이 있었습니다.

제가 테스트 해야 하는 API는 유저의 권한을 확인하여 인증, 인가가 이루어졌는데요.
이 기회에 로그인을 통해 획득한 token 값을 header에 추가하여 API 요청을 보내는 방법에 대해 정리해보려고 합니다.

기존에 알고 있던 일반적으로 많이 사용하는 방식(Bearer Token)과 새롭게 알게 된 key value를 원하는 대로 설정할 수 있는 방식(API Key)에 대해 알아보고, 추가적으로 이 두 방식을 활용하기 위해 필요한 Response Header 파싱 및 포스트맨 전역변수 설정에 대해 알아보겠습니다 :)

## Bearer Token 방식

토큰의 값을 전역변수에 저장 후 Authorization - Bearer Token에 대입하는 방법입니다.

포스트맨에서 로그인 후 토큰 값을 자동으로 설정하는 방법을 검색하면 대부분 이 방법을 알려주는데요.. 저는 아쉽게도 Header에 추가하는 Key와 값을 처리하는 방식이 달라 사용할 수 없었습니다.

![](https://velog.velcdn.com/images/shawnhansh/post/8ade7189-30dc-4074-9048-117efcbee6d9/image.png)

예를 들어 "12345"라는 문자열을 저장해보도록 하겠습니다.

이렇게 할 경우 포스트맨에서는 "Bearer"이라는 문자열에 토큰 값을 붙여 Request Header의 "Authorization"이라는 키에 담아 서버로 전송하게 됩니다.

![](https://velog.velcdn.com/images/shawnhansh/post/9bf39b84-56da-4553-9e6b-12c965f37039/image.png)

정말 "Authorization"이라는 키에 담겨 전송되는지 확인해보겠습니다.
Headers를 클릭 한 후 "9 hidden"이라고 적혀있는 버튼을 클릭합니다.
(해당 버튼은 상황에 따라 9가 아닌 다른 숫자가 적혀있을 수도 있습니다.)

![](https://velog.velcdn.com/images/shawnhansh/post/f993f6d4-c552-477b-b9f2-96324fe91fd1/image.png)

## API Key 방식

저희 회사 프로젝트는 토큰의 값을 "Authorization"이 아닌 다른 이름의 Key를 파싱하고, 토큰 값 앞에 Bearer를 붙이지 않습니다.

이럴 경우 API Key 방식을 사용하면 원하는 대로 Key와 Value를 Request Header에 추가할 수 있습니다.

![](https://velog.velcdn.com/images/shawnhansh/post/b0c4abe2-ac4a-4c19-b5c1-20b70167c318/image.png)

임의로 Key에 "Token Key", Value에 포스트맨 전역변수 token을 넣어주었습니다.
(전역변수에 값을 설정하는 것은 아래에서 추가 설명하겠습니다.)

![](https://velog.velcdn.com/images/shawnhansh/post/656a635d-3adc-482a-a8dc-44c18091c107/image.png)

다시 Headers로 돌아와 숨겨진 header를 전부 확인해보면 방금 Authorization에서 설정한 key와 value가 Request Header에 제대로 잘 들어간 것을 확인할 수 있습니다.


## Response Header에서 특정 값 파싱 후 전역변수 설정하기

위 API Key 방식에서 value에 넣은 {{token}}은 포스트맨의 전역변수 token의 값을 표현한 표현식입니다.

그렇다면 이 전역변수를 설정하는 방법을 알아보도록 하겠습니다.

![](https://velog.velcdn.com/images/shawnhansh/post/ff1cab9f-9ae0-4dfb-8b93-8a64a1581086/image.png)

포스트맨으로 로그인 요청을 보냈습니다.
응답 부분에서 Headers를 클릭하여 Response Header를 확인 할 수 있습니다.
이제 여기에서 API로 요청을 보낼 경우 인증과 인가에 필요한 "accesstoken" 값을 획득해 볼게요.


``` javascript
postman.setGlobalVariable('token', postman.getResponseHeader('accesstoken'));

console.log(postman.getGlobalVariable('token'));
```

Response Header에서 "accesstoken" 값을 포스트맨의 전역변수 "token"에 할당한 뒤, 제대로 저장되었는지 확인을 위해 전역변수 "token"의 값을 출력하는 코드입니다.

![](https://velog.velcdn.com/images/shawnhansh/post/ba1e0900-66cd-4000-8b64-d501ea912845/image.png)

Request를 작성하는 곳의 Tests를 클릭하여 위의 코드를 넣으면 매번 이 요청을 보낼 때마다 포스트맨의 전역변수로 accesstoken의 값이 들어가게 됩니다.

![](https://velog.velcdn.com/images/shawnhansh/post/f49f785a-bee8-4f05-8dbf-e54f3d3c17af/image.png)

요청을 보낸 뒤 하단에 console 버튼을 클릭하면 코드상 출력했던 token 값이 정상적으로 출력 되는 것도 확인할 수 있습니다.

---
참고
https://learning.postman.com/docs/sending-requests/authorization/