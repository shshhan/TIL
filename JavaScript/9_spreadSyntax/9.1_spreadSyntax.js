//p.112
//spread syntax(...)

//1.배열의 결합
const veggie = ['tomato', 'cucumber', 'beans'];
const meat = ['pork', 'beef', 'chicken'];

const menu = [...veggie, 'pasta', ...meat];
console.log(menu);

console.log('----------');


//2. 배열의 복사
const newVeggie = veggie;   //배열의 복사X, 배열 참조O

veggie.push('peas');
console.log('veggie : ', veggie);
console.log('newVeggie : ', newVeggie);

console.log('----------');


//ES5에서 배열 복사
const newVeggie2 = [].concat(veggie);   //빈 배열을 생성하고, 기존 배열의 값을 새 배열에 이어 붙인다.
veggie.pop('peas');
console.log('veggie : ', veggie);
console.log('newVeggie2 : ', newVeggie2);

console.log('----------');

//with spread syntax
const newVeggie3 = [...veggie];
veggie.unshift('lettuce');
console.log(veggie);
console.log(newVeggie3);

console.log('----------');

//3.function and spread syntax
//기존 방식
function doStuff(x, y, z){
    console.log(x, y, z);
}

var args = [0, 1, 2];

doStuff.apply(null, args);

//with spread syntax
doStuff(...args);
console.log(args);

console.log('----------');

const name = ['Shawn', 'Han', 'Jr.'];

function greet(first, last){
    console.log(`hello ${first} ${last}`);
}

greet(...name); //인수보다 더 많은 값을 제공하면 앞에서 부터 순서대로 적용

console.log('----------');


//객체 리터럴과 스프레드(ES2018)
let person = {
    name : 'Shawn',
    surname : 'Han',
    age : 28,
};

let clone = {...person};
console.log(clone);

console.log('----------');


//rest syntax
//문법의 모양은 똑같지만 기능은 다름
//여러 원소를 하나의 원소로 압축
const friends = ['Tom', 'Paul', 'Sean', 'Mike'];
const [first, second, ...losers] = friends;

console.log(...losers);