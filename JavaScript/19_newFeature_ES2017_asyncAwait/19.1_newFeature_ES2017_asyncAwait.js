//p.198
//일반적인 promise
fetch('https://api.github.com/users/shshhan').then(res =>{ //github에서 사용자 조회
    return res.json();
}).then(res => {
    console.log(res);
}).catch(err => {
    console.log(err);
});

function walk(amount){
    return new Promise((resolve, reject) => {
        if(amount < 500) {
            reject("the value is too small");
        }
        setTimeout(() => resolve(`you walked for ${amount}ms`), amount);
    });
}

// walk(1000).then(res => {
//     console.log(res);
//     return walk(500);
// }).then(res => {
//     console.log(res);
//     return walk(700);
// }).then(res => {
//     console.log(res);
//     return walk(100);
// }).then(res => {
//     console.log(res);
//     return walk(400);
// });


//async, await
function run(amount){
    return new Promise((resolve, reject) => {
        if(amount < 500){
            reject("the value is too small");
        }
        setTimeout(() => resolve(`you ran for ${amount}ms`), amount);
    });
}

//비동기 함수 선언
//async 키워드
//해당 키워드는 js에게 항상 promise를 반환하도록 지시
//promise가 아닌 값을 반환하게 작성하면 js가 해당 값을 자동으로 promise로 감싼 후 반환
//await 키워드는 비동기 함수 내에서만 작동
//await 키워드는 promise가 결과를 반환할 때까지 기다리도록 js에게 지시

// async function go() {
//     //프로미스가 완료될 때까지 기다리기 위해 await 키워드 사용
//     const res = await run(500);
//     console.log(res);
//     const res2 = await run(900);
//     console.log(res2);
//     const res3 = await run(600);
//     console.log(res3);
//     const res4 = await run(700);
//     console.log(res4);
//     const res5 = await run(400);
//     console.log(res5);
//     console.log('finished');    
// }

// go();

//일반 함수에서 await 키워드를 사용할 경우
// function func(){
//     let promise = Promise.resolve(1);
//     let result = await promise;
// }

// func(); //Uncaught SyntaxError: await is only valid in async functions and the top level bodies of modules

// let response = Promise.resolve("hi");
// let result = await response;    //Uncaught SyntaxError: await is only valid in async functions and the top level bodies of modules


//p.201
//오류처리
async function asyncFunc(){
    try{
        let response = await fetch('your-url');
    } catch(err){
        console.log(err);
    }
}

asyncFunc().catch(console.log);
