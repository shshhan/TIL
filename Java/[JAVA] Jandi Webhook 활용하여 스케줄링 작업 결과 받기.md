회사에서의 많은 업무 중 하나는 배치 등의 스케줄링 작업이 제대로 수행되었는지 확인하는 작업입니다.
서비스에 아주 중요한 업무이지만 매일 반복적인데다가 현재 회사에서는 직접 서버에 접속하여 하나하나 결과를 확인해야 해서 시간을 많이 할애해야 했습니다.
이 시간을 줄이면 다른 업무에 더 많은 시간을 투자할 수 있을 것 같아서 이 프로세스에 대한 비용을 줄여보고자 잔디 Webhook을 도입해보았습니다.

## Webhook이란?

Webhook은 서버에서 특정 이벤트가 발생했을 때 클라이언트로 해당 정보를 제공해주기 위한 방법입니다.

클라이언트에서 서버로 요청을 보내면 서버에서 이에 대한 응답을 보내주는 것이 일반적인 HTTP 통신이죠. 하지만 Webhook은 그 반대로 클라이언트의 요청 없이 서버에서 Callback URL로 메시지를 보낼 수 있습니다.

### 잔디 Webhook

잔디에서도 토픽(하나의 대화방 개념)별로 Webhook 기능을 제공하고 있습니다.
> 
웹훅(Webhook)이란 잔디에 잔디가 정한 포맷에 일치하는 데이터를 수신하여 지정된 대화에 메시지 형태로 전송해주는 기능을 말합니다. 현재 잔디 커넥트에서 지원하지 않고 있는 서비스라도 해당 서비스에서 웹훅 발신(Outgoing Webhook)을 지원하는 경우, 잔디와 연동하여 변동 사항에 대해 메시지를 수신할 수 있습니다.
출처 : [잔디](https://support.jandi.com/ko/articles/6352697-%EC%9E%94%EB%94%94-%EC%BB%A4%EB%84%A5%ED%8A%B8-%EC%9D%B8%EC%BB%A4%EB%B0%8D-%EC%9B%B9%ED%9B%85-incoming-webhook-%EC%9C%BC%EB%A1%9C-%EC%99%B8%EB%B6%80-%EB%8D%B0%EC%9D%B4%ED%84%B0%EB%A5%BC-%EC%9E%94%EB%94%94%EB%A1%9C-%EC%88%98%EC%8B%A0%ED%95%98%EA%B3%A0-%EC%8B%B6%EC%8A%B5%EB%8B%88%EB%8B%A4)

저는 이 잔디 Webhook을 통해 제가 확인하고 싶은 배치 작업의 성공 여부와 해당 정보를 잔디에서 메시지로 확인해보겠습니다.

## 소스 코드

최근 열심히 OOP 공부를 했기 때문에 고민하며 아래와 같은 구조로 소스를 작성해봤습니다.

### Noticeable.java

우선 추후에 회사 메신저가 변경되거나 알림을 받는 수단이 변경될 수 있으니 알림 발송 기능을 추상화하여 인터페이스로 먼저 작성했습니다.

```java
public interface Noticeable {
    void sendNotice(String bodyMsg, String title) throws Exception;
    void sendError(String bodyMsg, String title) throws Exception;
}
```

### NoticeSenderFactory.java

또한 알림을 전달하는 수단이 변경되어도 비즈니스 로직 수정을 최소화 하기 위해 Factory 패턴을 적용하였습니다.

```java
import java.util.Properties;

public class NoticeSenderFactory {

    private Properties props;

    public NoticeSenderFactory(Properties props) {
        this.props = props;
    }

    public Noticeable getNoticeSender(String whichNoticeSender) {
        switch(whichNoticeSender){
            case "jandi" :
                return createJandiWebhookSender();
            default :
                return null;
        }
    }

    private Noticeable createJandiWebhookSender() {
        return new JandiWebhookSender(props.get("jandi.webhook.url").toString());
    }
}

```
getNoticeSender의 파라미터에 맞춰 적절한 Noticeable의 구현체를 return 하도록 구현했는데, 이 파라미터는 비즈니스 로직에서 proeprties의 데이터를 인자로 보내주는 값으로 아래와 같이 구현했습니다.
```
//properties 파일 내용

...
notice.which=jandi
jandi.webhook.url=https://wh.jandi.com/connect-api/webhook/xxxxx
...
```

``` java
// 비즈니스 로직 내용

private Noticeable noticeable;
...
Properties props = new Properties();
props.load(new FileInputStream(properties 경로);
...
noticeable = new NoticeSenderFactory(props).getNoticeSender(props.getProperty("notice.which"));
...
noticeable.sendNotice("New Currency Download Completed.", fileName);
...
noticeable.sendError("Error Occurred On Downloading Currency. Please Refer Log File.", e.getMessage());
...

```

이렇게 처리할 경우 추후 새로운 알림 수단에 대한 코드가 작성될 경우에도 해당 클래스가 Noticeable의 구현체라면 메인 비즈니스 로직의 변경 없이 properties의 값만 바꾸어 바로 적용이 가능한 장점이 있습니다!

### JandiWebhookSender.java

```java
import java.util.HashMap;
import java.util.Map;

public class JandiWebhookSender implements Noticeable {
    private String webhookUrl;

    public JandiWebhookSender(String webhookUrl) {
        this.webhookUrl = webhookUrl;
    }

    @Override
    public void sendNotice(String bodyMsg, String title) throws Exception {
        System.out.println("jandi sendNotice result : " + new HttpClient().sendPost(webhookUrl, setHeader(), setBody(bodyMsg, NoticeStatus.NORMAL.colorHex(), title)));
    }

    @Override
    public void sendError(String bodyMsg, String title) throws Exception {
        System.out.println("jandi sendError reulst : " + new HttpClient().sendPost(webhookUrl, setHeader(),setBody(bodyMsg, NoticeStatus.EXCEPTION.colorHex(), title)));
    }

    private String setBody(String bodyMsg, String colorHex, String title) {
        String body = "{\n" +
                "    \"body\": \"" + bodyMsg + "\",\n" +
                "    \"connectColor\": \"" + colorHex + "\",\n" +
                "    \"connectInfo\": [\n" +
                "        {\n" +
                "            \"title\": \"" + title + "\"\n" +
                "        }\n" +
                "    ]\n" +
                "}"
                ;
        return body;
    }

    private Map<String, String> setHeader() {
        Map<String, String> headerMap = new HashMap<>();
        headerMap.put("Accept", "application/vnd.tosslab.jandi-v2+json");
        headerMap.put("Content-Type","application/json");

        return headerMap;
    }
}
```

Noticeable 인터페이스의 구현체인 JandiWebhookSender에서는 sendNotice와 sendError을 override하여 구현했고, http 헤더와 바디를 만들기 위한 메서드를 private으로 별도 구현했습니다.
필요한 헤더와 바디의 내용 등은 모두 [잔디 인커밍 웹훅 매뉴얼](https://support.jandi.com/ko/articles/6352697-%EC%9E%94%EB%94%94-%EC%BB%A4%EB%84%A5%ED%8A%B8-%EC%9D%B8%EC%BB%A4%EB%B0%8D-%EC%9B%B9%ED%9B%85-incoming-webhook-%EC%9C%BC%EB%A1%9C-%EC%99%B8%EB%B6%80-%EB%8D%B0%EC%9D%B4%ED%84%B0%EB%A5%BC-%EC%9E%94%EB%94%94%EB%A1%9C-%EC%88%98%EC%8B%A0%ED%95%98%EA%B3%A0-%EC%8B%B6%EC%8A%B5%EB%8B%88%EB%8B%A4)에 있으니 참고 부탁드립니다.

### NoticeStatus.java

```java
public enum NoticeStatus {
    NORMAL("#049C96")
    , EXCEPTION("#Ea1515");

    private final String colorHex;

    NoticeStatus(String colorHex) {
        this.colorHex = colorHex;
    }

    public String colorHex() {
        return colorHex;
    }

}

```
잔디 Webhook을 이용하면 hex 값을 통해 메시지에 색깔을 넣어줄 수 있기 때문에 메시지 확인 시 정상과 에러를 직관적으로 확인하고 싶어 색상 Hex 값을 필드로 가진 상태값을 Enum 클래스로 생성했습니다.

이번에 Enum을 활용하며 구현체 로직에서 지저분한 코드를 많이 없앴는데, 이는 추후에 Enum에 대해 조금 더 공부해보고 포스팅해보겠습니다.

### HttpClient.java

```java
import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStreamReader;
import java.io.OutputStreamWriter;
import java.net.HttpURLConnection;
import java.net.URL;
import java.util.Iterator;
import java.util.Map;

public class HttpClient {
    private URL url;
    HttpURLConnection con;

    public String sendPost(String apiURL, Map<String, String> headerMap, String bodyString) throws IOException {
        String responseString = "";

        urlConSetup(apiURL);
        con.setRequestMethod("POST");
        con.setDoOutput(true);
        con.setDoInput(true);
        headerSetup(headerMap);
        bodySetup(bodyString);
        return sendRequest();
    }

    private String sendRequest() throws IOException {
        StringBuilder sb = new StringBuilder();
        if (isConnectionOK()) {
            getResponse(sb);
        } else {
            System.out.println("responseCode : " + con.getResponseCode());
            System.out.println(con.getResponseMessage());
        }
        return sb.toString();
    }
    

    private void getResponse(StringBuilder sb) throws IOException {
        BufferedReader br = new BufferedReader(new InputStreamReader(con.getInputStream(), "utf-8"));
        String line;
        while ((line = br.readLine()) != null) {
            sb.append(line).append("\n");
        }
        br.close();
    }

    private boolean isConnectionOK() throws IOException {
        return con.getResponseCode() == HttpURLConnection.HTTP_OK;
    }

    private void bodySetup(String bodyString) throws IOException {
        OutputStreamWriter wr = new OutputStreamWriter(con.getOutputStream());
        System.out.println("<<Request Body>>");
        System.out.println(bodyString);
        wr.write(bodyString);
        wr.flush();
    }
    private void headerSetup(Map<String, String> headerMap) {
        System.out.println("<<Request Header>>");
        Iterator<Map.Entry<String, String>> iterator = headerMap.entrySet().iterator();
        while(iterator.hasNext()){
            Map.Entry<String, String> next = iterator.next();
            String nextKey = next.getKey();
            String nextVal = next.getValue();
            System.out.println(nextKey + " : " + nextVal);
            con.setRequestProperty(nextKey, nextVal);
        }
    }

    private void urlConSetup(String apiURL) throws IOException {
        url = new URL(apiURL);
        con = (HttpURLConnection)url.openConnection();
        con.setConnectTimeout(5000); // Connection Timeout 설정
        con.setReadTimeout(5000); // Read Timeout 설정
    }

}
```
http 통신은 조금 원시적인 방법으로 구현했습니다.
이 기능이 비동기가 필요한 기능도 아닐 뿐더러 사내 서버 환경이 프레임워크 없는 자바 1.7이다 보니 현재는 deprecated 된 RestTemplate 마저 구현하는데 코스트가 너무 크다고 판단했습니다.

구현하시는 환경에서 더 적합한 http 통신 모듈을 이미 사용 중이시라면 어떤 방식을 사용해도 무관할 것 같습니다.

## 마무리

![](https://velog.velcdn.com/images/shawnhansh/post/2f274f3d-d73b-4e70-9474-98d6fc1890ff/image.png)

서버에 접속하여 로그나 DB를 확인하는 등의 일련의 작업이 사라진 것은 물론, 다른 업무 중 배치 결과 확인을 위해 업무를 중단하지 않아도 되어 무척이나 편리해졌습니다. 당연히 장애 발생 시에는 하나하나 확인해야하긴 하지만요..ㅎㅎ
그래도 업무 시간 중 신경써야 할 요소를 줄이고 더 중요한 일에 집중할 수 있도록 주변 환경을 한번 더 정리한 것에 큰 만족을 느끼고 있습니다.

배치 결과 뿐 아니라 회사 업무에서 다양한 방법으로 쓰일 수 있을 것 같으니 많이 활용해보세요!