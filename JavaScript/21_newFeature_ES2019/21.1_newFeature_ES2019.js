//p.216
//Array.prototype.flat() : 지정한 깊이까지 배열을 재귀적으로 평면화 default=1

const letters = ['a', 'b', ['c', 'd', ['e', 'f']]];

console.log(letters.flat());    //['a', 'b', 'c', 'd', Array(2)]
console.log(letters.flat(2));   //['a', 'b', 'c', 'd', 'e', 'f']
console.log(letters.flat().flat()); //['a', 'b', 'c', 'd', 'e', 'f']
console.log(letters.flat(Infinity));

//Array.prototype.flatMap() : 새로운 값으로 매핑되어 생긴 배열을 평면화
let greeting = ["Greetings from", " ", "Vietnam"];

//.map()을 사용하면 배열안에 배열이 중첩된 결과를 얻게 된다.
console.log(greeting.map(x => x.split(" ")));   // [Array(2), Array(2), Array(1)]

//.flatMap()을 사용하면 평면화 가능
console.log(greeting.flatMap(x => x.split(" ")));


//Object.fromEntries() : key value 쌍으로 이뤄진 객체를 return
//배열 , map 등 iterable한 객체는 무엇이든 인수로 전달 가능
const keyValueArray = [
    ['key1', 'val1'],
    ['key2', 'val2']
];

const obj = Object.fromEntries(keyValueArray);
console.log(obj);


//p.218
//String.prototype.trimStart() : 문자열 시작부분 공백제거
//String.prototype.trimEnd() : 문자열 끝부분 공백제거

let str = "                   this string has a lot of whitespace                    ";

console.log(str.length); //74
str=str.trimStart();
console.log(str.length); //55   
str=str.trimEnd();
console.log(str.length); //35


//선택적 catch 할당 : ES2019 전에는 catch 절에 항상 예외 변수를 포함해야 했지만 이제 생략 가능
//ES2019 이전
try {
    ;;
} catch(error){
    ;;
}

//ES2019
try{
    ;;
} catch{
    ;;
}


//Function.prototype.toString() : 소스 코드를 나타내는 문자열을 반환
function sum(a, b){
    //합계를 구하는 함수
    return a + b;
}

console.log(sum.toString());    //주석까지 모두 표현


//Symbol.prototype.description : 해당 심벌 객체의 설명을 반환한다.
const me = Symbol("Shawn");
console.log(me.description); //Shawn
console.log(me.toString); //toString() { [native code] }