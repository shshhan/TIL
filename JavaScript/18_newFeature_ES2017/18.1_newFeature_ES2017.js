//p.186
//문자열 패딩 : padEnd(), padStart()

console.log("hello".padStart(10));  //입력값-문자열길이 = 공백
console.log("hello".padEnd(10));

//오른쪽 정렬
const strings = ["short", "very very very long string", "medium length"];

// const longestString = strings.sort(str => str.length).map(str => str.length)[0];    //이렇게 하면 가장 긴 문자열의 크기가 나와야하는것 같은데 안나옴..

//.sort(compareFunction(a, b))
//return이 음수면 a,b / 양수면 b, a / 0이면 다른 요소에 의해 정렬
const sorttedStrings = strings.sort((a, b) => {
    return a.length - b.length;
}).map(str => str.length);
console.log(sorttedStrings);

const longestStringLength = sorttedStrings.reverse()[0];
console.log(longestStringLength);

strings.forEach(str => console.log(str.padStart(longestStringLength)));


//패딩에 사용자 지정 값 추가
console.log("hello".padEnd(13, " Alberto"));
console.log('1'.padStart(3, 0));
console.log('99'.padStart(3, 0));



//Object.entries(), Object.values() : 객체에 접근
//ES5 이전
const family = {
    father : "Mcdonald",
    mother : "Wendy's",
    son : "BurgerKing",
};

console.log(Object.keys(family));
console.log(family.father);

//ES2017
console.log(Object.entries(family));
console.log(Object.values(family));

//p.189
//Object.getOwnPropertyDescriptors() : 객체가 소유한 모든 속성 설명자를 반환
const newObj = {
    name : "Shawn",
    age :28,
    greet() {
        console.log('hello');
    },
}

console.log(Object.getOwnPropertyDescriptors(newObj));


//후행 쉼표
//js는 처음부터 배열 리터럴에서 후행 쉼표를 허용했고, 객체 리터럴에 도입된 것은 ES5, 함수에 도입 된 것은 ES2017



//p.190
//atomics : 멀티 스레드 환경에서 메모리가 공유되는 환경에서도 정확하게 값을 읽고 쓸 수 있게 해준다.
//          atmoics를 이용한 작업은 다음 작업이 시작되기 전에 완료되고, 중단되지 않는것이 보장된다.
//.add() , .sub() , .and() , .or() , .xor() , load() , store()
//범용 고정길이 바이너리 데이터 버퍼를 표현하는 SharedArrayBuffer 객체와 함께 사용된다.

//SharedArrayBuffer 생성
const buffer = new SharedArrayBuffer(16);
const unit8 = new Uint8Array(buffer);

unit8[0] = 10;

//Atomics.add(array, index, value);
//array의 index번째 요소에 value를 더함
console.log(Atomics.add(unit8, 0, 5));

console.log(unit8[0]);

console.log(Atomics.load(unit8, 0));

//SharedArrayBuffer는 2018년 1월 5일자로 모든 주요 브라우저에서 기본적으로 비활성화 되었음. by.MDN