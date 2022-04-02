## $router.push() VS. location.href

Vue.js에 대해 공부하던 중 router를 공부하게 되었다.

router.js에 원하는 경로와 컴포넌트를 설정해준뒤 $router.push(경로)를 수행하면 해당 경로로 이동시켜주는 개념인데, 나는 이게 location.href와 유사하다고 느꼈다.

최근까지 나는 jsp에 javascript로 화면을 개발하며 화면 이동이 필요할 때는 location.href=”이동을 원하는 경로"의 방법으로 새로운 화면으로 이동해왔기 때문이다. 

유저가 보기에는 둘 다 새로운 화면으로 이동하는 개념인데 이 부분에서 location.href와의 차이점은 무엇일까 궁금해져서 테스트를 해보기로 했다.

## 테스트 준비

준비한 코드는 아래와 같다.

### router.js

```jsx
...
import Detail from './components/Detail.vue';
import Author from './components/Author.vue';
...

const routes = [
  {
    path: "/detail/:id",
    component: Detail,
    children : [
        {
            path : "author",
            component : Author,
        },
    ]
  },
...
```

- Nested Routes 기능으로 /detail/:id 이후에 author를 추가했다.

### Detail.vue

```jsx
<template>
  <h4>{{ blog[$route.params.id].title }}</h4>
  <p>{{ blog[$route.params.id].content }}</p>
     
  <button type="button" class="btn btn-primary" @click="moveToAuthor">제작자 보기 1</button>
  <button type="button" class="btn btn-primary" @click="$router.push('/detail/'+$route.params.id+'/author')">제작자 보기 2</button>

  <div class="mt-4 mb-4">
    <router-view :blogData="blog[$route.params.id]"></router-view>
  </div>

  <button type="button" class="btn btn-secondary" @click="$router.push('/list')">뒤로가기</button>
</template>

<script>
export default {
    name : 'Detail',
    methods : {
        moveToAuthor : function(){
            const url = window.location.href;

            if(!url.includes("author")){
                // $router.push(url + '/author');   script 태그 내부에서는 $router is not defined
                location.href = url + '/author';
            }
        },
    },
    props : {
        blog : Array,
    }
}
</script>
```

- “제작자 보기 1”이라는 내용의 버튼을 클릭하면 moveToAuthor라는 함수가 호출되고, 현재 URL에 “author”라는 단어가 없으면 “/detail/:id/author”로 location.href 방법으로 이동한다.
    
    - “/detail/:id/author” 경로에서 보여지는 화면은 Detail.Vue에 Author.vue 컴포넌트가 추가된 화면이기 때문에 버튼을 두번 이상 클릭 시 현재 URL 뒤에 “/author”를 붙인채로 새로운 요청을 계속 보내는 것을 예방하고자 URL에서 “author”유무를 판단하는 로직을 추가했다.
    
- “제작자 보기 2” 내용의 버튼을 클릭하면 “/detail/:id/author”로 vue router의 push 기능으로 이동한다.

### Author.vue

```jsx
<template>
    <div>   
      <h5>"{{blogData.title}}"의 제작자 "{{ blogData.author }}"</h5>
      <p>{{blogData.authorContent}}</p>
      <button type="button" class="btn btn-secondary" @click="$router.go(-1)">작가 소개 닫기</button>
    </div>
</template>

<script>
export default {
    name : 'Author',
    props : {
        blogData : Object,
    },
}
</script>
```

- Detail.vue의 <router-view> 태그 내부에 들어가게 될 Author.vue 내용이다.

## 테스트

두 버튼을 눌러보아도 화면상에서 차이없이 정상적으로 기능이 작동되었다.
하지만 자세히 보다보니 location.href로 이동한 페이지는 주소창 근처가 깜빡거리는걸 알 수 있었다.

  - location.href로 이동
![](https://media.vlpt.us/images/shawnhansh/post/273d1e94-7721-49bf-9c9a-2822572329e2/1.gif)
  
 - $router.push()로 이동
![](https://media.vlpt.us/images/shawnhansh/post/17dceefe-2bbb-499b-bcdc-049548691076/2.gif)


직감적으로 개발자도구의 네트워크 탭을 열고 다시 한번 비교해보았다.

  - location.href로 이동
![](https://media.vlpt.us/images/shawnhansh/post/5860293e-abc8-45f7-afe6-91e59479556d/3.gif)
  
- $router.push()로 이동
![](https://media.vlpt.us/images/shawnhansh/post/b29d631d-5d85-4633-9e7b-643bc2349d54/4.gif)


$router.push()로 이동하는 방법은 마치 시몬스 침대 같다. 이동을 하든 말든 변화 없이 계속 같은 상태를 보여준다.
반면 location.href는 주어진 URL로 새로운 요청을 보낸다.

심지어 Author.vue 내부에 있는 “작가 소개 닫기"버튼은 $router.go(-1)로 구현되어 있는데도 location.href로 이동한 경우에는 뒤로 갈 때 다시 한번 새로운 요청이 발생한다.

## 테스트를 해보고 난 뒤

‘$router.push()’를 사용하면 router.js에 등록되어있는 경로로 새로운 네트워크 요청없이 화면 전환이 가능하도록 구현되어 있는 것 같다.

직접 테스트해보기 전까지는 ‘vue를 사용하고 있으니까 vue에서 제공하는 기능을 쓰는게 더 효율적일까?’ 하는 막연한 생각이었는데, 직접 테스트를 해보니 router 기능을 사용해서 이동하는 방식이 왜 더 나은지 명확하게 알 수 있었다.

나란히 놓고 보니 왜 요즘은 웹도 SPA 형식을 선호하는지 바로 이해가 될 정도로 vue의 router를 활용하여 화면을 이동하는 방법이 매끄럽고 훨씬 세련되어 보인다.
이게 vue를 비롯하여 SPA를 쉽게 구현하도록 도와주는 프론트엔드 프레임워크를 사용하는 의미가 아닐까 생각해본다.