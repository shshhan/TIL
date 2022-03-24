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
//Array : 간단한 경우에는 두가지 방법 모두 사용 가능
//숫자 자료형보다 복잡한 자료형이 사용될 경우에는 두번째 방법만 사용 가능
var firstArray = [1, 2, 3];
var secondArray = [4, 5, 6];
console.log(firstArray, secondArray);
function example(arg) {
    //label과 value속성 모두 string자료형인 객체의 배열
    ;
    ;
}
//object
//타입스크립트 객체 object는 원시 자료형이 아닌 모든 자료형 값을 가리킨다.
function greetUser1(user) {
    console.log("greetUser1 : hello ".concat(user.name)); //name 속성이 object 자료형에는 정의되어 있지 않음
}
greetUser1({ name: 'Shawn', age: 28 });
function greetUser2(user) {
    console.log("greetUser2 : hello ".concat(user.name));
}
greetUser2({ name: 'Shawn', age: 28 });
//tuple
//튜플을 사용하면 배열의 원소에 자료형을 정의할 수 있다.
//정의된 인덱스의 자료형은 알고 있지만, 배열에 새롭게 추가되는 원소의 자료형을 알 수는 없다.
var myTuple;
myTuple = ['hi', 5, 'bye'];
console.log(myTuple);
//enum
//열거형 enum을 이용하면 숫자 집합에 이름을 부여할 수 있다.
var Status1;
(function (Status1) {
    Status1[Status1["deleted"] = 0] = "deleted";
    Status1[Status1["pending"] = 1] = "pending";
    Status1[Status1["active"] = 2] = "active";
})(Status1 || (Status1 = {}));
;
var blogPostStatus1 = Status1.active;
console.log(blogPostStatus1); //2
var Status2;
(function (Status2) {
    Status2[Status2["deleted"] = -2] = "deleted";
    Status2[Status2["pending"] = -1] = "pending";
    Status2[Status2["active"] = 0] = "active";
})(Status2 || (Status2 = {}));
;
var blogPostStatus2 = Status2.active;
console.log(blogPostStatus2); //0
console.log(Status2[-1]); //pending
//any
//특정 변수의 값이 무엇이든 될 수 있음을 의미
//서드 파티 라이브러리가 ts를 지원하지 않거나, 기존 js코드를 활용하며 부분적으로 ts를 적용할 경우
//존재하지 않을 수 있는 속성과 메서드에 접근할 수 있도록 허용
var firstUser = {
    name: 'Shawn',
    age: 28
};
console.log(firstUser);
var secondUser = {
    name: 'Kim'
};
console.log(secondUser);
//void
//자료형이 없음을 정의
function storeValueInDatabase(objectToStore) {
    //객체를 받아서 DB에 저장하지만 아무것도 반환하지 않기 때문에 반환값을 void로 지정함
}
//never
//절대 발생하지 않는 값. 반환을 아예 하지 않거나, 항상 오류를 발생시키는 함수에 사용
function throwError(error) {
    throw new Error();
}
console.log('------------------');
