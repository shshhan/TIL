const name = "Shawn";
const surname = "Han";
const age = 28;
const nationality = "Korean";

//선언된 변수로 객체 만들기
//ES5
const person = {
    name : name,
    surname : surname,
    age : age,
    nationality : nationality,
};

console.log(person);

//ES6
//변수 이름이 prpoerty와 동일하면 굳이 코드내에서 두번씩 표기하지 않아도 된다.
const personEs6 = {
    name,
    surname,
    age,
    nationality,
};

console.log(personEs6);

console.log('----------');

//객체에 함수 추가
//ES5
const obj = {
    name : 'Shawn',
    greet : function(){
        console.log('Hello!');
    }
}
obj.greet();

//ES6
const object = {
    name : "Shawn",
    greet(name){
        console.log(`Hello ${name}!`);
    }
}
object.greet(object['name']);

console.log('----------');


//화살표 함수는 익명함수. 함수에 접근하기 위한 key가 없어 syntax error
// const person1 = {
//     () => console.log('Hello!'),
// };

const person2 = {
    greet : () => console.log('Hello!'),
}
person2.greet();
    
console.log('----------');


//객체의 속성 동적 정의
//ES5
var name1 = "myname";
var p = {};
p[name1] = "Shawn";
console.log(p.myname);

//ES6
const name2 = "myname";
const p2 = {
    [name2] : "Shawn Han",
}
console.log(p2.myname);