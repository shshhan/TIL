//p.236
//자바스크립트는 강타입 언어가 아니므로 더 유연하고 다른 자료형의 값도 수용할 수 있지만,
//코드가 더 혼란스러워지고 버그가 발생하기도 쉽다는 단점이 있다
function getUserById(userId) {
    //여기서 파라미터 userId의 자료형은 코드를 보지 않으면 알 수 없다.
}
function getUserById_(userId) {
    //타입스크립트를 사용하면 위와 같이 작성
}
//타입스크립트는 자료형이 있는 자바스크립트의 상위집합(superset)
// --> 타입스크립트 파일에 자바스크트를 작성해도 오류가 발생하지 않는다.
var greeter = function (name) {
    console.log("hello ".concat(name));
};
greeter('Shawn');
//ts파일은 디렉토리에서 tsc xxx.ts 명령어를 실행하면 .js 파일이 생성된다
//Typescript 기본 자료형 :
//boolean, number, string, Array, object, 튜플, enum, any, void, null과 undefined, never
//Array
var firstArray = [1, 2, 3];
var secondArray = [4, 5, 6];
console.log(firstArray, secondArray);
