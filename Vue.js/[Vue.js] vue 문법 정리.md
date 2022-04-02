![](https://media.vlpt.us/images/shawnhansh/post/da4186b1-87c2-454f-b5ac-f3162ca855fa/image.png)

나는 **훌륭한 백엔드 개발자가 될 예정**이지만 원활한 협업을 위해서라도 기본적인 프론트엔드 지식은 필요하다고 생각한다.

감사히도 이전 직장에서 3개월간 혹독하게 갈려나가며 여러 프로젝트를 수행했고,,
그 과정에서 퍼블리싱 되어있는 jsp에 javascript로 Ajax를 통한 비동기 서버 통신과 응답 데이터에 따라 DOM을 조작하는 함수들을 만들며 프론트엔드 경험을 해보았다.

하지만 소위 말하는 프론트엔드 프레임워크 3대장(React, Vue, Angular)에 대한 지식이 하나도 없었기 때문에 “저 프론트엔드도 조금은 할 줄 알아요"라는 말을 하기가 부끄러웠다. 그래서 지난 2월부터 조금씩 Vue.js를 공부중이다!

Vue.js를 선택한 이유 중 하나는 세 프레임워크 중 빠르게 배워서 빠르게 적용하기 가장 쉬워보였기 때문이다.
Vue.js가 익숙해지고, 나도 더욱 유능한 백엔드 개발자가 된다면 이후에 React도 건드려보고 싶다!

아무튼 본론으로 돌아와서 이 포스팅은 Vue.js를 조금씩 공부하며 정리한 기본적인 문법이다.
아직도 vue.js에 대해 공부하는 중이므로 새로운 문법에 대해서는 이 포스팅에 덧붙이며 이어 나갈 생각이다.

## 데이터 바인딩

```html
<template>
  <h4 :style="h4Style" :class="h4Class"> 키</h4>
  <p> {{ height }}cm </p>
</template>
```

```jsx
<script> 
export default {
  name : 'App',
  data(){
    return {
      height : 160,
      h4Style : "color : blue",
      h4Class : "newh4",
    }
  }
}

</script>
```
- data() > return{ } 에 데이터를 선언 후 html에서 {{  }}(mustach expression)에서 변수를 호출
- 태그 내부에서 속성으로 사용할 때에는 :를 붙여서 선언


## 반복문 v-for

```html
<template>
  <div class="menu" v-for="data in menuNames" :key="data">
    <h3>{{ data }}</h3>
  </div>
  <div class="menu" v-for="(data, i) in menuNames" :key="data">
    <h3>{{ menuNames[i] }}</h3>
  </div>
</template>
```

```jsx
<script>
export default {
  name : 'App',
  data(){
    return {
      menuNames : [Burger, Pizza, Pasta, Fried Chicken],
    }
  }
}

</script>
```

- 반복하고 싶은 태그에 속성으로 v-for을 선언한다.
- v-for="data in menuNames" :key="data"
menuNames의 크기만큼 반복하며 menuNames 배열의 자료가 순차적으로 data에 할당된다.
    
- v-for="(data, i) in menuNames" :key="data"   
속성에 변수가 하나 추가되었다.
index 변수를 추가하고 싶을 때 사용하는 방법으로, menuNames의 크기만큼 반복문이 돌 때 0부터 1씩 커진다.

## Vue EventHandler

```html
<template>
  <div class="menu" v-for="(el, i) in menuNames" :key="i">
    <h3>{{ el }}</h3>
    <button @click="likeCnt[i]++">like : {{ likeCnt[i] }}<button>
    <button @click="increaseLikeCnt(i)">like : {{ likeCnt[i] }}<button>
  </div>
</template>
```

```jsx
<script>
export default {
  name : 'App',
  data(){
    return {
      menuNames : [Burger, Pizza, Pasta, Fried Chicken],
      likeCnt = [0, 0, 0, 0],
    }
  },
  methods : {
    increaseLikeCnt(i) {
      this.likeCnt[i]++;
      alert('Thank you!');
    }
  }
}

</script>
```

- 태그 속성에 @를 붙여 이벤트를 생성한다.
- ex) @click, @mouseover, @input, @keydown.enter 등등..
- 내부에 바로 JS 적용이 가능하고, 함수 호출도 가능하다.
- 함수는 methods 객체 내부에 선언되어 있어야 한다.
- 이벤트 수식어를 활용할 수 있다.
    
    ### 이벤트 수식어
    
    공식 문서 : [https://kr.vuejs.org/v2/guide/events.html#이벤트-수식어](https://kr.vuejs.org/v2/guide/events.html#%EC%9D%B4%EB%B2%A4%ED%8A%B8-%EC%88%98%EC%8B%9D%EC%96%B4)
    잘 정리된 글 : [https://hj-tilblog.tistory.com/85](https://hj-tilblog.tistory.com/85)
    

## 조건문 v-if

```html
<div class="newModal" v-if="modalStatus">
  <h3>모달</h3>
  <p> 모달 페이지 입니다. </p>
</div>
<div>
  <button @click="modalStatus = true">모달 열기 버튼<button>
</div>
```

```jsx
<script>
export default {
  name : 'App',
  data(){
    return {
      modalStatus : false,
    },
  }
}

</script>
```

- 상태에 따라 보여주고자 하는 html 태그의 UI 상태를 데이터로 저장해둔다.
예제에서는 modalStatus라는 데이터를 false로 선언해두었다.    
- 태그 내에 v-if 속성의 값으로 선언한 데이터를 넣어주면 데이터의 true/false에 따라 UI 표시 여부를 판단한다.

## import & export

```jsx
(store.js)

let orange = 15;
export default orange
```

```jsx
(App.vue)

<script>
import orange from'./store.js'

export default {
  name : "app",
  data(){
    return {
      dataFromStore : orange,
    }
  },
}
</script>
```

- 다른 곳에서도 사용할 데이터를 내보낼 때는 export default + 변수명
export default는 파일 마지막에 딱 한번만 적을 수 있다.  
- import 변수명 from ‘경로’
경로에서 export한 데이터를 변수명으로 가져와서 사용할 수 있다.  
- import한 데이터 할당 시 원하는 변수명으로 받을 수 있다.

```jsx
(store.js)

let orange = 15;
let banana= 4;
export { orange, banana }
```

```jsx
(App.vue)

<script>
import { orange, banana } from'./store.js'

export default {
  name : "app",
  data(){
    return {
      orange : orange,
      banana : banana,
    }
  },
}
</script>
```

- export 할게 많으면 export{변수명1, 변수명2, ...}를 사용한다.
export는 원하는 만큼 사용 가능하다.  
- export{변수명1, 변수명2, ...}에 대해서는 할당시 import한 변수명을 그대로 적어야 한다.

```jsx
(store.js)

export default [
  {
    id : 0,
    name : "oragne",
    price : 15
  }, {
    id : 1,
    name : "banana",
    price : 7
  },
];
```

```jsx
(App.vue)

<script>
import fruitsData from'./store.js'
	
export default {
  name : "app",
  data(){
    return {
      fruitsData,
    }
  }
}
</script>
```
- export할 데이터가 많을 경우에는 export default 안에 데이터를 넣는 것이 편하다.
- import한 변수명을 그대로 사용하고자 할 경우에는 예제처럼 이름만 선언해주어도 된다.(JS ES6 문법)