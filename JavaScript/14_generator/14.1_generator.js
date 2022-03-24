//p.156
//generator : 원하는만큼 코드실행을 시작하거나 중지할 수 있는 함수

//선언 : function* functionName(){};
//반환 : yield
//실행 : .next()

function* fruitList(){
    yield 'Banana';
    yield 'Apple';
    yield 'Orange';
}

const fruits = fruitList();

console.log(fruits.next()); //{value: 'Banana', done: false}
console.log(fruits.next()); //{value: 'Apple', done: false}
console.log(fruits.next()); //{value: 'Orange', done: false}
console.log(fruits.next()); //{value: undefined, done: true}

console.log('----------');


//array with generator
const foods = ['Pizza', 'Fried chicken', 'Burger', 'Steak', 'Barbeque', 'Sandwich'];

function* loop(arr){
    for(const item of arr){
        yield `I like to eat ${item}s`;
    }
}

const foodGenerator = loop(foods);
console.log(foodGenerator.next());
console.log(foodGenerator.next());
console.log(foodGenerator.next().value);
console.log(foodGenerator.return());    //.return()으로 generator 종료가능

console.log('----------');


//.throw() : generator가 오류를 반환하고 종료.
function* gen(){
    try{
        yield "Tyring..";
        yield "Tyring harder..";
        yield "Tyring even harder..";
    }
    catch(err){
        console.log("Error : " + err);
    }
}

const myGenerator = gen();
console.log(myGenerator.next());
console.log(myGenerator.throw("ooooooops"));

console.log('----------');


//p.159
//generator with promise
const myPromise = () => new Promise((resolve) => {
    resolve('our value is...');
});

function* gen() {
    let result = "";
    yield myPromise().then(data => { result = data});
    yield result + '2';
};

const asyncFunc = gen();
const val1 = asyncFunc.next();
console.log(val1);

val1.value.then(() => {
    console.log(asyncFunc.next());
})