//p.206
//객체에 레스트, 스프레드 연산자 사용

//ES6 - 배열에 가능
const veggie = ['tomato', 'cucumber', 'beans'];
const meat = ['pork', 'beef', 'steak'];

const menu = [...veggie, 'pasta', 'pizza', ...meat];
console.log(menu);


//ES2018 - 객체에도 가능
let newObj = {
    a : 1,
    b : 2, 
    c : 4,
    d : 8,
};

let {a, b, ...z} = newObj;
console.log(a); //1
console.log(b); //2
console.log(z); //{c: 4, d: 8}

//참조X. 새로운 객체를 생성해 값 복사
let clone = {...newObj};
console.log(clone);

newObj.e = 15;
console.log(clone);
console.log(newObj);


//p.207
//asynchronous Iterator(비동기 반복) : for-await-of
//비동기 반복자는 next() 메서드가 {value, done} 쌍에 대한  promise를 return한다는 점을 제외하면 동기 반복자와 매우 유사하다

// const iterables = [1, 2, 3];

// async function test() {
//     for await (const value of iterables){
//         console.log(value);
//     }
// }

// test();


//p.208
//Promise.prototype.finally()
//.finally() 또한 promise를 반환하므로 .then()과 .catch()를 계속 연결할 수 있지만, 연결된 promise는 .finally()가 아닌 그 전의 promise가 반환한 값을 전달받게 된다ㅎ.
const myPromise = new Promise((resolve, reject) => {
    resolve();
});

myPromise.then(() => {
    console.log('still working');
    return 'still working';
}).catch(() => {
    console.log('there was an error');
}).finally(() => {
    console.log('Done!');
    return 'Done!';
}).then(res=> {
    console.log(res);   //finally()이전의 return값을 받음
})