//p.104

//1. Array.from()
//배열처럼 보이지만 배열이 아닌 객체를 실제 배열로 변환해 반환

//첫번째 방법
const fruits = document.querySelectorAll('.fruits p');

const fruitArray = Array.from(fruits);

console.log(fruitArray);

const fruitNames = fruitArray.map(fruit => fruit.textContent);

console.log(fruitNames);

//간소화된 방법
const fruits2 = Array.from(document.querySelectorAll('.fruits p'));
const fruitNames2 = fruits2.map(fruit => fruit.textContent);

console.log(fruitNames2);

//Array.from()의 두번째 인수를 활용한 방법
const fruits3 = document.querySelectorAll('.fruits p');
const fruitArray3 = Array.from(fruits, fruit => {
    console.log(fruit);
    return fruit.textContent;
})
console.log(fruitArray3);

console.log("----------");


//2. Array.of()
//모든 인수로 배열 생성
const digits = Array.of(1, 2, 3, 4, 5);
console.log(digits);

console.log("----------");


//3. Array.find();
//제공된 테스트함수를 충족하는 배열의 첫번째 원소 반환
//없으면 undefined 반환
let found = digits.find(e => e > 3);
console.log(found);

console.log("----------");


//4. Array.findIndex()
//조건과 일치하는 첫번째 원소의 인덱스 반환
const greetings = ['hello', 'hi', 'bye', 'goodBye', 'hi'];

let foundIdx = greetings.findIndex(e => e === 'hi');
console.log(foundIdx);

console.log("----------");


//5. Array.some() & Array.every()
//Array.some() : 조건과 일치하는 우너소가 있는지 검색
//Array.every() : 모든 원소가 주어진 조건과 일치하는지 여부 확인
const numbers = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];

let arraySome = numbers.some(e => e > 2);
console.log(arraySome);

let arrayEvery = numbers.every(e => e > 2);
console.log(arrayEvery);
