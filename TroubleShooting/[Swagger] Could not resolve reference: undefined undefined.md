## 오류 상황

![](https://velog.velcdn.com/images/shawnhansh/post/9cb70543-f415-4d62-9089-ff320f7012c6/image.png)

Swagger를 처음 사용해보며 마주친 오류입니다.
분명히 Swagger 설정도 잘 했고, 관련 어노테이션도 맞게 잘 적었는데 자꾸 JoinRequestDto가 포함된 API를 오픈할 때면 위와 같은 오류가 발생했어요.

![](https://velog.velcdn.com/images/shawnhansh/post/adc13e31-7b5b-4d07-813b-277474f40c1b/image.png)

응답 부분에서도 example 부분이 아예 표시되지 않았습니다.

### DTO
``` java
@Schema(description = "회원가입 요청 DTO 객체")
@Getter
@ToString
@NoArgsConstructor
public class JoinRequestDto {

    @Schema(description = "이메일", example = "joinTest@withme.com", required = true)
    @NotBlank
    @Email(message = "이메일 형식에 맞추어 입력해주세요.")
    @Size(min = 1, max = 100, message = "이메일은 100자 이내로 입력해주세요.")
    private String email;

    @Schema(description = "비밀번호", example = "1234qwer%T", required = true)
    @JsonProperty(access = JsonProperty.Access.WRITE_ONLY)
    @NotBlank
    @Size(min = 8, max = 30, message = "비밀번호는 8글자 이상 30글자 이하입니다.")
    private String password;

    @Schema(description = "닉네임", example = "vV위드미Vv", required = true)
    @NotBlank
    @Size(min = 2, max = 8, message = "닉네임은 2글자 이상 8글자 이하입니다.")
    private String nickname;

    @Builder
    public JoinRequestDto(String email, String password, String nickname){
        this.email = email;
        this.password = password;
        this.nickname = nickname;
    }

    public User toEntity(){
        return User.builder()
                .email(this.email)
                .password(this.password)
                .nickname(this.nickname)
                .activated(true)
                .userImage(null)
                .role("ROLE_USER")
                .build();
    }

    public void encodePassword(PasswordEncoder passwordEncoder) {
        this.password= passwordEncoder.encode(this.password);
    }

}

```

![](https://velog.velcdn.com/images/shawnhansh/post/64fe36ef-1587-4cbe-aafa-af3173140898/image.png)

이렇게 DTO 클래스에 설정한 Swagger는 Schemas탭에 제대로 표현이 되기도 하고,
에러 메세지에 "could not resolve reference : undefined undefined"를 보고 컨트롤러에 문제가 있겠다는 생각을 했습니다.

### Controller

``` java
@Operation(
        summary = "회원가입"
        , description = "새로운 유저의 정보를 DB에 저장한다."
    )
    @ApiResponses(value = {
        @ApiResponse(
            responseCode = "201"
            , description = "회원가입 성공"
        )
        , @ApiResponse(
            responseCode = "422"
            , description = "파라미터 유효성 부적합"
            , content = {@Content(schema = @Schema(implementation = ExceptionResponseDto.class))}
        )
        , @ApiResponse(
            responseCode = "400"
            , description = "이메일 혹은 닉네임 중복"
            , content = @Content(schema = @Schema(implementation = ExceptionResponseDto.class))
        )
    })
    @PostMapping("/join")
    public ResponseEntity<Object> join(@Valid @RequestBody JoinRequestDto dto) {
        log.debug("join{} invoked", dto);
        userService.createUser(dto);

        return new ResponseEntity<>(HttpStatus.CREATED);
    }
```
@ApiResponse의 content를 잘못 작성했다고 판단하고 검색해가며 여러 방법으로 content를 작성해봐도 상황은 똑같았어요.
에러 내용을 검색하면 circular reference 에러가 내용이 많이 나왔는데, 영어로 된 자료를 봐도 뚜렷하게 해결했다는 내용은 찾기 어려웠습니다.

### 정답은 SwaggerConfig에 있었다..!

며칠을 검색해봐도 뚜렷한 해결책은 보이지 않았고 일단은 함께 개발 중인 FE 개발자분들이 개발을 하셔야 했기 때문에 API에 대해 따로 말씀을 드렸습니다.

![](https://velog.velcdn.com/images/shawnhansh/post/49b4f377-89a0-476c-ab2e-2783bc095814/image.JPG)

이제 다시 이 문제를 해결하려면 어떡해야 고민하던 중에 현재 참여중인 개발자 오픈카톡방에 이 오류를 공유했는데 무려 10분도 되지 않아 실마리를 아는 분이 등장했습니다.

![](https://velog.velcdn.com/images/shawnhansh/post/c0b43aac-7251-4cce-ad7e-f352415f7602/image.JPG)

SwaggerConfig를 설정하기는 했는데 resolver를 추가하라는 말씀이 이해가 되지 않아 조심스럽게 다시 여쭤보았더니 코드까지 제공해주시며 도움을 주셨고, 이 방법으로 문제를 해결할 수 있었습니다.

![](https://velog.velcdn.com/images/shawnhansh/post/39f49039-7782-4b3b-80ab-fb9b895c34b7/image.JPG)

도움을 받아 수정한 SwaggerConfig의 코드는 아래와 같습니다.

``` java
@Configuration
public class SwaggerConfig {
    @Bean
    public Docket api(TypeResolver typeResolver) {
        return new Docket(DocumentationType.OAS_30)
        ///도움을 받아 추가한 부분 시작
                .additionalModels(
                        typeResolver.resolve(ExceptionResponseDto.class)
                )
        ///도움을 받아 추가한 부분 끝
                .useDefaultResponseMessages(false)
                .apiInfo(apiInfo())
                .select()
                    .apis(RequestHandlerSelectors.basePackage("com.withme.api.controller"))
                    .paths(PathSelectors.any())
                    .build();
    }

    private ApiInfo apiInfo() {
        return new ApiInfoBuilder()
                .title("WithMe")
                .description("WithMe API")
                .version("0.1")
                .contact(new Contact("[WithMe] API Docs", "https://github.com/Team-WithMe", "hansh9501@naver.com"))
                .build();
    }
}

```

Docket에 주석으로 시작과 끝을 표시해둔 부분이 해결 포인트였습니다.

.additionalModels는 인자로 받는 ResolvedType을 ModelRef에 추가해주는 역할을 합니다.
ResolvedType은 Docket을 Bean으로 return하는 메서드의 파라미터를 통해 주입받아 사용할 수 있습니다.

![](https://velog.velcdn.com/images/shawnhansh/post/cc0185d1-540a-4bc4-bba6-b6374d41a940/image.png)

이 방법으로 문제를 잘 해결하여 에러없이 응답을 제대로 확인할 수 있게 되었습니다.