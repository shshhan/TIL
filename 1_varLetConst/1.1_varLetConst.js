//p.50
//var : 함수 스코프에 종속된다.
//for루프 내에서 선언하면 밖에서도 쓸 수 있지만, 함수 내에서 선언하면 함수 안에서만 사용 가능

for(var i = 0; i < 10; i++){
    var leak = "I am available outside of the loop";
}

console.log(leak);

function myFunc() {
    var functionScoped = "I am availabe insdie this function";
    console.log(functionScoped);
}

myFunc();

// console.log(functionScoped); //ReferrenceError


//p.51
//let과 const는 선언된 블록 스코프에 종속
//var는 블록 스코프 외부에서 접근이 가능하므로 바깥에서 값이 변경됨

let x = "global";

if(x === "global"){
    let x = "block-scoped";

    console.log("inside the block : ", x);  //block-scoped
}

console.log("outside the block : ", x); //global


var y = "global";

if (y === "global"){
    var y = "block-scoped";
    
    console.log("inside the block : ", y);  //block-scoped
}

console.log("outside the block : ", y); //block-scoped


//p.52
//const도 let과 같지만 값을 재할당 할 수 없고, 다시 선언할 수 없다.

const constant = "I am a constant";
// constant = "I can't be reassigned";  //uncaught TypeError

const person = {
    name : "Shawn",
    age : 25,
};

console.log(person);

person.age = 28;            //const로 선언한 변수 전체 재할당이 아닌 속성 재할당은 가능하다.
person.name = "Shawn Han";

console.log(person);
console.log(person.name);
console.log(person.age);

//속성을 변경하지 못하게 할 수 있지만 그렇다고 변경시 오류가 발생하지는 않는다.
Object.freeze(person);
person.age = 55;

console.log("person.age after Object.freeze(person) :", person.age);