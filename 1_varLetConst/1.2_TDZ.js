//p.53
//TDZ(Temporal Dead Zone) : 일시적 비활성 구역
//var : 정의되기 전에 접근할 수 있지만 값에는 접근할 수 없다.
//let, const : 정의하기 전에 접근할 수 없다.

console.log(i); //undefined
var i = "I am a variable";

console.log(j); //Uncaught ReferenceError
let j = "I am a let";

//var, let, const 모두 hoisting의 대상이 된다.
//hoisting : 인터프리터가 변수와 함수의 메모리 공간을 선언 전에 미리 할당하는 것.
//hoisting시 var는 undefined로 초기화
//let과 const는 변수가 선언될 때 까지 TDZ에 있으므로 초기화하지 않음

//https://developer.mozilla.org/ko/docs/Glossary/Hoisting
