//p.144
//javascript : synchronous
//비동기적으로 수행될 때(서버통신 등) 순서대로 로직을 실행시키기 위한 코드를 짜다가 callback hell!

//promise 예제 콘솔 확인 시에는 원하는 부분만 주석 풀고 하기!
//여러 promise들이 콘솔에 찍히며 꼬여서 정확한 확인이 어렵기 때문

// //p.146
// //promise : 비동기 작업의 최종 성공 또는 실패를 나타내는 객체
// const myPromise = new Promise((resolve, reject) => {
//     setTimeout(() => {
//         // resolve("The value we get from the promise");
//         reject(new Error("this is our error")); //new Error로 처리하면 console에서 error 발생 위치 확인 가능
//     }, 2000);
// });

// //promise가 성공할 때 .then(), 실패할 때 .catch()
// myPromise.then(
//     data => {
//         console.log(data);
//         console.log('----------');
//     }
// ).catch(err => {
//     console.error(err);
//     console.log('----------');
// });



// //promise chaining
// const secondPromise = new Promise((resolve, reject) => {
//     resolve();
// });

// secondPromise
//     .then(data => {
//         //새로운 값을 반환
//         return 'working...';
//     })
//     .then(data => {
//         //이전 프로미스에서 받은 값을 출력
//         console.log(data);
//         throw 'failed';
//     })
//     .catch(err => {
//         //프로미스 수행 중 발생한 오류를 받아서 출력
//         console.error(err);
//         console.log('----------');
//     });


// const thridPromise = new Promise((resolve, reject) => {
//     resolve();
// });

// thridPromise
//     .then(data => {
//         throw new Error("OOOOOOPS");
//         console.log('first value');
//     }).catch(() => {
//         console.log('catched an error');
//     }).then(data => {
//         console.log('second value');
//         console.log('----------');
//     });



//Promise.resolve() : promise 즉시 성공처리
// -> promise((resolve, reject) => {});에 의해 첫번째 인수가 호출
Promise.resolve('Success')
.then(function(value){
    console.log('Success');
}, function(value){
    console.log('fail');
});

//Promise.reject() : promise 즉시 실패처리
// -> promise((resolve, reject) => {});에 의해 두번째 인수가 호출
Promise.reject(new Error('fail'))
.then(function(){
    //not called
}, function(error){
    console.log(error);
})


//두개의 독립적인 promise가 독립적으로 성공처리
const promise1 = new Promise((resolve, reject) => {
    setTimeout(resolve, 500, 'first val');
});
const promise2 = new Promise((resolve, reject) => {
    setTimeout(resolve, 1000, 'second val');
});

promise1.then(data => {
    console.log(data);
});
promise2.then(data => {
    console.log(data);
});

//Promise.all() 
// : 모든 promise가 성공할 경우에만 성공하는 하나의 promise return
// : promise 중 하나라도 실패하면 전체를 실패로 처리
const promise3 = new Promise((resolve, reject) => {
    setTimeout(resolve, 500, 'third value');
});
const promise4 = new Promise((resolve, reject) => {
    setTimeout(resolve, 1000, 'fourth value');
});

Promise
.all([promise3, promise4])
.then(data => {
    console.log(data);  
    const [promise3data, promise4data] = data;
    console.log(promise3data, promise4data);
});

const promise5 = new Promise((resolve, reject) => {
    resolve('fifth value');
});
const promise6 = new Promise((resolve, reject) => {
    reject(Error('ooops! error occurred'));
});

Promise
.all([promise5, promise6])
.then(data => {
    const[promise5data, promise6data] = data;
    console.log(promise5data, promise6data);
})
.catch(err => {
    console.log(err);
});


//promise.race() : 가장 먼저 성공 또는 실패한 결과를 반환
const promise7 = new Promise((resolve, reject) => {
    setTimeout(resolve, 1000, 'seventh value');
});
const promise8 = new Promise((resolve, reject) => {
    setTimeout(resolve, 100, 'eighth value');
})

Promise
    .race([promise7, promise8])
    .then(function(value){
        console.log(value);
    });