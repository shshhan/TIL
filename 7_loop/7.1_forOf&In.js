//p.98
//for of

const fruits = ['apple', 'banana', 'orange'];
for(var i = 0; i< fruits.length; i++){
    console.log(fruits[i]);
}

console.log("---------");

for(const fruit of fruits){
    console.log(fruit);
}

//객체는 iterable하지 않다.
//객체의 key/value에 대한 반복 구현 방법
const car = {
    maker : 'bmw',
    color : 'red',
    year : '2020',
};

console.log("---------");

for(const prop of Object.keys(car)){
    const value = car[prop];
    console.log(prop, value);
}

console.log("---------");

//for in
//순서없이 객체의 모든 열거 가능한 속성을 반복
for(const property in car){
    console.log(property, car[property]);
}

//for of와 for in의 차이
let list = [4, 5, 6];

//for in은 키의 목록을 반환
for(let i in list){
    console.log(i);
}

console.log("---------");

//for of는 값을 반환
for(let i of list){
    console.log(i);
}