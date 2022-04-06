빠르게 문제해결만 원하시는 분들은 아래의 코드를 web.xml에 붙여 넣으시면 됩니다.
```
<filter>
	<filter-name>encodingFilter</filter-name>
    <filter-class>
    	org.springframework.web.filter.CharacterEncodingFilter
	</filter-class>

	<init-param>
		<param-name>encoding</param-name>
		<param-value>UTF-8</param-value>
    </init-param>

	<init-param>
		<param-name>forceEncoding</param-name>
		<param-value>true</param-value>
	</init-param>
</filter>

<filter-mapping>
	<filter-name>encodingFilter</filter-name>
	<url-pattern>/*</url-pattern>
</filter-mapping>
```
---

지난번 EC2를 공격당한 뒤로 종종 서버에 들어가서 이상 징후는 없는지 확인하는 것이 습관이 되었다. 그러면서 자연스레 서비스를 이용해보기도 하는데 이번에 아주 뜻밖의 문제를 발견했다.
바로 리뷰를 작성 할 때만 한글이 깨지는 것..!

![](https://imagedelivery.net/v7-TZByhOiJbNM9RaUdzSA/fbad2c70-863e-4f48-7ad4-2c7eec36b300/public)

혹시나 하고 게시판이나 닉네임 변경 등 다른 input 태그에 한글을 입력해봤지만 다른 곳은 아주 멀쩡했고 오직 리뷰에서만 문제가 생겼다.


![](https://imagedelivery.net/v7-TZByhOiJbNM9RaUdzSA/1db8383e-fb4d-47c4-fe43-585c2a6db000/public)

로그를 확인해보니 컨트롤러에서 파라미터로 값을 전달 받을 때 이미 한글이 깨진 상태로 전달받는다.

## 프론트에서는 제대로 넘어간걸까?

일단 프론트에서 서버로 넘어갈 때는 제대로 넘어가는지 확인해보기 위해 form의 submit 기능을 막고 내부 내용을 살펴보았다.

```jsx
// jquery
let regReviewForm = $("#reg_review_form");
alert(regReviewForm.serialize());
```
jQuery의 .serialze()로 간편하게 form의 데이터를 쿼리스트링 형식으로 만들 수 있다. submit 기능을 막고 위 코드를 수행시켜 어떤 데이터가 넘어가는지 확인해보았다.

![](https://imagedelivery.net/v7-TZByhOiJbNM9RaUdzSA/68abb061-38ba-4c61-ee3c-7d83de2e0800/public)

key 값이 content인 부분을 확인해보니 한글이 인코딩 된 형태였다.


```jsx
let regReviewContent = document.getElementById('review_content').value;
alert(regReviewContent);
```

jquery를 사용하지 않는 프로젝트라면 위와 같이 textarea의 값을 가져와서 확인해보는 방법을 활용할 수도 있다.

![](https://imagedelivery.net/v7-TZByhOiJbNM9RaUdzSA/90099cd7-f94f-4dc2-acc9-75e19a731d00/public)

textarea의 값 역시 정상적으로 한글이 제대로 들어간 것을 확인할 수 있다.

이렇게 프론트단에서의 한글입력과 서버로의 전송에는 문제가 없는걸 확인할 수 있었다.

## 서버에서는 제대로 받나?

다른 곳에서는 문제가 생기지 않아서 해당 jsp내부의 문제이거나 리뷰 내용을 입력받는 textarea가 문제이지 않을까 생각했지만 아닌 것을 확인했다.

하지만 한글이 깨지지 않는 다른 form이나 textarea와의 차이점은 전혀 없었고 구글링을 해도 원인을 찾기는 힘들었다. 그러던 중 filter를 활용한 확실한 해결방법을 찾아냈다.

```
<filter>
	<filter-name>encodingFilter</filter-name>
    <filter-class>
    	org.springframework.web.filter.CharacterEncodingFilter
	</filter-class>

	<init-param>
		<param-name>encoding</param-name>
		<param-value>UTF-8</param-value>
    </init-param>

	<init-param>
		<param-name>forceEncoding</param-name>
		<param-value>true</param-value>
	</init-param>
</filter>

<filter-mapping>
	<filter-name>encodingFilter</filter-name>
	<url-pattern>/*</url-pattern>
</filter-mapping>
```

org.springframework.web.filter.CharacterEncodingFilter에 encoding 파라미터를 UTF-8, forceEncoding 파라미터를 true로 설정한 뒤 모든 경로에 해당 필터를 적용하는 내용이다.

인터셉터는 Dispatcher Servlet에서 컨트롤러로 사이에서 요청을 가로챈다면 필터는 클라이언트의 요청이 Dispatcher Servelt에 도달하기 전에 요청을 가로챈다는 차이점이 있다.
인터셉터와 필터에 대한 내용은 [이곳](https://mangkyu.tistory.com/173)에서 더욱 자세히 확인해 볼 수 있다.

위 코드와 같이 web.xml에 필터를 등록하게 된다면 설정한 경로에 해당 필터가 동작한다.

## CharacterEncodingFilter가 어떻게 동작하는걸까?

CharacterEncodingFilter는 스프링에서 제공하는 필터용 클래스이고 OncePerRequestFilter를 extends하고 있다.

OncePerRequestFilter는 필터의 중복 수행에 대한 문제를 예방하기 위해 구현된 단 한번 실행되는 필터이고, doFilterInternal 메서드를 수행한다.

아래는 CharacterEncodingFilter 클래스를 확인해보고 web.xml에서 설정한 내용이 적용되는 부분만 가져온 코드이다.


```java
public class CharacterEncodingFilter extends OncePerRequestFilter {
    @Nullable
    private String encoding;
    private boolean forceRequestEncoding;
    private boolean forceResponseEncoding;

  ...
  ...

    public CharacterEncodingFilter(String encoding, boolean forceEncoding) {
        this(encoding, forceEncoding, forceEncoding);
    }

    public CharacterEncodingFilter(String encoding, boolean forceRequestEncoding, boolean forceResponseEncoding) {
        this.forceRequestEncoding = false;
        this.forceResponseEncoding = false;
        Assert.hasLength(encoding, "Encoding must not be empty");
        this.encoding = encoding;
        this.forceRequestEncoding = forceRequestEncoding;
        this.forceResponseEncoding = forceResponseEncoding;
    }

  ...
  ...
  
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain) throws ServletException, IOException {
        String encoding = this.getEncoding();
        if (encoding != null) {
            if (this.isForceRequestEncoding() || request.getCharacterEncoding() == null) {
                request.setCharacterEncoding(encoding);
            }

            if (this.isForceResponseEncoding()) {
                response.setCharacterEncoding(encoding);
            }
        }

        filterChain.doFilter(request, response);
    }
}

```
init-param 으로 encoding과 forceEncoding을 정의했기 때문에 파라미터가 두개인 생성자가 호출되고, 이는 파라미터가 세개인 생성자를 다시 호출하며 아래와 같이 필드가 정의된다.
- encoding : "UTF-8"
- forceRequestEncoding : true
- forceResponseEncoding : true

doFilterInternal 메서드 내부에는 결과적으로  request.setCharacterEncoding("UTF-8")이 적용되도록 구현되어있다.

즉, 모든 요청에 대해 request.setCharacterEncoding("UTF-8")이 수행되는 것과 같은 역할을 하고 있다고 볼 수 있겠다.

## CharacterEncodingFilter 적용 이후

![](https://imagedelivery.net/v7-TZByhOiJbNM9RaUdzSA/0c61afe6-8d05-4e85-a4e1-908ec7b5fb00/public)

![](https://imagedelivery.net/v7-TZByhOiJbNM9RaUdzSA/2298c69b-2b86-4469-89c3-ecfc04c95200/public)

컨트롤러에서 한글 깨짐없이 정상적으로 한글을 받았고, 서비스 화면을 통해서도 처리가 완료된 것을 확인할 수 있었다.



---
참고
- https://homesi.tistory.com/entry/Spring에서-한글깨짐-방지를-위해-webxml에서-한글-설정
- https://mangkyu.tistory.com/173
- https://pgnt.tistory.com/102